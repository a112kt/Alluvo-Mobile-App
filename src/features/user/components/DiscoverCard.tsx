import React, { useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { scale, vs, ms, s } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import ProductImage from "../../../Components/ProductImage";

const CARD_WIDTH = scale(150);

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const DiscoverCard = ({
  item,
  onPress,
  onToggleWishlist,
}: {
  item: any;
  onPress?: () => void;
  onToggleWishlist?: (item: any) => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const name = item.name || item.productName || "";
  const price =
    typeof item.price === "number"
      ? `EGP ${item.price.toFixed(2)}`
      : item.price || "";
  const rating = item.rate || item.reviewsSummary?.averageRating || 0;
  const isFav = item.isInWishlist || false;
  const id = item.productId || item.id;

  return (
    <AnimatedTouchable
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.imageContainer}>
        <ProductImage item={item} style={styles.img} />
        <TouchableOpacity
          style={styles.favBadge}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleWishlist?.(item);
          }}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={ms(16)}
            color={isFav ? "#FF3B30" : "#1B2351"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {rating > 0 && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={ms(11)} color="#F59E0B" />
            <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
          </View>
        )}

        <Text style={styles.price}>{price}</Text>
      </View>
    </AnimatedTouchable>
  );
};

const LoadingCard = () => (
  <View style={styles.card}>
    <View style={[styles.imageContainer, { backgroundColor: "#E5E5E5" }]} />
    <View style={styles.infoContainer}>
      <View
        style={{
          height: ms(12),
          width: "80%",
          backgroundColor: "#E5E5E5",
          borderRadius: 4,
        }}
      />
      <View
        style={{
          height: ms(10),
          width: "50%",
          backgroundColor: "#E5E5E5",
          borderRadius: 4,
          marginTop: vs(6),
        }}
      />
      <View
        style={{
          height: ms(14),
          width: "40%",
          backgroundColor: "#E5E5E5",
          borderRadius: 4,
          marginTop: vs(6),
        }}
      />
    </View>
  </View>
);

const ProductList = ({
  products,
  onProductPress,
  onToggleWishlist,
  loading,
  error,
  onRetry,
}: {
  products: any[];
  onProductPress?: (item: any) => void;
  onToggleWishlist?: (item: any) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) => {
  if (loading) {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => String(item)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: s(12) }} />}
          renderItem={() => <LoadingCard />}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cube-outline" size={32} color="#CCC" />
        <Text style={styles.emptyText}>No products available</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={products}
        keyExtractor={(item, index) => `product-${item.productId || item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: s(12) }} />}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <DiscoverCard
            item={item}
            onPress={() => onProductPress?.(item)}
            onToggleWishlist={onToggleWishlist}
          />
        )}
      />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: scale(14),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    height: vs(150),
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favBadge: {
    position: "absolute",
    top: s(8),
    right: s(8),
    backgroundColor: "rgba(255,255,255,0.9)",
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    padding: scale(10),
    gap: 4,
  },
  name: {
    fontSize: ms(12),
    fontWeight: "600",
    color: "#1B2351",
    lineHeight: ms(16),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    fontSize: ms(11),
    color: "#6B7280",
    fontWeight: "500",
  },
  price: {
    fontSize: ms(14),
    fontWeight: "700",
    color: "#1B2351",
  },
  listContainer: {
    paddingVertical: vs(6),
  },
  listContent: {
    paddingLeft: s(4),
    paddingRight: s(10),
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(30),
    gap: vs(8),
  },
  errorText: {
    fontSize: ms(13),
    color: "#EF4444",
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "#1B2351",
    paddingVertical: vs(8),
    paddingHorizontal: s(20),
    borderRadius: 8,
    marginTop: vs(4),
  },
  retryText: {
    color: "#FFF",
    fontSize: ms(13),
    fontWeight: "600",
  },
  emptyText: {
    fontSize: ms(13),
    color: "#9CA3AF",
    textAlign: "center",
  },
});
