import React, { useRef, useCallback, useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import ShopProductCardListView from "../../../Components/cards/product cards/shopProductCardListView";
import ShopProductCardGridView from "../../../Components/cards/product cards/shopProductCardGridView";
import SearchBar from "../components/shop/searchBar";
import Controllers from "../components/shop/controllers";
import useGetProductsShopInfinite from "../hooks/shop/useGetProductsShopInfinite";
import useDebounce from "../hooks/useDebounce";
import { useCart, useUpdateCart, useCartBrands, useCartItemCount } from "../hooks/useCart";
import { CartBrandGroupRes } from "../services/cart";
import BrandCartPickerBottomSheet from "../components/BrandCartPickerBottomSheet";
import { scale } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";
import PlusCircle from "../../../iconComponent/plus";
import MinusCircle from "../../../iconComponent/minus";
import TrashIcon from "../../../iconComponent/TrashIcon";
import ProductImage from "../../../Components/ProductImage";
import { lightColors } from "../../../../theme";
import { useAppDispatch, useAppSelector } from "../../../Redux/store";
import { useFloatingTabBarPadding } from "../../../hooks/useFloatingTabBarPadding";
import { setSearch, setMainCategory, clearAllFilters, DEFAULT_PRICE_RANGE } from "../../../Redux/slices/shopFiltersSlice";
import { useCategories } from "../hooks/useLookups";
import { mainCategoryType } from "../types/shop";

const SHIPPING_COST = 50;

export function CartIcon({
  size = 24,
  fillColor = "#1B2351",
}: {
  size?: number;
  fillColor?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 9H19V7C19 5.4087 18.3679 3.88258 17.2426 2.75736C16.1174 1.63214 14.5913 1 13 1C11.4087 1 9.88258 1.63214 8.75736 2.75736C7.63214 3.88258 7 5.4087 7 7V9H4C3.73478 9 3.48043 9.10536 3.29289 9.29289C3.10536 9.48043 3 9.73478 3 10V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V10C21 9.73478 20.8946 9.10536 20.7071 9.29289C20.5196 9.10536 20.2652 9 20 9ZM9 7C9 5.93913 9.42143 4.92172 10.1716 4.17157C10.9217 3.42143 11.9391 3 13 3C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V9H9V7ZM5 19V11H7V13H9V11H15V13H17V11H19V19H5Z"
        fill={fillColor}
      />
    </Svg>
  );
}

const EmptySearchIcon = () => (
  <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
      fill="#D1D5DB"
    />
  </Svg>
);

export default function Shop({ route }: any) {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.shopFilters);
  const tabBarPadding = useFloatingTabBarPadding();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cartExpanded, setCartExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState(route?.params?.category || "All");
  const debouncedSearchText = useDebounce(searchText, 300);
  const { data: categoriesData } = useCategories();
  const allCategories: mainCategoryType[] = useMemo(() => categoriesData?.data ?? [], [categoriesData?.data]);

  useEffect(() => {
    dispatch(setSearch(debouncedSearchText.trim()));
  }, [debouncedSearchText]);

  useEffect(() => {
    if (searchCategory === "All") {
      dispatch(setMainCategory([]));
    } else {
      const matched = allCategories.find(
        (c) => c.name.toLowerCase() === searchCategory.toLowerCase()
      );
      if (matched) {
        dispatch(setMainCategory([matched]));
      } else {
        dispatch(setMainCategory([{ id: searchCategory, name: searchCategory, arName: searchCategory }]));
      }
    }
  }, [searchCategory, allCategories]);

  useEffect(() => {
    if (route?.params?.category) {
      setSearchCategory(route.params.category);
    }
  }, [route?.params?.category]);

  const {
    data: productsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetProductsShopInfinite(filters);

  const { data: cartData } = useCart();
  const { mutate: updateCart } = useUpdateCart();
  const brands: CartBrandGroupRes[] = cartData?.data?.brands ?? [];
  const singleBrand = brands.length === 1 ? brands[0] : undefined;
  const cartItems = singleBrand?.items ?? [];
  const totalRecords = productsData?.pages?.[0]?.data?.meta?.totalRecords;
  const uniqueCount = singleBrand ? cartItems.length : 0;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0,
  );
  const total = subtotal + (cartItems.length > 0 ? SHIPPING_COST : 0);
  const badgeAnim = useRef(new Animated.Value(1)).current;
  const summaryAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(1)).current;
  const brandPickerRef = useRef<any>(null);

  const rawProducts = productsData?.pages?.flatMap(p => p?.data?.data ?? []) ?? [];

  const hasActiveFilters =
    filters.mainCategory.length > 0 ||
    filters.stockStatus !== null ||
    filters.sizesSelected.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
    filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1] ||
    debouncedSearchText.trim().length > 0;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(badgeAnim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(badgeAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [uniqueCount]);

  useEffect(() => {
    Animated.timing(summaryAnim, {
      toValue: cartExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [cartExpanded]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#47C0D2" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={viewMode === "grid" ? styles.gridItem : styles.listItem}>
      {viewMode === "grid" ? (
        <ShopProductCardGridView item={item} />
      ) : (
        <ShopProductCardListView item={item} />
      )}
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <EmptySearchIcon />
      </View>
      <Text style={styles.emptyTitle}>No products found</Text>
      <Text style={styles.emptySubtitle}>
        No products match your current search and filters.
      </Text>
      {hasActiveFilters && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            setSearchText("");
            setSearchCategory("All");
            dispatch(clearAllFilters());
          }}
          style={styles.clearAllButtonWrapper}
        >
          <LinearGradient
            colors={["#1B2351", "#47C0D2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.clearAllGradient}
          >
            <Text style={styles.clearAllButtonText}>Clear All Filters</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const CartSummary = () => {
    if (totalItems === 0) return null;

    return (
      <View style={styles.cartSummary}>
        <TouchableOpacity
          style={styles.cartSummaryHeader}
          onPress={() => setCartExpanded(!cartExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.cartSummaryLeft}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 9H19V7C19 5.4087 18.3679 3.88258 17.2426 2.75736C16.1174 1.63214 14.5913 1 13 1C11.4087 1 9.88258 1.63214 8.75736 2.75736C7.63214 3.88258 7 5.4087 7 7V9H4C3.73478 9 3.48043 9.10536 3.29289 9.29289C3.10536 9.48043 3 9.73478 3 10V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V10C21 9.73478 20.8946 9.10536 20.7071 9.29289C20.5196 9.10536 20.2652 9 20 9ZM9 7C9 5.93913 9.42143 4.92172 10.1716 4.17157C10.9217 3.42143 11.9391 3 13 3C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V9H9V7ZM5 19V11H7V13H9V11H15V13H17V11H19V19H5Z"
                fill="#47C0D2"
              />
            </Svg>
            <Text style={styles.cartSummaryTitle}>
              Cart ({uniqueCount} {uniqueCount === 1 ? "product" : "products"},{" "}
              {totalItems} {totalItems === 1 ? "item" : "items"})
            </Text>
          </View>
          <Text style={styles.cartSummaryArrow}>
            {cartExpanded ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
        {cartExpanded && (
          <Animated.View style={{ opacity: summaryAnim }}>
            {cartItems.map((item) => (
              <View
                key={`${item.productId}-${item.color}-${item.size}`}
                style={styles.cartItemRow}
              >
                <ProductImage
                  item={item}
                  style={styles.cartItemImage}
                />
                <View style={styles.cartItemDetails}>
                  <Text style={styles.cartItemName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.cartItemPrice}>EGP {item.productPrice}</Text>
                  <View style={styles.cartItemActions}>
                    <TouchableOpacity
                      onPress={() =>
                        updateCart([
                          {
                            productId: item.productId,
                            quantity: 1,
                            change: -1,
                            color: item.color,
                            size: item.size,
                          },
                        ])
                      }
                    >
                      <MinusCircle size={14} />
                    </TouchableOpacity>
                    <Text style={styles.cartItemQty}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        updateCart([
                          {
                            productId: item.productId,
                            quantity: 1,
                            change: 1,
                            color: item.color,
                            size: item.size,
                          },
                        ])
                      }
                    >
                      <PlusCircle size={14} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    updateCart([
                      {
                        productId: item.productId,
                        quantity: item.quantity,
                        change: -item.quantity,
                        color: item.color,
                        size: item.size,
                      },
                    ])
                  }
                >
                  <TrashIcon />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {subtotal.toLocaleString('en')} EGP
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>{SHIPPING_COST} EGP</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {total.toLocaleString('en')} EGP
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    );
  };

  const onFabPressIn = () => {
    Animated.spring(fabAnim, { toValue: 0.85, useNativeDriver: true }).start();
  };
  const onFabPressOut = () => {
    Animated.spring(fabAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          searchCategory={searchCategory}
          onCategoryChange={setSearchCategory}
        />
        <View style={styles.topBar}>
          <CartSummary />
        </View>
        <Controllers
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalRecords={totalRecords}
          displayedCount={rawProducts.length}
        />
      </View>
      <FlatList
        key={viewMode}
        data={rawProducts}
        renderItem={renderItem}
        keyExtractor={(item: any, index: number) =>
          `product-${item.productId ?? item.id ?? index}-${index}`
        }
        numColumns={viewMode === "grid" ? 2 : 1}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ ...styles.flatListContent, paddingBottom: tabBarPadding }}
        columnWrapperStyle={
          viewMode === "grid" ? styles.columnWrapper : undefined
        }
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" color="#47C0D2" />
            </View>
          ) : null
        }
      />
      <Animated.View
        style={[styles.fabContainer, { transform: [{ scale: fabAnim }], bottom: tabBarPadding + 12 }]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onFabPressIn}
          onPressOut={onFabPressOut}
          onPress={() => {
            if (brands.length === 0) {
              navigation.navigate("Cart");
            } else if (brands.length === 1) {
              navigation.navigate("Cart", {
                brandId: brands[0].brandId,
                brandName: brands[0].brandName,
              });
            } else {
              brandPickerRef.current?.open();
            }
          }}
          style={{ position: "relative" }}
        >
          <LinearGradient
            colors={["#1B2351", "#47C0D2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <CartIcon size={28} fillColor="#FFFFFF" />
          </LinearGradient>
          {uniqueCount > 0 && (
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>
                {uniqueCount > 99 ? "99+" : uniqueCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
      <BrandCartPickerBottomSheet
        ref={brandPickerRef}
        brands={brands}
        onSelectBrand={(brand) => {
          navigation.navigate("Cart", {
            brandId: brand.brandId,
            brandName: brand.brandName,
          });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    marginBottom: 4,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    borderRadius: 32,
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  fabBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 99,
  },
  fabBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
  gridItem: {
    flex: 1,
    maxWidth: "47%",
    marginHorizontal: "1.5%",
    marginBottom: 12,
  },
  listItem: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  columnWrapper: {
    paddingHorizontal: 12,
    justifyContent: "flex-start",
  },
  cartSummary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  cartSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  cartSummaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartSummaryTitle: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
  },
  cartSummaryArrow: {
    fontSize: 10,
    color: "#6B7280",
  },
  cartItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 6,
  },
  cartItemImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
    resizeMode: "contain",
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 8,
  },
  cartItemName: {
    fontSize: scale(10),
    fontWeight: "600",
    color: "#1B2351",
    fontFamily: "Inter-SemiBold",
  },
  cartItemPrice: {
    fontSize: scale(9),
    color: "#47C0D2",
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    marginTop: 1,
  },
  cartItemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  cartItemQty: {
    fontSize: scale(11),
    fontWeight: "600",
    color: "#1B2351",
    fontFamily: "Inter-SemiBold",
  },
  summaryContainer: {
    marginHorizontal: 12,
    marginTop: 4,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  summaryLabel: {
    fontSize: scale(11),
    color: "#6B7280",
    fontFamily: "Inter-Regular",
  },
  summaryValue: {
    fontSize: scale(11),
    color: "#1B2351",
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  totalRow: {
    marginTop: 3,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
  },
  totalValue: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    backgroundColor: "#FFFFFF",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter-Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  clearAllButtonWrapper: {
    marginTop: 24,
    width: "80%",
    borderRadius: 12,
    overflow: "hidden",
  },
  clearAllGradient: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  clearAllButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
});
