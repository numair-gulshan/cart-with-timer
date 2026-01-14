import { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useCart } from "../context/CartContext";

export default function ProductListScreen() {
  const { products, addToCart, cart } = useCart();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAdd = async (id: number) => {
    setLoadingId(id);
    await addToCart(id);
    setLoadingId(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.stock}>Stock: {item.availableStock}</Text>

            <Button
              title={loadingId === item.id ? "Adding..." : "Add to Cart"}
              onPress={() => handleAdd(item.id)}
              disabled={item.availableStock === 0 || loadingId === item.id}
            />
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/cart")}
        >
          <View style={styles.cartButtonContent}>
            <Text style={styles.cartButtonText}>Open Cart</Text>
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

  stock: {
    marginVertical: 5,
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

  cartButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#000",
  },

  cartButtonContent: {
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

  cartButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
