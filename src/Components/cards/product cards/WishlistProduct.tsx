import { View, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import React, { useRef, useState } from "react";
import { Text } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Star from "../../../iconComponent/star";
import HeartIcon from "../../../iconComponent/redHeart";
import { useToggleWishlist } from "../../../features/user/hooks/useWishlist";
import { WishlistProduct as WishlistProductType } from "../../../features/user/services/wishlist";
import { getProductById } from "../../../features/user/services/shop";
import { showToast } from "../../../services/toastService";
import ProductImage from "../../ProductImage";
import { UserStackParamList } from "../../../Navigation/types";

export default function ProductCard({ item }: { item: WishlistProductType }) {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const { mutate: toggleWishlist } = useToggleWishlist();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [active, setActive] = React.useState(true);
  const [loading, setLoading] = useState(false);

  const handleRemove = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActive(false);
      toggleWishlist(item.productId, {
        onSuccess: () => showToast("Wishlist", "Product removed from wishlist."),
      });
    });
  };

  const handleProductPress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getProductById(item.productId);
      const product = response?.data ?? response;
      navigation.navigate("ProductDetails", { product });
    } catch {
      showToast("Error", "Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleProductPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#1B2351" />
        </View>
      )}
      <View style={styles.content}>
        <ProductImage item={item} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <View style={styles.ratingRow}>
            <Star width={15} height={15} />
            <Text style={styles.ratingText}>
              5.0 (10 Reviews)
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>EGP {item.price}</Text>
            {item.discountPercentage && (
              <Text style={styles.discount}>{item.discountPercentage}% OFF</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <HeartIcon size={20} active={active} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#edebeb54",
    paddingHorizontal: 16,
    paddingVertical: 33,
    borderRadius: 4,
    marginBottom: 11,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  image: {
    width: 125,
    height: 150,
    resizeMode: "contain",
  },
  details: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  category: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    fontStyle: "italic",
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    fontWeight: "300",
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#1B2351",
  },
  discount: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#E53935",
  },
  removeButton: {
    padding: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderRadius: 4,
  },
});
