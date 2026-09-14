import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserStackParamList } from "../../../../Navigation/types";
import { useRecentViews } from "../../hooks/useRecentViews";
import { PLACEHOLDER } from "../../../../utils/imageUtils";
import { useTrackProductView } from "../../hooks/useRecentViews";
import { API_BASE_URL } from "../../../../config/env";

const BASE_URL = API_BASE_URL;

type NavigationType = NativeStackNavigationProp<UserStackParamList>;

const RecentView = () => {
  const { data: response, isLoading } = useRecentViews();
  const { mutate: trackView } = useTrackProductView();
  const navigation = useNavigation<NavigationType>();
  const { t } = useTranslation();

  const products = response ?? [];

  const renderItem = ({ item }: { item: { productId: number; productName: string; price: number; imageUrls: string[] } }) => {
    const imageUri = item.imageUrls?.[0]
      ? item.imageUrls[0].startsWith("http")
        ? item.imageUrls[0]
        : `${BASE_URL}/${item.imageUrls[0]}`
      : null;

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.8}
        onPress={() => {
          trackView(item.productId);
          navigation.navigate("ProductDetails", {
            product: {
              productId: item.productId,
              name: item.productName,
              price: item.price,
              imageUrls: item.imageUrls,
            },
          });
        }}
      >
        <View style={styles.card}>
          <Image
            source={imageUri ? { uri: imageUri } : PLACEHOLDER}
            style={styles.img}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.productPrice}>{item.price} EGP</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t("recentlyViewed")}</Text>
        <ActivityIndicator size="small" color={lightColors.primary} />
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t("recentlyViewed")}</Text>
        <Text style={styles.emptyText}>No recently viewed products</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("recentlyViewed")}</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `recent-${item.productId}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default RecentView;

const styles = StyleSheet.create({
  container: {
   paddingHorizontal: scale(10),
  },
  title: {
    fontSize: scale(20),
    fontFamily: "Poppins-Bold",
    fontWeight: "700" as any,
    color: lightColors.primary,
    marginVertical: verticalScale(12),
  },
  listContent: {
    paddingStart: scale(0),
    gap: scale(14),
  },
  cardWrapper: {
    alignItems: "center",
    width: scale(70),
  },
  card: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(30),
    borderWidth: scale(2),
    borderColor: lightColors.white,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  img: {
    width: "100%",
    height: "100%",
  },
  productName: {
    fontSize: scale(9),
    color: "#333",
    marginTop: verticalScale(4),
    textAlign: "center",
    maxWidth: scale(70),
  },
  productPrice: {
    fontSize: scale(8),
    color: lightColors.primary,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    fontSize: scale(13),
    color: "#999",
    textAlign: "center",
    marginVertical: verticalScale(8),
  },
});
