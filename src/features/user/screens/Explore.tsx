import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { scale, vs, ms, s } from "react-native-size-matters";
import { UserStackParamList } from "../../../Navigation/types";
import { backarrow, searchSvg, trashSvg } from "../../../assests/icons/AllIcon";
import ProductList from "../components/DiscoverCard";
import useSearch from "../hooks/useSearch";
import { useAppDispatch, useAppSelector } from "../../../Redux/store";
import {
  addSearchKeyword,
  clearSearchHistory,
} from "../../../Redux/slices/searchHistorySlice";
import { useHomeProducts } from "../hooks/Home/useHomeProducts";
import { useWishlist, useToggleWishlist } from "../hooks/useWishlist";
import { Reel } from "../services";
import { getReelThumbnailUri, getProductImageUri } from "../../../utils/imageUtils";
import { showToast } from "../../../services/toastService";
import { lightColors } from "../../../../theme";

const { width } = Dimensions.get("window");
const REEL_CARD_WIDTH = width * 0.4;

const Explore = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const dispatch = useAppDispatch();
  const searchKeywords = useAppSelector(
    (state) => state.searchHistory?.keywords ?? []
  );

  const { data: discoverData, isLoading: discoverLoading, isError: discoverError, refetch: discoverRefetch } = useHomeProducts();
  const discoverProducts = discoverData?.data?.data ?? [];

  const { mutate: toggleWishlistMutate } = useToggleWishlist();
  const { data: wishlistData } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (wishlistData?.data?.products) {
      const items = wishlistData.data.products.reduce((acc: any, curr: any) => {
        acc[curr.productId] = true;
        return acc;
      }, {});
      setWishlistItems(items);
    }
  }, [wishlistData]);

  const handleToggleWishlist = useCallback((item: any) => {
    const id = item.id || item.productId;
    if (!id) return;
    const isFav = wishlistItems[id];
    const newState = !isFav;

    setWishlistItems((prev) => ({
      ...prev,
      [id]: newState,
    }));

    toggleWishlistMutate(id, {
      onError: () => {
        setWishlistItems((prev) => ({
          ...prev,
          [id]: isFav,
        }));
        showToast("Error", "Failed to update wishlist.");
      },
    });
  }, [wishlistItems, toggleWishlistMutate]);

  const recommendations = ["Cap", "Accessor", "Black T-", "Jean", "White"];

  const {
    text,
    setText,
    data,
    loading,
    error,
    hasSearched,
    handleSearch,
    clearSearch,
  } = useSearch();

  const onSubmitSearch = async () => {
    const query = text.trim();
    if (!query) return;
    const ok = await handleSearch(query);
    if (ok) {
      dispatch(addSearchKeyword(query));
    }
  };

  const handleSearchChip = async (query: string) => {
    setText(query);
    const ok = await handleSearch(query);
    if (ok) {
      dispatch(addSearchKeyword(query));
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleClearHistory = () => {
    dispatch(clearSearchHistory());
  };

  const handleProductPress = (item: any) => {
    navigation.navigate("ProductDetails", {
      product: item,
    });
  };

  const handleReelPress = (reel: Reel) => {
    navigation.navigate("ReelDetail", { initialReelId: reel.reelId });
  };

  const renderChip = (item: string, onPress?: () => void, key?: string) => (
    <TouchableOpacity key={key} style={styles.chip} onPress={onPress}>
      <Text style={styles.chipText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderReelItem = ({ item }: { item: Reel }) => {
    const thumbUri = getReelThumbnailUri(item);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleReelPress(item)}
        style={styles.reelCard}
      >
        {thumbUri ? (
          <Image
            source={{ uri: thumbUri }}
            style={styles.reelImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.reelImage, styles.reelPlaceholder]}>
            <Ionicons name="play-circle" size={32} color="#FFF" />
          </View>
        )}
        <View style={styles.reelOverlay} />
        <Text style={styles.reelBrand} numberOfLines={1}>
          {item.brandName}
        </Text>
      </TouchableOpacity>
    );
  };

  const isSearching = hasSearched;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <SvgXml xml={backarrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={text}
            onChangeText={setText}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
            placeholderTextColor="#9CA3AF"
          />
          {text.length > 0 ? (
            <TouchableOpacity onPress={handleClearSearch} style={styles.searchIcon}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.searchIcon}>
              <SvgXml xml={searchSvg} width={20} height={20} />
            </View>
          )}
        </View>

        {isSearching ? (
          <View>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1B2351" />
              </View>
            )}

            {error && (
              <Text style={styles.errorText}>Error: {error}</Text>
            )}

            {!loading && data.products.length === 0 && data.reels.length === 0 && (
              <Text style={styles.emptyText}>
                No results found for "{text}"
              </Text>
            )}

            {data.products.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, { marginTop: vs(16) }]}>
                  Products
                </Text>
                <ProductList
                  products={data.products.map((item) => ({
                    ...item,
                    id: item.productId.toString(),
                    productName: item.name,
                    mediaUrl: getProductImageUri(item),
                    rate: 4.5,
                    isInWishlist: !!wishlistItems[item.productId],
                  }))}
                  onProductPress={handleProductPress}
                  onToggleWishlist={handleToggleWishlist}
                />
              </View>
            )}

            {data.reels.length > 0 && (
              <View style={{ marginTop: vs(16) }}>
                <Text style={styles.sectionTitle}>Reels</Text>
                <FlatList
                  data={data.reels}
                  renderItem={renderReelItem}
                  keyExtractor={(item) => String(item.reelId)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.reelsList}
                  snapToInterval={REEL_CARD_WIDTH + s(12)}
                  decelerationRate="fast"
                />
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Search history</Text>
              <TouchableOpacity onPress={handleClearHistory}>
                <SvgXml xml={trashSvg} width={20} height={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.chipsContainer}>
              {searchKeywords.length > 0 ? (
                searchKeywords.map((item) =>
                  renderChip(item, () => handleSearchChip(item), item)
                )
              ) : (
                <Text style={styles.emptyText}>No search history</Text>
              )}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: vs(20) }]}>
              Recommendations
            </Text>

            <View style={styles.chipsContainer}>
              {recommendations.map((item) =>
                renderChip(item, () => handleSearchChip(item), item)
              )}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: vs(20) }]}>
              Discover
            </Text>

            <ProductList
              products={discoverProducts.map((item: any) => ({
                ...item,
                isInWishlist: !!wishlistItems[item.productId || item.id],
              }))}
              onProductPress={handleProductPress}
              onToggleWishlist={handleToggleWishlist}
              loading={discoverLoading}
              error={discoverError ? "Could not load products" : null}
              onRetry={discoverRefetch}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: vs(10),
  },
  backBtn: {
    padding: scale(5),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: "#1B2351",
    marginStart: scale(10),
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: vs(20),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: scale(20),
    paddingHorizontal: scale(15),
    height: vs(45),
    marginVertical: vs(15),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: scale(14),
    color: "#1B2351",
  },
  searchIcon: {
    marginStart: scale(10),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(10),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#1F2937",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  chip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: scale(16),
    paddingVertical: vs(8),
    borderRadius: scale(10),
  },
  chipText: {
    fontSize: scale(14),
    color: "#4B5563",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(30),
  },
  errorText: {
    fontSize: scale(14),
    color: "#DC2626",
    textAlign: "center",
    paddingVertical: vs(15),
  },
  emptyText: {
    fontSize: scale(14),
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: vs(20),
  },
  reelsList: {
    paddingRight: s(12),
  },
  reelCard: {
    width: REEL_CARD_WIDTH,
    height: vs(240),
    marginRight: s(12),
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1B2351",
    justifyContent: "flex-end",
  },
  reelImage: {
    ...StyleSheet.absoluteFillObject,
  },
  reelPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A5A",
  },
  reelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  reelBrand: {
    color: "#FFF",
    fontSize: ms(12),
    fontWeight: "700",
    padding: s(10),
  },
});
