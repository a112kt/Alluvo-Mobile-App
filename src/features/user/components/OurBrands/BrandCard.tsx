import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { s, vs, ms, scale } from "react-native-size-matters";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../../Navigation/types";
import { BrandType } from "../../services/ourBrands";
import { useToggleFollowBrand } from "../../hooks/useBrands";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - s(40)) / 2;

export default function BrandCard({ brand }: { brand: BrandType }) {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const { mutate: toggleFollow, isPending } = useToggleFollowBrand();

  const handlePress = () => {
    navigation.navigate("BrandProfile", { brandId: brand.id });
  };

  const handleFollow = () => {
    if (!isPending) {
      toggleFollow(brand.id);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={handlePress}
    >
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        {brand.coverImageUrl ? (
          <Image source={{ uri: brand.coverImageUrl }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverGradient} />
        )}
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          {brand.logoUrl ? (
            <Image source={{ uri: brand.logoUrl }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.brandName} numberOfLines={1}>
          {brand.displayName}
        </Text>

        <Text style={styles.category} numberOfLines={1}>
          {brand.category}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {brand.description}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>
            {brand.averageRating.toFixed(1)}
          </Text>
          <Text style={styles.ratingCount}>({brand.numOfReviews})</Text>
        </View>

        {/* Product Count */}
        <Text style={styles.productCount}>
          {brand.productCount} Products
        </Text>

        {/* Follow Button */}
        <TouchableOpacity
          style={[
            styles.followButton,
            brand.isFollowedByMe && styles.followingButton,
          ]}
          onPress={handleFollow}
          disabled={isPending}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.followButtonText,
              brand.isFollowedByMe && styles.followingButtonText,
            ]}
          >
            {brand.isFollowedByMe ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECEFF1",
    marginBottom: vs(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  coverContainer: {
    width: "100%",
    height: 100,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverGradient: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1B2351",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -30,
    zIndex: 2,
  },
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  logoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: s(10),
    paddingTop: vs(8),
    paddingBottom: vs(12),
  },
  brandName: {
    fontSize: scale(14),
    fontWeight: "700",
    color: "#1B2351",
    marginBottom: 2,
  },
  category: {
    fontSize: scale(11),
    fontStyle: "italic",
    color: "rgba(27, 35, 81, 0.6)",
    marginBottom: 4,
  },
  description: {
    fontSize: scale(11),
    color: "rgba(27, 35, 81, 0.7)",
    textAlign: "center",
    lineHeight: 16,
    minHeight: 32,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#1B2351",
  },
  ratingCount: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "rgba(27, 35, 81, 0.6)",
  },
  productCount: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "rgba(27, 35, 81, 0.6)",
    marginBottom: 10,
  },
  followButton: {
    width: "100%",
    paddingVertical: vs(8),
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#1B2351",
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "#1B2351",
    borderWidth: 0,
  },
  followButtonText: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#1B2351",
  },
  followingButtonText: {
    color: "#fff",
  },
});
