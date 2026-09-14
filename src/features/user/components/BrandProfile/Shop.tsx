import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SvgXml } from "react-native-svg";
import { heartOutline, heartFilled } from "../../../../assests/icons/AllIcon";
import { useToggleWishlist } from "../../../user/hooks/useWishlist";
import { showToast } from "../../../../services/toastService";
import { scale, vs } from "react-native-size-matters";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ProductImage from "../../../../Components/ProductImage";
import { Animated } from "react-native";

const screenWidth = Dimensions.get("window").width;
const horizontalPadding = scale(12);
const gap = scale(10);
const cols = 2;
const cardWidth = (screenWidth - horizontalPadding * 2 - gap * (cols - 1)) / cols;
const cardHeight = cardWidth * 1.25;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

import useBrandProducts from "../../hooks/BrandProfile/useBrandProducts";
import { LinearGradient } from "expo-linear-gradient";
import EmptyState from "./EmptyState";

interface ShopProps {
  onlyOffers?: boolean;
  brandId: number;
}

const FadeCard: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

const Shop: React.FC<ShopProps> = ({ onlyOffers = false, brandId }) => {
  const { products, isLoading, error, refresh } = useBrandProducts(brandId);
  const navigation = useNavigation<any>();
  const { mutate: toggleWishlist } = useToggleWishlist();
  const [wishlistItems, setWishlistItems] = useState<Record<number, boolean>>({});

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    if (products.length > 0) {
      setWishlistItems((prev) => {
        const next = { ...prev };
        products.forEach((item) => {
          const id = item.id || item.productId;
          next[id] = item.isInWishlist ?? false;
        });
        return next;
      });
    }
  }, [products]);

  const filteredData = onlyOffers
    ? products.filter((item) => item.haveOffer)
    : products;

  if (isLoading && products.length === 0) {
    return (
      <View style={[styles.section, styles.center]}>
        <ActivityIndicator size="large" color="#1B2351" />
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={[styles.section, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (filteredData.length === 0 && !isLoading) {
    return (
      <View style={styles.section}>
        <EmptyState type="products" />
      </View>
    );
  }

  const rows = chunkArray(filteredData, 2);

  return (
    <View style={styles.section}>
      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {row.map((item, colIdx) => {
            const id = item.id || item.productId;
            const heartActive = wishlistItems[id];

            return (
              <FadeCard key={id} delay={(idx * 2 + colIdx) * 80}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate("ProductDetails", { product: item })}
                  style={[styles.card, { height: cardHeight }]}
                >
                  <ProductImage
                    item={item}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />

                  {item.haveOffer && item.discountPercentage && (
                    <View style={styles.discountBadge}>
                      <LinearGradient
                        colors={["#1B2351", "#47C0D2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.discountGradient}
                      >
                        <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
                      </LinearGradient>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.heartBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={(e) => {
                      e.stopPropagation();
                      const newState = !heartActive;
                      setWishlistItems((prev) => ({ ...prev, [id]: newState }));
                      toggleWishlist(id, {
                        onSuccess: () => showToast(
                          "Wishlist",
                          newState ? "Product added to wishlist" : "Product removed from wishlist"
                        ),
                      });
                    }}
                  >
                    <SvgXml
                      xml={heartActive ? heartFilled : heartOutline}
                      width={scale(18)}
                      height={scale(18)}
                    />
                  </TouchableOpacity>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
                      {item.name}
                    </Text>
                    <View style={styles.priceRow}>
                      {item.haveOffer && item.discountedPrice ? (
                        <>
                          <Text style={styles.discountedPrice}>{item.discountedPrice} EGP</Text>
                          <Text style={styles.originalPrice}>{item.price} EGP</Text>
                        </>
                      ) : (
                        <Text style={styles.price}>{item.price} EGP</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </FadeCard>
            );
          })}
          {row.length < 2 && <View style={{ width: cardWidth }} />}
        </View>
      ))}
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: horizontalPadding,
    paddingTop: scale(4),
    paddingBottom: vs(20),
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(40),
  },
  row: {
    flexDirection: "row",
    gap,
    marginBottom: gap,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: scale(14),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: "60%",
  },
  discountBadge: {
    position: "absolute",
    top: scale(8),
    left: scale(8),
    zIndex: 5,
    borderRadius: scale(8),
    overflow: "hidden",
  },
  discountGradient: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(8),
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: scale(10),
    fontWeight: "700",
  },
  heartBtn: {
    position: "absolute",
    top: scale(8),
    right: scale(8),
    zIndex: 5,
    backgroundColor: "rgba(255,255,255,0.85)",
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardFooter: {
    flex: 1,
    padding: scale(10),
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: scale(11),
    fontWeight: "500",
    color: "#1F2937",
    fontFamily: "Inter",
    lineHeight: scale(15),
  },
  priceRow: {
    marginTop: scale(4),
  },
  price: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#1B2351",
  },
  discountedPrice: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#DC2626",
  },
  originalPrice: {
    fontSize: scale(10),
    fontWeight: "400",
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginLeft: scale(4),
  },
  errorText: {
    color: "#EF4444",
    fontSize: scale(14),
  },
});
