import { View, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { Text } from "react-native-paper";
import Star from "../../../iconComponent/star";
import GradientText from "../../GradientText";
import PlusCircle from "../../../iconComponent/plus";
import MinusCircle from "../../../iconComponent/minus";
import Trash from "../../../iconComponent/TrashIcon";
import { useUpdateCart } from "../../../features/user/hooks/useCart";
import { CartItemRes } from "../../../features/user/services/cart";
import { showToast } from "../../../services/toastService";
import ProductImage from "../../ProductImage";

export default function ProductCard({ item }: { item: CartItemRes }) {
  const [count, setCount] = useState(item.quantity);
  const { mutate: updateCart } = useUpdateCart();

  const handleIncrease = () => {
    setCount(count + 1);
    updateCart([{ productId: item.productId, quantity: 1, change: 1, color: item.color, size: item.size }]);
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
      updateCart([{ productId: item.productId, quantity: 1, change: -1, color: item.color, size: item.size }]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProductImage item={item} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>{item.productName}</Text>
          <View style={styles.ratingRow}>
            <Star width={12} height={12} color="#F59E0B" />
            <Text style={styles.ratingText}>5.0</Text>
            <Text style={styles.reviewCount}>(10 Reviews)</Text>
          </View>
          <View style={styles.optionsRow}>
            <View style={styles.option}>
              <Text style={styles.optionLabel}>Size: </Text>
              <Text style={styles.optionValue}>{item.size}</Text>
            </View>
            <View style={styles.option}>
              <Text style={styles.optionLabel}>Color: </Text>
              <Text style={styles.optionValue}>{item.color}</Text>
            </View>
          </View>
          <Text style={styles.price}>EGP {item.productPrice}</Text>
          <View style={styles.actionsRow}>
            <View style={styles.stepper}>
              <Pressable onPress={handleIncrease}>
                <PlusCircle size={20} />
              </Pressable>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
              </View>
              <Pressable onPress={handleDecrease}>
                <MinusCircle size={20} />
              </Pressable>
            </View>
            <Pressable
              style={styles.trashButton}
              onPress={() => updateCart([{ productId: item.productId, quantity: item.quantity, change: -item.quantity, color: item.color, size: item.size }], {
                  onSuccess: () => showToast("Cart", "Product removed from cart."),
              })}
            >
              <Trash />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 110,
    height: 130,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#FAFAFA",
  },
  details: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#1B2351",
    lineHeight: 17,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1B2351",
    fontFamily: "Inter-SemiBold",
  },
  reviewCount: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: "Inter-Regular",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Inter-Regular",
  },
  optionValue: {
    fontSize: 11,
    color: "#1B2351",
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#1B2351",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  stepper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  countBadge: {
    width: 26,
    height: 26,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    borderRadius: 13,
    alignItems: "center",
  },
  countText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Inter-SemiBold",
    color: "#1B2351",
  },
  trashButton: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
});
