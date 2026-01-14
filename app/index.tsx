import { Link } from "expo-router";
import { Button, FlatList, Text, View } from "react-native";
import { useCart } from "../context/CartContext";

const PRODUCTS = [
  { id: 1, name: "iPhone" },
  { id: 2, name: "MacBook" },
  { id: 3, name: "AirPods" },
];

export default function ProductsScreen() {
  const { addToCart } = useCart();

  return (
    <View style={{ padding: 16 }}>
      <Link href="/cart" style={{ marginBottom: 16 }}>
        Go to Cart →
      </Link>

      <FlatList
        data={PRODUCTS}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Text>{item.name}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item)} />
          </View>
        )}
      />
    </View>
  );
}
