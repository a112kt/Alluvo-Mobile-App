import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Star from "../../../iconComponent/star";
import HeartIcon from "../../../iconComponent/redHeart";
import BadgeElement from "../../special/badgeElement";
import { useToggleWishlist } from "../../../features/user/hooks/useWishlist";
import { useAddToCart } from "../../../features/user/hooks/useCart";
import { showToast } from "../../../services/toastService";
import ProductImage from "../../ProductImage";
import AddToCartDialog from "../../AddToCartDialog";

export const ShopProductCardGridView = ({ item }: { item: any }) => {
    const navigation = useNavigation<any>();
    const { mutate: toggleWishlist } = useToggleWishlist();
    const { mutate: addToCart } = useAddToCart();
    const [isWishlist, setIsWishlist] = useState(item.isInWishlist);
    const [dialogVisible, setDialogVisible] = useState(false);

    const name = item.productName || item.name;
    const category = item.category?.name || item.category || "";
    const rating = item.reviewsSummary?.averageRating || item.rate || 0;
    const reviewsCount = item.reviewsSummary?.totalReviews || 0;
    const price = item.discountedPrice ?? item.price;
    const originalPrice = item.haveOffer ? item.price : null;
    const hasDiscount = item.haveOffer && item.discountPercentage != null;
    const discountText = hasDiscount ? `${Math.round(item.discountPercentage)}% OFF` : "";
    const isOutOfStock = item.stockStatus === "OutOfStock";

    return (
        <View style={styles.card}>
            <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => navigation.navigate("ProductDetails", { product: item })}
            >
                <View style={styles.imageContainer}>
                    {hasDiscount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discountText}</Text>
                        </View>
                    )}
                    {isOutOfStock && (
                        <View style={styles.outOfStockBadge}>
                            <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={(e: any) => {
                            e.stopPropagation();
                            const newState = !isWishlist;
                            setIsWishlist(newState);
                            toggleWishlist(item.id || item.productId, {
                                onSuccess: () => showToast("Wishlist", newState ? "Product added to wishlist successfully." : "Product removed from wishlist."),
                            });
                        }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <HeartIcon size={20} active={isWishlist} />
                    </TouchableOpacity>
                    <ProductImage
                        item={item}
                        style={styles.img}
                    />
                </View>
                <View style={styles.detailsTop}>
                    <Text style={styles.name} numberOfLines={2}>{name}</Text>
                    {category ? <Text style={styles.category} numberOfLines={1}>{category}</Text> : null}
                    <View style={styles.ratingRow}>
                        <Star width={11} height={11} color="#F59E0B" />
                        <Text style={styles.ratingText}>
                            {Number(rating).toFixed(1)}
                        </Text>
                        <Text style={styles.reviewsCount}>({reviewsCount})</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>EGP {price}</Text>
                        {hasDiscount && originalPrice && (
                            <Text style={styles.originalPrice}>EGP {originalPrice}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setDialogVisible(true)}
                style={styles.addButtonWrapper}
            >
                <LinearGradient
                    colors={["#1B2351", "#47C0D2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.addButtonGradient}
                >
                    <Text style={styles.addButtonText}>+ Add to Cart</Text>
                </LinearGradient>
            </TouchableOpacity>

            <AddToCartDialog
                visible={dialogVisible}
                product={item}
                onClose={() => setDialogVisible(false)}
                onAddToCart={(productId, color, size, quantity) => {
                    addToCart([{ productId, quantity, color, size }], {
                        onSuccess: () => showToast("Cart", "Product added to cart successfully."),
                        onError: (err: any) => {
                            showToast("Cart", err?.friendlyMessage || "Failed to add to cart. Please try again.");
                        },
                    });
                }}
            />
        </View>
    );
};

export default ShopProductCardGridView;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        width: "100%",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F0F0F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    imageContainer: {
        width: "100%",
        height: verticalScale(155),
        backgroundColor: "#FAFAFA",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    discountBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#EF4444",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        zIndex: 2,
    },
    discountText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
        fontFamily: "Inter-Bold",
    },
    saleBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#47C0D2",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        zIndex: 2,
    },
    saleText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
    },
    outOfStockBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#6B7280",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        zIndex: 2,
    },
    outOfStockText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
    },
    heartButton: {
        position: "absolute",
        top: 6,
        right: 6,
        zIndex: 2,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    img: {
        width: "85%",
        height: "85%",
        resizeMode: "contain",
    },
    detailsTop: {
        padding: 12,
        paddingBottom: 4,
        gap: 4,
    },
    name: {
        color: "#1B2351",
        fontWeight: "600",
        fontSize: scale(12),
        fontFamily: "Inter-SemiBold",
        lineHeight: 16,
    },
    category: {
        color: "#9CA3AF",
        fontSize: scale(10),
        fontFamily: "Inter-Regular",
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        marginTop: 2,
    },
    ratingText: {
        fontSize: scale(10),
        color: "#1B2351",
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
    },
    reviewsCount: {
        fontSize: scale(9),
        color: "#9CA3AF",
        fontFamily: "Inter-Regular",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 2,
    },
    price: {
        fontSize: scale(16),
        fontWeight: "800",
        color: "#1B2351",
        fontFamily: "Inter-Bold",
    },
    originalPrice: {
        fontSize: scale(11),
        color: "#9CA3AF",
        textDecorationLine: "line-through",
        fontFamily: "Inter-Regular",
    },
    addButtonWrapper: {
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 8,
        height: 34,
        overflow: "hidden",
    },
    addButtonGradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: scale(11),
        fontWeight: "700",
        fontFamily: "Inter-Bold",
    },
});
