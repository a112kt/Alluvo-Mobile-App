import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { s, vs, ms } from "react-native-size-matters";
import { useTodayOffers } from "../../hooks/Home/useTodayOffers";
import { useTranslation } from "react-i18next";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../../Navigation/types";
import HtmlText from "../../../../Components/HtmlText";


const { width } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.82;

const dummyOffers = [
  {
    id: 1,
    discount: "30% OFF",
    category: "NEW ARRIVAL",
    image: require("../../../../assests/imgs/Bag.png"),
    buttonText: "Shop Now",
  },
  {
    id: 2,
    discount: "50% OFF",
    category: "FLASH SALE",
    image: require("../../../../assests/imgs/shop.png"),
    buttonText: "Claim Offer",
  },
  {
    id: 3,
    discount: "30% OFF",
    category: "NEW ARRIVAL",
    image: require("../../../../assests/imgs/Bag.png"),
    buttonText: "Shop Now",
  },
  {
    id: 4,
    discount: "50% OFF",
    category: "FLASH SALE",
    image: require("../../../../assests/imgs/shop.png"),
    buttonText: "Claim Offer",
  },
];

const getDirectImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return url;
};

const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();

const parseOfferDescription = (description: string) => {
  const clean = stripHtml(description);
  if (!clean) return { discount: "SALE", subtitle: "" };
  // Check if description has a percentage like "30%" or "50%"
  const match = clean.match(/(\d+%\s*(Off|OFF)?)/i);
  if (match) {
    const discount = match[1].toUpperCase().includes("OFF") ? match[1].toUpperCase() : `${match[1]} OFF`;
    const subtitle = clean.replace(match[0], "").trim().replace(/\s+/g, " ");
    return { discount, subtitle };
  }
  return { discount: "SALE", subtitle: clean };
};

const SkeletonCard = () => (
  <View style={styles.cardContainer}>
    <View style={[styles.mainCard, { backgroundColor: "#EBEBEB" }]}>
      <View style={styles.textContent}>
        <View style={[styles.skeletonText, { width: s(100), height: vs(24), borderRadius: 4, marginBottom: vs(8) }]} />
        <View style={[styles.skeletonText, { width: s(70), height: vs(14), borderRadius: 4, marginBottom: vs(6) }]} />
        <View style={[styles.skeletonText, { width: s(110), height: vs(12), borderRadius: 4, marginBottom: vs(15) }]} />
        <View style={[styles.skeletonText, { width: s(105), height: vs(30), borderRadius: 15 }]} />
      </View>
      <View style={[styles.imageContainer, { justifyContent: "center", alignItems: "center" }]}>
        <View style={[styles.skeletonText, { width: s(90), height: vs(90), borderRadius: 45 }]} />
      </View>
    </View>
  </View>
);

const OfferCompoent: React.FC = () => {
  const { data, isLoading, isError } = useTodayOffers();
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();

  const items = useMemo(() => {
    if (isLoading) return [];
    if (isError || !data) {
      return dummyOffers;
    }
    const apiData = Array.isArray(data) ? data : data.data;
    if (Array.isArray(apiData) && apiData.length > 0) {
      return apiData;
    }
    return dummyOffers;
  }, [data, isLoading, isError]);

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, items.length]);

  const renderItem = ({ item }: { item: any }) => {
    let discount = "SALE";
    let subtitle = "";
    let brand = item.brandName || item.category || "";

    if (item.description) {
      const parsed = parseOfferDescription(item.description);
      discount = parsed.discount;
      subtitle = parsed.subtitle;
    } else if (item.discount) {
      discount = item.discount;
      subtitle = item.category || "";
    }

    let imageSource;
    const directUrl = getDirectImageUrl(item.offerImage || item.brandImage);
    if (directUrl) {
      imageSource = { uri: directUrl };
    } else if (item.image) {
      imageSource = typeof item.image === "number" ? item.image : { uri: item.image };
    } else {
      imageSource = require("../../../../assests/imgs/Bag.png");
    }

    let brandImageSource = null;
    const brandDirectUrl = getDirectImageUrl(item.brandImage);
    if (brandDirectUrl) {
      brandImageSource = { uri: brandDirectUrl };
    }

    const itemButtonText = isArabic ? "تسوق الآن" : (item.buttonText || "Shop Now");

    const handlePress = () => {
      const brandId = item.brandId || item.id || 1;
      navigation.navigate("BrandProfile", { brandId, initialTab: "offers" });
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.cardContainer}
      >
        <LinearGradient colors={["#1B2351", "#2A3A85"]} style={styles.mainCard}>
          {/* TEXT */}
          <View style={styles.textContent}>
            {brand ? (
              <View style={styles.brandRow}>
                {brandImageSource ? (
                  <Image source={brandImageSource} style={styles.brandImage} resizeMode="cover" />
                ) : null}
                <Text style={styles.brandLabel} numberOfLines={1}>{brand}</Text>
              </View>
            ) : null}
            <Text style={styles.discountLabel} numberOfLines={1}>{discount}</Text>
            {subtitle ? <HtmlText html={subtitle} fontSize={ms(12)} color="rgba(255,255,255,0.8)" /> : null}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handlePress}
              style={styles.modernButton}
            >
              <Text style={styles.buttonText}>{itemButtonText}</Text>
              <View style={styles.buttonArrow}>
                <Text
                  style={{
                    color: "#1B2351",
                    fontWeight: "bold",
                    marginBottom: s(4),
                  }}
                >
                  {isArabic ? "←" : "→"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* IMAGE */}
          <View style={styles.imageContainer}>
            <View style={styles.imageGlow} />
            <Image
              source={imageSource}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.skeletonText, { width: s(150), height: vs(24), borderRadius: 4 }]} />
        </View>
        <FlatList
          data={[1, 2]}
          renderItem={() => <SkeletonCard />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: s(20) }}
          keyExtractor={(_, i) => String(i)}
        />
      </View>
    );
  }

  if (!items.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isArabic ? (
          <Text style={styles.title}>
            عروض <Text style={{ color: "#47C0D2" }}>اليوم</Text>
          </Text>
        ) : (
          <Text style={styles.title}>
            Today's <Text style={{ color: "#47C0D2" }}>Offers</Text>
          </Text>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        horizontal
        snapToInterval={ITEM_WIDTH + s(15)}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: s(20) }}
        keyExtractor={(item, index) =>
          item.offerId != null
            ? String(item.offerId)
            : item.id != null
            ? String(item.id)
            : String(index)
        }
      />
    </View>
  );
};

export default OfferCompoent;

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(15),
  },

  header: {
    paddingHorizontal: s(20),
    marginBottom: vs(10),
  },

  title: {
    fontSize: ms(24),
    fontWeight: "900",
    color: "#1B2351",
    textTransform: "uppercase",
  },

  cardContainer: {
    width: ITEM_WIDTH,
    marginRight: s(15),
  },

  mainCard: {
    minHeight: vs(170),
    borderRadius: 22,
    flexDirection: "row",
    padding: s(24),
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  textContent: {
    flex: 1,
    justifyContent: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
    marginBottom: vs(4),
  },

  brandImage: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
  },

  discountLabel: {
    color: "#47C0D2",
    fontSize: ms(26),
    fontWeight: "900",
  },

  brandLabel: {
    color: "#fff",
    fontSize: ms(15),
    fontWeight: "800",
    opacity: 0.95,
  },

  categoryLabel: {
    color: "#fff",
    fontSize: ms(12),
    fontWeight: "400",
    marginBottom: vs(10),
    opacity: 0.8,
  },

  modernButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: s(15),
    paddingRight: s(5),
    paddingVertical: vs(5),
    borderRadius: 50,
    width: s(125),
  },

  buttonText: {
    color: "#1B2351",
    fontSize: ms(13),
    fontWeight: "700",
  },

  buttonArrow: {
    backgroundColor: "#47C0D2",
    width: s(28),
    height: s(28),
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: s(120),
    height: vs(120),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  imageGlow: {
    position: "absolute",
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    backgroundColor: "rgba(71, 192, 210, 0.15)",
  },

  productImage: {
    width: s(100),
    height: s(100),
    borderRadius: s(50),
  },

  skeletonText: {
    backgroundColor: "#D6D6D6",
  },
});
