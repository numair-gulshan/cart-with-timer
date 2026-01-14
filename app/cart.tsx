import { FlatList, Text, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartScreen() {
  const { cart } = useCart();

  if (cart.length === 0) {
    return <Text style={{ padding: 16 }}>Cart is empty</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ marginBottom: 8 }}>{item.name}</Text>
        )}
      />
    </View>
  );
}
