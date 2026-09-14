import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import { backarrow, heartOutline, heartFilled } from "../../../assests/icons/AllIcon";
import { lightColors } from "../../../../theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserStackParamList } from "../../../Navigation/types";
import { useToggleWishlist } from "../hooks/useWishlist";
import { useAddToCart } from "../hooks/useCart";
import { showToast } from "../../../services/toastService";
import PagerView from "react-native-pager-view";
import ProductImage from "../../../Components/ProductImage";
import { useTrackProductView } from "../hooks/useRecentViews";
import AddToCartDialog from "../../../Components/AddToCartDialog";
import { getProductAllImageUris, getProductImageUri } from "../../../utils/imageUtils";
import HtmlText from "../../../Components/HtmlText";
import { useProductDetails } from "../hooks/shop/useProductDetails";


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_BOX_MARGIN = scale(16);
const IMAGE_BOX_WIDTH = SCREEN_WIDTH - IMAGE_BOX_MARGIN * 2;
const IMAGE_BOX_HEIGHT = verticalScale(260);

type RootNavigationType = NativeStackNavigationProp<UserStackParamList>

export default function ProductDetails({ route }: any) {
  const passedProduct = route.params?.product;
  const passedProductId = route.params?.productId;
  const navigation = useNavigation<RootNavigationType>();
  const insets = useSafeAreaInsets();

  const { data: fetchedProduct } = useProductDetails(
    passedProduct?.id || passedProduct?.productId || passedProductId || 0
  );

  const product = fetchedProduct ?? passedProduct;

  const { mutate: toggleWishlist } = useToggleWishlist();
  const { mutate: addToCart } = useAddToCart();
  const { mutate: trackView } = useTrackProductView();
  const [selectedColor, setSelectedColor] = useState<number | null>(
    product?.availableColors?.[0]?.id ?? null
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState(product?.isInWishlist ?? false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const viewTrackedRef = useRef(false);
  const productId = product?.id || product?.productId || passedProductId;

  const allImages = getProductAllImageUris(product);
  const hasMultipleImages = allImages.length > 1;

  useEffect(() => {
    if (productId && !viewTrackedRef.current) {
      viewTrackedRef.current = true;
      trackView(productId);
    }
  }, [productId, trackView]);

  const brandAnim = useRef(new Animated.Value(1)).current;

  const onBrandPressIn = () => {
    Animated.spring(brandAnim, { toValue: 0.94, useNativeDriver: true }).start();
  };
  const onBrandPressOut = () => {
    Animated.spring(brandAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const selectedColorObj = product?.availableColors?.find(
    (c: any) => c.id === selectedColor
  );
  const availableSizes = selectedColorObj?.availableSizes ?? [];
  const brand = product?.brand;

  if (!product) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#47C0D2" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <SvgXml xml={backarrow} width={scale(10)} height={scale(14)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <TouchableOpacity onPress={() => {
            const newState = !wishlist;
            setWishlist(newState);
            toggleWishlist(product.id || product.productId, {
                onSuccess: () => showToast("Wishlist", newState ? "Product added to wishlist successfully." : "Product removed from wishlist."),
            });
        }} style={styles.wishBtn}>
          <SvgXml xml={wishlist ? heartFilled : heartOutline} width={scale(22)} height={scale(22)} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Brand Section */}
        {brand ? (
          <Animated.View style={{transform: [{ scale: brandAnim }], marginHorizontal: scale(16), marginTop: scale(8), marginBottom: scale(6) }}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={onBrandPressIn}
              onPressOut={onBrandPressOut}
              onPress={() => {
                if (brand.id) {
                  navigation.navigate("BrandProfile", { brandId: brand.id });
                }
              }}
              style={styles.brandCard}
            >
              <View style={styles.brandLeft}>
                <View style={styles.brandLogoWrap}>
                  <Image
                    source={
                      brand.logoUrl
                        ? { uri: brand.logoUrl.startsWith("http") ? brand.logoUrl : `${process.env.EXPO_PUBLIC_API_URL}/${brand.logoUrl}` }
                        : require("../../../assests/imgs/no-image-icon-23494.png")
                    }
                    style={styles.brandLogo}
                  />
                </View>
                <View style={styles.brandInfo}>
                  <View style={styles.brandNameRow}>
                    <Text style={styles.brandName}>{brand.displayName}</Text>
                    <SvgXml xml={`<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3B82F6"/><path d="M10 14.5L7.5 12L6.5 13L10 16.5L17.5 9L16.5 8L10 14.5Z" fill="white"/></svg>`} width={14} height={14} />
                  </View>
                  <Text style={styles.brandSub}>Official Store</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        {/* Product Image Carousel */}
        <View style={styles.imageBox}>
          <LinearGradient
            colors={["#EAF4FB", "#F5F0FA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.imageGradientBg}
          >
            {hasMultipleImages ? (
              <PagerView
                style={{ width: IMAGE_BOX_WIDTH, height: "100%" }}
                initialPage={0}
                overdrag
                onPageSelected={(e) => setCurrentImageIndex(e.nativeEvent.position)}
              >
                {allImages.map((uri, index) => (
                  <View key={String(index)} style={{ width: IMAGE_BOX_WIDTH, height: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Image
                      source={{ uri }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </PagerView>
            ) : (
              <ProductImage
                item={product}
                style={styles.productImage}
                resizeMode="contain"
              />
            )}
          </LinearGradient>

          {/* Discount Badge */}
          {product.haveOffer && product.discountPercentage && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discountPercentage}% OFF</Text>
            </View>
          )}

          {/* Dot Indicators */}
          {hasMultipleImages && (
            <View style={styles.dotsContainer}>
              {allImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentImageIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            {product.haveOffer && product.discountedPrice ? (
              <>
                <Text style={styles.discountedPrice}>{product.discountedPrice} EGP</Text>
                <Text style={styles.originalPrice}>{product.price} EGP</Text>
              </>
            ) : (
              <Text style={styles.discountedPrice}>{product.price} EGP</Text>
            )}
          </View>

          {/* Rating */}
          {product.reviewsSummary && (
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>
                ⭐ {product.reviewsSummary.averageRating?.toFixed(1)} ({product.reviewsSummary.totalReviews} reviews)
              </Text>
              <Text style={[styles.stockBadge, product.stockStatus?.toLowerCase() === "instock" ? styles.inStockBadge : styles.outOfStockBadge]}>
                {product.stockStatus?.toLowerCase() === "instock" ? "In Stock" : "Out of Stock"}
              </Text>
            </View>
          )}

          {/* Description */}
          {product.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <HtmlText html={product.description} />
            </View>
          ) : null}

          {/* Colors */}
          {product.availableColors?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorRow}>
                {product.availableColors.map((color: any, index: number) => (
                  <TouchableOpacity
                    key={`color-${color.id}-${index}`}
                    onPress={() => { setSelectedColor(color.id); setSelectedSize(null); }}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color.hexCode },
                      selectedColor === color.id && styles.colorSelected,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeRow}>
                {availableSizes.map((s: any, index: number) => (
                  <TouchableOpacity
                    key={`size-${s.id}-${index}`}
                    onPress={() => setSelectedSize(s.id)}
                    style={[
                      styles.sizeChip,
                      selectedSize === s.id && styles.sizeChipSelected,
                    ]}
                  >
                    <Text style={[styles.sizeText, selectedSize === s.id && styles.sizeTextSelected]}>
                      {s.size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: verticalScale(100) }} />
        </View>
      </ScrollView>

      {/* Add to Cart */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + scale(10) }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setDialogVisible(true)}
        >
          <LinearGradient
            colors={["#1B2351", "#47C0D2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cartBtn}
          >
            <Text style={styles.cartBtnText}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <AddToCartDialog
        visible={dialogVisible}
        product={product}
        onClose={() => setDialogVisible(false)}
        onAddToCart={(productId, color, size, quantity) => {
          addToCart([{ productId, quantity, color, size }], {
            onSuccess: () => {
              showToast("Cart", "Product added to cart successfully.");
              navigation.navigate("Cart");
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: lightColors.bgLight },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  backBtn: { padding: scale(6) },
  headerTitle: {
    flex: 1,
    fontSize: scale(16),
    fontWeight: "700",
    textAlign: "center",
    color: "#1E1E1E",
    marginHorizontal: scale(8),
  },
  wishBtn: { padding: scale(6) },
  imageBox: {
    marginHorizontal: IMAGE_BOX_MARGIN,
    marginTop: scale(8),
    marginBottom: scale(6),
    borderRadius: scale(20),
    overflow: "hidden",
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageGradientBg: {
    width: "100%",
    height: IMAGE_BOX_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(16),
  },
  productImage: {
    width: "88%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: scale(12),
    left: scale(12),
    backgroundColor: "#E53935",
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    zIndex: 2,
  },
  discountText: { color: "#fff", fontSize: scale(12), fontWeight: "700" },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scale(10),
    gap: scale(6),
  },
  dot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(3.5),
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    width: scale(20),
    backgroundColor: "#1B2351",
  },
  brandCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  brandLeft:
  { flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
  },
  brandLogoWrap: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  brandLogo: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: "#F3F4F6",
  },
  brandInfo: {
    flex: 1,
  },
  brandNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
  },
  brandName: {
    fontSize: scale(15),
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
  },
  brandSub: {
    fontSize: scale(11),
    color: "#9CA3AF",
    fontFamily: "Inter-Regular",
    marginTop: 2,
  },
  body: { paddingHorizontal: scale(16), paddingTop: scale(16) },
  productName: { fontSize: scale(20), fontWeight: "700", color: "#1E1E1E", marginBottom: scale(8) },
  priceRow: { flexDirection: "row", alignItems: "center", gap: scale(10), marginBottom: scale(8) },
  discountedPrice: { fontSize: scale(20), fontWeight: "800", color: "#1B2351" },
  originalPrice: {
    fontSize: scale(14),
    color: "#999",
    textDecorationLine: "line-through",
  },
  ratingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: scale(12) },
  ratingText: { fontSize: scale(13), color: "#555" },
  stockBadge: {
    fontSize: scale(11),
    fontWeight: "600",
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(20),
    overflow: "hidden",
  },
  inStockBadge: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  outOfStockBadge: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
  },
  section: { marginBottom: scale(16) },
  sectionTitle: { fontSize: scale(14), fontWeight: "700", color: "#1E1E1E", marginBottom: scale(8) },
  colorRow: { flexDirection: "row", gap: scale(10) },
  colorCircle: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSelected: { borderColor: "#1B2351", transform: [{ scale: 1.15 }] },
  sizeRow: { flexDirection: "row", flexWrap: "wrap", gap: scale(8) },
  sizeChip: {
    paddingHorizontal: scale(14),
    paddingVertical: scale(7),
    borderRadius: scale(8),
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  sizeChipSelected: { borderColor: "#1B2351", backgroundColor: "#1B2351" },
  sizeText: { fontSize: scale(13), fontWeight: "600", color: "#555" },
  sizeTextSelected: { color: "#fff" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: scale(16),
    paddingTop: scale(10),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    elevation: 10,
  },
  cartBtn: {
    borderRadius: scale(12),
    paddingVertical: scale(14),
    alignItems: "center",
  },
  cartBtnText: { color: "#fff", fontSize: scale(15), fontWeight: "700" },
});
