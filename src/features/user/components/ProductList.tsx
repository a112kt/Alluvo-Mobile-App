import React from "react";
import { View, FlatList, Dimensions } from "react-native";
import { ProductCard } from "../../../Components/cards/product cards/BrandProfileProductCard";

const { width } = Dimensions.get("window");

import { ReelProduct } from "../services";

interface ProductListProps {
  products: ReelProduct[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) return null;

  return (
    <View style={{ paddingVertical: 10 }}>
      <FlatList
        data={products}
        horizontal
        keyExtractor={(item, index) => `prodlist-${item.productId}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
}
