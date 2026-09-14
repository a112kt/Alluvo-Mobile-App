import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { s, vs, ms, scale } from "react-native-size-matters";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useTopBrands } from "../../hooks/Home/useTopBrands";
import { TopBrandItem } from "../../services/index";
import { UserStackParamList } from "../../../../Navigation/types";

const SkeletonBrand = () => (
  <View style={styles.brandContainer}>
    <View style={styles.skeletonBrandName} />
  </View>
);

const TopBrand = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const { data, isLoading, isError, refetch } = useTopBrands();

  const items: TopBrandItem[] = React.useMemo(() => {
    if (!data) return [];
    if (data.brands && Array.isArray(data.brands)) return data.brands;
    return [];
  }, [data]);

  const handleBrandPress = (brandId: number) => {
    navigation.navigate("BrandProfile", { brandId });
  };

  const handleViewAll = () => {
    navigation.navigate("Brands" as any);
  };

  const renderItem = ({ item }: { item: TopBrandItem }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.brandContainer}
      onPress={() => handleBrandPress(item.brandId)}
    >
      <Text style={styles.brandName}>
        {item.brandName}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.skeletonTitle} />
        </View>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <SkeletonBrand />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Top Brands</Text>
        </View>
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>Failed to load brands.</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!items.length) return null;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Top Brands</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* Brands Horizontal List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => String(item.brandId)}
      />
    </View>
  );
};

export default TopBrand;

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: s(10),
    marginBottom: vs(10),
  },
  title: {
    fontSize: scale(30),
    color: "#1B2351",
    fontWeight: "400",
    fontFamily: "Inter",
  },
  viewAll: {
    fontSize: ms(14),
    color: "#006666",
    textDecorationLine: "underline",
    fontWeight: "500",
    marginRight: s(10),
  },
  listContent: {
    paddingHorizontal: s(2),
  },
  brandContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F6F0",
    paddingVertical: vs(15),
    paddingHorizontal: s(20),
  },
  brandName: {
    fontSize: ms(18),
    color: "#BDBDBD",
    fontWeight: "700",
    letterSpacing: s(4),
    fontFamily: "Manrope",
  },
  skeletonTitle: {
    width: s(150),
    height: s(30),
    backgroundColor: "#E0E0E0",
    borderRadius: s(4),
  },
  skeletonBrandName: {
    width: s(80),
    height: ms(18),
    backgroundColor: "#E0E0E0",
    borderRadius: s(4),
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(20),
    gap: s(8),
  },
  errorText: {
    fontSize: scale(12),
    color: "#999",
  },
  retryText: {
    fontSize: scale(12),
    color: "#006666",
    fontWeight: "600",
  },
});
