import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  I18nManager,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { s, vs, ms, scale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { Animated } from "react-native";
import ProductImage from "../../../../Components/ProductImage";
import { useHomeProducts } from "../../hooks/Home/useHomeProducts";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../../Navigation/types";
import { useWishlist, useToggleWishlist } from "../../hooks/useWishlist";
import { showToast } from "../../../../services/toastService";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - s(60)) / 2;

const LOADING_ITEMS = [0, 1, 2, 3];

const isRTL = I18nManager.isRTL;

function SkeletonCard({ index }: { index: number }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={[styles.card, { marginTop: index % 2 === 0 ? 0 : vs(30) }]}>
      <Animated.View style={[styles.imageContainer, { opacity: pulseAnim, backgroundColor: "#E0E0E0" }]}>
        <View
          style={[
            styles.favBadge,
            {
              backgroundColor: "rgba(200,200,200,0.6)",
              [isRTL ? "left" : "right"]: s(10),
            },
          ]}
        />
      </Animated.View>
      <View style={styles.infoContainer}>
        <Animated.View
          style={{
            height: ms(14),
            width: "70%",
            backgroundColor: "#E0E0E0",
            borderRadius: 4,
            opacity: pulseAnim,
          }}
        />
        <Animated.View
          style={{
            height: ms(12),
            width: "40%",
            backgroundColor: "#E0E0E0",
            borderRadius: 4,
            marginTop: vs(6),
            opacity: pulseAnim,
          }}
        />
      </View>
    </View>
  );
}

const FavProduct = () => {
  const { data, isLoading, isError, refetch } = useHomeProducts();
  const allProducts = data?.data?.data ?? [];
  const products = allProducts.slice(0, 4);

  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const { mutate: toggleWishlistMutate } = useToggleWishlist();
  const { data: wishlistData } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<Record<number, boolean>>({});

  const contentFade = useRef(new Animated.Value(0)).current;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading && !showContent) {
      setShowContent(true);
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  useEffect(() => {
    if (wishlistData && wishlistData.data?.products) {
      const items = wishlistData.data.products.reduce((acc: any, curr: any) => {
        acc[curr.productId] = true;
        return acc;
      }, {});
      setWishlistItems(items);
    }
  }, [wishlistData]);

  const handleToggleWishlist = (item: any) => {
    const id = item.id || item.productId;
    if (!id) return;
    const isFav = wishlistItems[id];
    const newState = !isFav;

    setWishlistItems((prev) => ({
      ...prev,
      [id]: newState,
    }));

    toggleWishlistMutate(id, {
      onSuccess: () => {
        showToast(
          "Wishlist",
          newState
            ? "Product added to wishlist successfully."
            : "Product removed from wishlist."
        );
      },
      onError: () => {
        setWishlistItems((prev) => ({
          ...prev,
          [id]: isFav,
        }));
        showToast("Error", "Failed to update wishlist.");
      },
    });
  };

  const handleProductPress = (item: any) => {
    navigation.navigate("ProductDetails", { product: item });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;
    const price =
      typeof item.price === "number"
        ? `${item.price.toLocaleString("en")} EGP`
        : item.price || "";
    const isFav = !!wishlistItems[item.id || item.productId];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleProductPress(item)}
        style={[
          styles.card,
          { marginTop: isEven ? 0 : vs(30) },
        ]}
      >
        <View style={styles.imageContainer}>
          <ProductImage item={item} style={styles.productImage} />
          <TouchableOpacity
            style={[
              styles.favBadge,
              { [isRTL ? "left" : "right"]: s(10) },
            ]}
            activeOpacity={0.8}
            onPress={() => handleToggleWishlist(item)}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={ms(18)}
              color={isFav ? "#FF3B30" : "#1B2351"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name || item.productName}
          </Text>
          <Text style={styles.productPrice}>{price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Our Favorites</Text>
      {isError && !isLoading ? (
        <View style={{ alignItems: "center", paddingVertical: vs(20) }}>
          <Text style={{ color: "#888", fontSize: ms(14), marginBottom: vs(12) }}>
            Failed to load products.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              backgroundColor: "#1B2351",
              paddingVertical: vs(8),
              paddingHorizontal: s(20),
              borderRadius: 8,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#fff", fontSize: ms(13), fontWeight: "600" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !showContent ? (
        <FlatList
          data={LOADING_ITEMS}
          renderItem={({ index }) => <SkeletonCard index={index} />}
          keyExtractor={(item: number) => String(item)}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Animated.View style={{ opacity: contentFade }}>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item: any, index: number) => `fav-${item.id || item.productId}-${index}`}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default FavProduct;

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(20),
    backgroundColor: "#F9F6F0",
  },

  sectionTitle: {
    fontSize: scale(25),
    fontWeight: "600",
    color: "#1B2351",
    textAlign: "center",
    marginBottom: vs(20),
  },

  listContainer: {
    paddingHorizontal: s(20),
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    width: CARD_WIDTH,
    marginBottom: vs(20),
  },

  imageContainer: {
    width: "100%",
    height: vs(180),
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#EAEAEA",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  favBadge: {
    position: "absolute",
    top: s(10),
    backgroundColor: "rgba(255,255,255,0.85)",
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    justifyContent: "center",
    alignItems: "center",
  },

  infoContainer: {
    marginTop: vs(8),
  },

  productName: {
    fontSize: ms(14),
    color: "#1B2351",
  },

  productPrice: {
    fontSize: ms(12),
    color: "#555",
    marginTop: vs(2),
  },
});
