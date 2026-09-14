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

export const ShopProductCard = ({ item }: { item: any }) => {
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
                style={styles.imageContainer}
            >
                {hasDiscount && (
                    <View style={[styles.badge, { backgroundColor: "#EF4444" }]}>
                        <Text style={styles.badgeText}>{discountText}</Text>
                    </View>
                )}
                {isOutOfStock && (
                    <View style={[styles.badge, { backgroundColor: "#6B7280" }]}>
                        <Text style={styles.badgeText}>Out of Stock</Text>
                    </View>
                )}
                <ProductImage
                    item={item}
                    style={styles.img}
                />
            </TouchableOpacity>
            <View style={styles.rightSection}>
                <TouchableOpacity
                    activeOpacity={0.92}
                    onPress={() => navigation.navigate("ProductDetails", { product: item })}
                    style={styles.detailsTouchable}
                >
                    <Text style={styles.name} numberOfLines={2}>{name}</Text>
                    {category ? <Text style={styles.category} numberOfLines={1}>{category}</Text> : null}
                    <View style={styles.ratingRow}>
                        <Star width={11} height={11} color="#F59E0B" />
                        <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
                        <Text style={styles.reviewsCount}>({reviewsCount})</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>EGP {price}</Text>
                        {hasDiscount && originalPrice && (
                            <Text style={styles.originalPrice}>EGP {originalPrice}</Text>
                        )}
                    </View>
                </TouchableOpacity>
                <View style={styles.actionsRow}>
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
                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => {
                        const newState = !isWishlist;
                        setIsWishlist(newState);
                        toggleWishlist(item.id || item.productId, {
                            onSuccess: () => showToast("Wishlist", newState ? "Product added to wishlist successfully." : "Product removed from wishlist."),
                        });
                    }}
                    >
                        <HeartIcon size={18} active={isWishlist} />
                    </TouchableOpacity>
                </View>
            </View>

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

export default ShopProductCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        width: "100%",
        flexDirection: "row",
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
        width: 120,
        height: 150,
        backgroundColor: "#FAFAFA",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: 8,
        left: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 2,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "700",
        fontFamily: "Inter-Bold",
    },
    img: {
        width: "85%",
        height: "85%",
        resizeMode: "contain",
    },
    rightSection: {
        flex: 1,
        padding: 12,
        justifyContent: "space-between",
    },
    detailsTouchable: {
        gap: 3,
    },
    name: {
        color: "#1B2351",
        fontWeight: "600",
        fontSize: scale(13),
        fontFamily: "Inter-SemiBold",
        lineHeight: 17,
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
        fontSize: scale(11),
        color: "#1B2351",
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
    },
    reviewsCount: {
        fontSize: scale(10),
        color: "#9CA3AF",
        fontFamily: "Inter-Regular",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
    },
    price: {
        fontSize: scale(17),
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
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    addButtonWrapper: {
        flex: 1,
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
    heartButton: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        width: 34,
        height: 34,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
});
