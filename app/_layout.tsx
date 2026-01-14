import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";

export default function Layout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Products" }} />
        <Stack.Screen name="cart" options={{ title: "Cart" }} />
      </Stack>
    </CartProvider>
  );
}
