import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCart } from "../context/CartContext";

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function CartScreen() {
  const { cart, removeReservation } = useCart();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (cart.length === 0) {
    return <Text style={{ padding: 10 }}>Cart is empty</Text>;
  }

  const handleRemove = (id: string) => {
    removeReservation(id);
  };

  const handleCheckout = () => {
    cart.forEach((c) => removeReservation(c.id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        extraData={now}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Expires in: {formatRemaining(item.expiresAt - now)}</Text>
            <View style={styles.removeButton}>
              <Text
                onPress={() => handleRemove(item.id)}
                style={styles.removeButtonText}
              >
                Remove
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <View style={styles.checkoutButtonContent}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>

            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  productContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },

  removeButton: {
    marginTop: 5,
  },

  removeButtonText: {
    color: "#ff3b30",
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    padding: 10,
    borderTopWidth: 1,
    backgroundColor: "#fff",
  },

  checkoutButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#000",
  },

  checkoutButtonContent: {
    alignItems: "center",
    flexDirection: "row",
  },

  badge: {
    height: 24,
    minWidth: 24,
    marginLeft: 10,
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 5,
    justifyContent: "center",
    backgroundColor: "#ff3b30",
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
  },

  checkoutButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
