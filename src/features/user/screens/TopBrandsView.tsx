import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs, ms, scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useQueries } from "@tanstack/react-query";
import { useTopBrands } from "../hooks/Home/useTopBrands";
import { TopBrandItem } from "../services/index";
import { getBrandProducts } from "../services/BrandProfile";
import { ShopProductCardGridView } from "../../../Components/cards/product cards/shopProductCardGridView";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - s(50)) / 2;

const BrandSectionSkeleton = () => (
  <View style={styles.section}>
    <View style={[styles.sectionTitleSkeleton, { width: s(150), height: ms(22), backgroundColor: "#E0E0E0", borderRadius: 4, marginBottom: vs(16) }]} />
    <View style={styles.productsGrid}>
      {[1, 2, 3, 4].map((_, i) => (
        <View key={i} style={[styles.productCardSkeleton, { backgroundColor: "#E0E0E0", borderRadius: 12 }]}>
          <View style={{ flex: 1, backgroundColor: "#D0D0D0", borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
          <View style={{ padding: 12, gap: 6 }}>
            <View style={{ height: ms(12), width: "80%", backgroundColor: "#D0D0D0", borderRadius: 4 }} />
            <View style={{ height: ms(10), width: "50%", backgroundColor: "#D0D0D0", borderRadius: 4 }} />
            <View style={{ height: ms(16), width: "40%", backgroundColor: "#D0D0D0", borderRadius: 4 }} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

const TopBrandsView = () => {
  const navigation = useNavigation();
  const { data: brandsData, isLoading: brandsLoading, isError: brandsError, refetch: refetchBrands } = useTopBrands();

  const brands: TopBrandItem[] = useMemo(() => {
    if (!brandsData?.brands) return [];
    return brandsData.brands;
  }, [brandsData]);

  const productQueries = useQueries({
    queries: brands.map((brand) => ({
      queryKey: ["brandProducts", brand.brandId],
      queryFn: async () => {
        const response = await getBrandProducts(brand.brandId);
        let parsed: any[] = [];
        if (Array.isArray(response?.data)) {
          parsed = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          parsed = response.data.data;
        } else if (Array.isArray(response)) {
          parsed = response;
        }
        return parsed.slice(0, 4);
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    })),
  });

  const isLoading = brandsLoading || productQueries.some((q) => q.isLoading);
  const isError = brandsError || productQueries.some((q) => q.isError);

  if (brandsLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Brands</Text>
          <View style={styles.backButton} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BrandSectionSkeleton />
          <BrandSectionSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Brands</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Failed to load data.</Text>
          <TouchableOpacity
            onPress={() => { refetchBrands(); productQueries.forEach((q) => q.refetch()); }}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Brands</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {brands.map((brand, index) => {
          const brandProducts = productQueries[index]?.data ?? [];
          if (!brandProducts.length) return null;

          return (
            <View key={brand.brandId} style={styles.section}>
              <Text style={styles.sectionTitle}>{brand.brandName}</Text>
              <View style={styles.productsGrid}>
                {brandProducts.slice(0, 4).map((product: any, pi: number) => (
                  <View key={product.id || product.productId || pi} style={styles.productCardWrapper}>
                    <ShopProductCardGridView item={product} />
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TopBrandsView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F6F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: s(10),
    paddingVertical: vs(12),
    backgroundColor: "#F9F6F0",
  },
  backButton: {
    width: s(40),
    height: s(40),
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: scale(24),
    color: "#1B2351",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: "#1B2351",
    fontFamily: "Inter-SemiBold",
  },
  scrollContent: {
    paddingHorizontal: s(15),
    paddingBottom: vs(30),
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: vs(12),
  },
  section: {
    marginBottom: vs(28),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
    marginBottom: vs(16),
  },
  sectionTitleSkeleton: {
    marginBottom: vs(16),
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: s(10),
  },
  productCardWrapper: {
    width: CARD_WIDTH,
  },
  productCardSkeleton: {
    width: CARD_WIDTH,
    height: vs(280),
  },
  errorText: {
    fontSize: ms(14),
    color: "#888",
  },
  retryButton: {
    backgroundColor: "#1B2351",
    paddingVertical: vs(8),
    paddingHorizontal: s(20),
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: ms(13),
    fontWeight: "600",
  },
});
