import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs, ms, scale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useOurBrands, useBrandCategories } from "../hooks/useOurBrands";
import { BrandType } from "../services/ourBrands";
import BrandCard from "../components/OurBrands/BrandCard";
import CategoryFilter from "../components/OurBrands/CategoryFilter";

const OurBrands = () => {
  const [search, setSearch] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: categories } = useBrandCategories();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOurBrands({ search: debouncedSearch, categoryName });

  const brands: BrandType[] = data?.pages.flatMap((page) => page.data) ?? [];

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 400);
  }, []);

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    Keyboard.dismiss();
  };

  const handleCategorySelect = (category: string) => {
    setCategoryName(category);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonGrid}>
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonCover} />
          <View style={styles.skeletonLogo} />
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonLine80} />
            <View style={styles.skeletonLine50} />
            <View style={styles.skeletonLine60} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#1B2351" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="business-outline" size={48} color="#ccc" />
        <Text style={styles.emptyTitle}>No brands found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or category filter
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Brands</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search brands..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={handleSearchChange}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={categoryName}
          onSelect={handleCategorySelect}
        />
      )}

      {/* Content */}
      {isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load brands.</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          key={`${categoryName}-${debouncedSearch}`}
          data={isLoading ? [] : brands}
          renderItem={({ item }) => <BrandCard brand={item} />}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={isLoading ? renderSkeleton : undefined}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
};

export default OurBrands;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F6F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: s(10),
    paddingVertical: vs(12),
    backgroundColor: "#F9F6F0",
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: "#1B2351",
    fontFamily: "Inter-SemiBold",
  },
  searchContainer: {
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECEFF1",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: s(12),
  },
  searchIcon: {
    marginRight: s(8),
  },
  searchInput: {
    flex: 1,
    fontSize: ms(14),
    color: "#1B2351",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: s(10),
    paddingBottom: vs(30),
  },
  row: {
    justifyContent: "space-between",
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skeletonCard: {
    width: (Dimensions.get("window").width - s(40)) / 2,
    backgroundColor: "#E0E0E0",
    borderRadius: 16,
    marginBottom: vs(12),
    overflow: "hidden",
  },
  skeletonCover: {
    width: "100%",
    height: 100,
    backgroundColor: "#D0D0D0",
  },
  skeletonLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#C8C8C8",
    alignSelf: "center",
    marginTop: -30,
    borderWidth: 3,
    borderColor: "#E0E0E0",
  },
  skeletonContent: {
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  skeletonLine80: {
    width: "80%",
    height: 12,
    backgroundColor: "#C8C8C8",
    borderRadius: 4,
  },
  skeletonLine50: {
    width: "50%",
    height: 10,
    backgroundColor: "#C8C8C8",
    borderRadius: 4,
  },
  skeletonLine60: {
    width: "60%",
    height: 10,
    backgroundColor: "#C8C8C8",
    borderRadius: 4,
  },
  footerLoader: {
    paddingVertical: vs(20),
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: vs(60),
    gap: 8,
  },
  emptyTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#666",
  },
  emptySubtitle: {
    fontSize: ms(13),
    color: "#999",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: ms(14),
    color: "#888",
  },
  retryButton: {
    backgroundColor: "#1B2351",
    paddingVertical: vs(8),
    paddingHorizontal: s(24),
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: ms(13),
    fontWeight: "600",
  },
});
