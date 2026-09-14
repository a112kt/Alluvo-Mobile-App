import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { scale, verticalScale } from "react-native-size-matters";
import ProductImage from "../../ProductImage";

const products = [
  {
    id: "1",
    name: "Red Shoes",
    price: "2500.00 EGP",
    rating: "⭐⭐⭐⭐",
    image: require("../../../assests/imgs/no-image-icon-23494.png"),
  },
  {
    id: "2",
    name: "Blue Jacket",
    price: "3500.00 EGP",
    rating: "⭐⭐⭐⭐⭐",
    image: require("../../../assests/imgs/no-image-icon-23494.png"),
  },
  {
    id: "3",
    name: "Black Hat",
    price: "500.00 EGP",
    rating: "⭐⭐⭐⭐",
    image: require("../../../assests/imgs/no-image-icon-23494.png"),
  },
];

import { useNavigation } from "@react-navigation/native";

export const ProductCard = ({ item }: { item: any }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
    >
      <ProductImage item={item} style={styles.img} />
      <Text style={styles.name} numberOfLines={1}>{item.productName || item.name}</Text>
      <Text style={styles.price}>{item.price} {item.price && typeof item.price === 'number' ? 'EGP' : ''}</Text>
      <Text style={styles.rating}>
        {typeof item.rate === 'number' ? "⭐".repeat(item.rate) : item.rating}
      </Text>
      <View style={styles.outlinedButton}>
        <Text style={styles.outlinedButtonText}>More Details</Text>
      </View>
    </TouchableOpacity>
  );
};

const ProductList = () => {
  return (
    <View style={{ paddingVertical: 10 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  card: {
    width: scale(140),
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#1b235166",
    gap: 2,
  },
  img: {
    width: "100%",
    height: scale(80),
    borderRadius: 10,
    resizeMode: "cover",
  },
  name: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: scale(12),
  },
  price: {
    color: "#FFFFFFAA",
    fontSize: scale(11),
  },
  rating: {
    color: "#FFD700",
    fontSize: scale(11),
  },
  outlinedButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#47C0D2",
    borderRadius: 8,
    paddingVertical: verticalScale(6),
    alignItems: "center",
  },
  outlinedButtonText: {
    color: "#47C0D2",
    fontSize: scale(11),
    fontWeight: "600",
  },
});
