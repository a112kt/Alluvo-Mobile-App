import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import GradientText from "../../../Components/GradientText";
import ProductCard from "../../../Components/cards/product cards/WishlistProduct";
import GradientButton from "../../../Components/buttons/GradientButton";
import HeartIcon from "../../../iconComponent/EmpthyWishlsitIcon";
import { lightColors } from "../../../../theme";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useFloatingTabBarPadding } from "../../../hooks/useFloatingTabBarPadding";
import { useWishlist } from "../hooks/useWishlist";
import { WishlistProduct } from "../services/wishlist";

export default function WishlistUser() {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useWishlist();
  const tabBarPadding = useFloatingTabBarPadding();
  const products = data?.data?.products ?? [];
  const empty = !isLoading && products.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GradientText text="Wishlist" textStyle={styles.title} />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={lightColors.primary} />
        </View>
      ) : !empty ? (
        <FlatList
          data={products}
          keyExtractor={(item: WishlistProduct, index: number) => `wish-${item.productId}-${index}`}
          renderItem={({ item }) => <ProductCard item={item} />}
          contentContainerStyle={{ ...styles.listContent, paddingBottom: tabBarPadding }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <HeartIcon />
          </View>
          <Text style={styles.emptyText}>your wishlist is empty</Text>
          <GradientButton
            text="Shopping Now"
            style={styles.shopButton}
            onPress={() => navigation.navigate("Shop")}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
   backgroundColor: lightColors.bgLight,
  },
  header: {
    paddingStart: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "white",
    width: scale(130),
    height: scale(130),
    borderRadius: scale(65),
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 8px 0px #00000029",
  },
  emptyText: {
    color: "#8C8C8C",
    fontFamily: "Inter-Regular",
    fontSize: 20,
    marginTop: 10,
  },
  shopButton: {
    width: "60%",
    marginTop: 10,
  },
});
