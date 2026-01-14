import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ProductBase = {
  id: number;
  name: string;
  stock: number;
};

type Reservation = {
  id: string;
  productId: number;
  expiresAt: number;
};

type CartItem = {
  id: string;
  productId: number;
  name: string;
  expiresAt: number;
};

type Product = ProductBase & { availableStock: number };

type CartContextType = {
  products: Product[];
  cart: CartItem[];
  addToCart: (productId: number) => Promise<boolean>;
  removeReservation: (reservationId: string) => void;
  getAvailableStock: (productId: number) => number;
};

const STORAGE_KEY = "reservations_v1";

const CartContext = createContext<CartContextType | null>(null);

const INITIAL_PRODUCTS: ProductBase[] = [
  { id: 1, name: "iPhone", stock: 5 },
  { id: 2, name: "MacBook", stock: 3 },
  { id: 3, name: "AirPods", stock: 8 },
  { id: 4, name: "iPad", stock: 4 },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [productsBase] = useState<ProductBase[]>(INITIAL_PRODUCTS);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed: Reservation[] = JSON.parse(raw);
        const now = Date.now();
        const valid = parsed.filter((r) => r.expiresAt > now);
        if (!mounted) return;
        setReservations(valid);

        valid.forEach(scheduleRemoval);
      } catch (e) {
        console.warn("Failed to load reservations", e);
      }
    })();

    return () => {
      mounted = false;
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservations)).catch((e) =>
      console.warn("Failed to persist reservations", e)
    );
  }, [reservations]);

  function scheduleRemoval(reservation: Reservation) {
    const ms = reservation.expiresAt - Date.now();
    if (ms <= 0) return;
    if (timersRef.current.has(reservation.id)) return;
    const t = setTimeout(() => {
      removeReservation(reservation.id);
    }, ms);
    timersRef.current.set(reservation.id, t);
  }

  function removeTimer(id: string) {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }

  function removeReservation(id: string) {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    removeTimer(id);
  }

  function getReservedCount(productId: number) {
    const now = Date.now();
    return reservations.filter(
      (r) => r.productId === productId && r.expiresAt > now
    ).length;
  }

  function getAvailableStock(productId: number) {
    const base = productsBase.find((p) => p.id === productId);
    if (!base) return 0;
    const reserved = getReservedCount(productId);
    return Math.max(0, base.stock - reserved);
  }

  async function addToCart(productId: number): Promise<boolean> {
    const available = getAvailableStock(productId);
    if (available <= 0) return false;
    const id = `${productId}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;
    const expiresAt = Date.now() + 5 * 60 * 1000; 
    const reservation: Reservation = { id, productId, expiresAt };
    setReservations((prev) => {
      const next = [...prev, reservation];
      return next;
    });
    scheduleRemoval(reservation);
    return true;
  }

  const products: Product[] = productsBase.map((p) => ({
    ...p,
    availableStock: getAvailableStock(p.id),
  }));

  const cart: CartItem[] = reservations
    .map((r) => {
      const prod = productsBase.find((p) => p.id === r.productId);
      if (!prod) return null;
      return {
        id: r.id,
        productId: r.productId,
        name: prod.name,
        expiresAt: r.expiresAt,
      };
    })
    .filter(Boolean) as CartItem[];

  return (
    <CartContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeReservation,
        getAvailableStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
