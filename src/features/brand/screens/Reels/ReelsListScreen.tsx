import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
  Animated,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useBrandTabBarPadding } from "../../navigation/useBrandTabBarPadding";
import { useGetBrandReels } from "../../hooks/useReelManagement";
import ReelCard from "../../components/ReelManagement/ReelCard";
import { ReelsListSkeleton } from "../../components/SkeletonLoader";
import ErrorState from "../../components/ErrorState";
import type { BrandReelType } from "../../types/reelManagement";
import { useShareReel } from "../../../../features/user/hooks/useShareReel";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
];

const SORT_OPTIONS = [
  { key: "newest", label: "Newest First" },
  { key: "oldest", label: "Oldest First" },
  { key: "popular", label: "Most Popular" },
];

const PAD = {
  screen: s(24),
  section: vs(20),
  card: vs(14),
  bottom: vs(100),
};

const EMPTY_REELS: BrandReelType[] = [];
const EMPTY_COUNTS = { all: 0, published: 0, draft: 0 } as const;

function FadeInCard({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay: Math.min(index * 50, 250),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        delay: Math.min(index * 50, 250),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

function EmptyReels({ navigation }: { navigation: any }) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 35, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[emptyStyles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={emptyStyles.illustrationWrap}>
        <View style={emptyStyles.illustrationBg}>
          <Ionicons name="film-outline" size={s(48)} color={lightColors.primary + "30"} />
        </View>
        <View style={emptyStyles.illustrationRing} />
      </View>

      <Text style={emptyStyles.title}>No reels yet</Text>
      <Text style={emptyStyles.message}>
        Start creating engaging video content for your audience.
      </Text>

      <View style={emptyStyles.btnRow}>
        <Pressable
          style={({ pressed }) => [emptyStyles.ctaBtn, pressed && emptyStyles.ctaBtnPressed]}
          onPress={() => navigation.navigate("RecordReel")}
        >
          <Ionicons name="videocam" size={s(18)} color="#fff" />
          <Text style={emptyStyles.ctaBtnText}>Record</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [emptyStyles.secondaryBtn, pressed && emptyStyles.secondaryBtnPressed]}
          onPress={() => navigation.navigate("AddReel")}
        >
          <Ionicons name="cloud-upload-outline" size={s(18)} color={lightColors.primary} />
          <Text style={emptyStyles.secondaryBtnText}>Upload</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default function ReelsListScreen({ navigation }: any) {
  const tabBarPadding = useBrandTabBarPadding();
  const { shareReel } = useShareReel();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showSort, setShowSort] = useState(false);
  const [hasNewInsights] = useState(true);
  const [accumulatedReels, setAccumulatedReels] = useState<BrandReelType[]>([]);

  const contentFade = useRef(new Animated.Value(0)).current;
  const hasLoaded = useRef(false);

  const { data, isLoading, isFetching, isRefetching, refetch, isError } = useGetBrandReels({
    Search: search,
    Status: filter === "all" ? "" : filter,
    Sort: sort,
    Page: page,
  });

  if (data && !hasLoaded.current) {
    hasLoaded.current = true;
  }

  const reels = data?.data?.data ?? EMPTY_REELS;
  const counts = data?.data?.counts ?? EMPTY_COUNTS;
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  useEffect(() => {
    if (page === 1) {
      setAccumulatedReels(reels);
    } else if (reels.length > 0) {
      setAccumulatedReels((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newReels = reels.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newReels];
      });
    }
  }, [reels, page]);

  useEffect(() => {
    if (!isLoading || hasLoaded.current) {
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      contentFade.setValue(0);
    }
  }, [isLoading]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(key);
    setPage(1);
  }, []);

  const handleReelPress = useCallback(
    (reel: BrandReelType) => {
      navigation.navigate("ReelDetail", { reelId: reel.id });
    },
    [navigation]
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.actionsSection}>
        <Pressable
          style={({ pressed }) => [styles.createBtn, pressed && styles.createBtnPressed]}
          onPress={() => navigation.navigate("RecordReel")}
        >
          <Ionicons name="videocam" size={s(15)} color="#fff" />
          <Text style={styles.createBtnText}>Create Reel</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.uploadBtn, pressed && styles.uploadBtnPressed]}
          onPress={() => navigation.navigate("AddReel")}
        >
          <Ionicons name="cloud-upload-outline" size={s(15)} color={lightColors.primary} />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={s(18)} color={lightColors.textHint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your reels..."
          placeholderTextColor={lightColors.textInactive}
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 ? (
          <Pressable onPress={() => handleSearch("")}>
            <View style={styles.clearBtn}>
              <Ionicons name="close" size={s(14)} color={lightColors.textHint} />
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={() => setShowSort(true)}>
            <View style={styles.sortBtn}>
              <Ionicons name="swap-vertical" size={s(14)} color={lightColors.white} />
            </View>
          </Pressable>
        )}
      </View>

      <View style={styles.segmentRow}>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          const count = counts[f.key as keyof typeof counts] ?? 0;
          return (
            <Pressable
              key={f.key}
              style={({ pressed }) => [
                styles.segment,
                isActive && styles.segmentActive,
                pressed && !isActive && styles.segmentPressed,
              ]}
              onPress={() => handleFilterChange(f.key)}
            >
              {isActive && <View style={styles.segmentDot} />}
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {f.label}
              </Text>
              {count > 0 && (
                <View style={[styles.segmentBadge, isActive && styles.segmentBadgeActive]}>
                  <Text style={[styles.segmentBadgeText, isActive && styles.segmentBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  if (!hasLoaded.current && isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Reels</Text>
        </View>
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={
            <View style={styles.scrollContent}>
              <ReelsListSkeleton />
            </View>
          }
          contentContainerStyle={{ paddingBottom: tabBarPadding + PAD.bottom }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Reels</Text>
          <Pressable
            style={({ pressed }) => [styles.analyticsBtn, pressed && styles.analyticsBtnPressed]}
            onPress={() => navigation.navigate("ReelAnalytics")}
          >
            <Ionicons name="bar-chart-outline" size={s(20)} color={lightColors.primary} />
            {hasNewInsights && <View style={styles.notifDot} />}
          </Pressable>
        </View>
        <ErrorState message="Something went wrong loading your reels." onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Animated.View style={{ flex: 1, opacity: contentFade }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Reels</Text>
          <Pressable
            style={({ pressed }) => [styles.analyticsBtn, pressed && styles.analyticsBtnPressed]}
            onPress={() => navigation.navigate("ReelAnalytics")}
          >
            <Ionicons name="bar-chart-outline" size={s(20)} color={lightColors.primary} />
            {hasNewInsights && <View style={styles.notifDot} />}
          </Pressable>
        </View>

        <FlatList
          data={accumulatedReels}
          keyExtractor={(item: BrandReelType) => item.id.toString()}
          renderItem={({ item, index }) => (
            <FadeInCard index={index}>
              <ReelCard
                reel={item}
                onPress={() => handleReelPress(item)}
                onEdit={() => navigation.navigate("EditReel", { reelId: item.id })}
                onAnalytics={() => navigation.navigate("ReelDetailAnalytics", { reelId: item.id })}
                onShare={() => shareReel(item.id, item.title)}
              />
            </FadeInCard>
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={<EmptyReels navigation={navigation} />}
          ListFooterComponent={
            isFetching && !isRefetching ? (
              <ActivityIndicator size="small" color={lightColors.secondary} style={{ marginVertical: vs(16) }} />
            ) : null
          }
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabBarPadding + PAD.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={lightColors.secondary}
            />
          }
          onEndReached={() => {
            if (page < totalPages) setPage((p) => p + 1);
          }}
          onEndReachedThreshold={0.5}
        />
      </Animated.View>

      <Modal visible={showSort} transparent animationType="fade" onRequestClose={() => setShowSort(false)}>
        <Pressable style={styles.sortOverlay} onPress={() => setShowSort(false)}>
          <View style={styles.sortSheet}>
            <View style={styles.sortHandle} />
            <Text style={styles.sortTitle}>Sort by</Text>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                style={({ pressed }) => [
                  styles.sortOption,
                  sort === opt.key && styles.sortOptionActive,
                  pressed && styles.sortOptionPressed,
                ]}
                onPress={() => {
                  setSort(opt.key);
                  setPage(1);
                  setShowSort(false);
                }}
              >
                <Text style={[styles.sortOptionText, sort === opt.key && styles.sortOptionTextActive]}>
                  {opt.label}
                </Text>
                {sort === opt.key && (
                  <Ionicons name="checkmark-circle" size={s(20)} color={lightColors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  scrollContent: {
    paddingHorizontal: PAD.screen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PAD.screen,
    paddingTop: vs(8),
    paddingBottom: vs(16),
  },
  headerTitle: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: s(28),
    color: lightColors.textTitle,
    letterSpacing: -0.5,
  },
  analyticsBtn: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  analyticsBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  notifDot: {
    position: "absolute",
    top: s(10),
    right: s(10),
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: lightColors.textDanger,
    borderWidth: 2,
    borderColor: lightColors.white,
  },
  headerContent: {
    paddingTop: vs(4),
    paddingBottom: vs(8),
  },
  actionsSection: {
    flexDirection: "row",
    gap: s(12),
    marginBottom: PAD.section,
  },
  createBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(8),
    backgroundColor: lightColors.primary,
    height: vs(48),
    borderRadius: s(16),
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  createBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  createBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: "#fff",
  },
  uploadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(8),
    backgroundColor: lightColors.white,
    height: vs(48),
    borderRadius: s(16),
    borderWidth: 1.5,
    borderColor: lightColors.primary + "20",
  },
  uploadBtnPressed: {
    backgroundColor: lightColors.bgLight,
  },
  uploadBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.primary,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.white,
    borderRadius: s(16),
    paddingHorizontal: s(16),
    height: vs(48),
    marginBottom: PAD.section,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: s(14),
    color: lightColors.textTitle,
    marginLeft: s(12),
  },
  sortBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: lightColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(8),
    marginBottom: vs(4),
  },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderRadius: s(20),
    backgroundColor: lightColors.white,
  },
  segmentPressed: {
    backgroundColor: lightColors.bgLight,
  },
  segmentActive: {
    backgroundColor: lightColors.primary,
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  segmentText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(13),
    color: lightColors.textSubtitle,
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  segmentBadge: {
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: s(8),
    backgroundColor: lightColors.bgLight,
    minWidth: s(20),
    alignItems: "center",
  },
  segmentBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  segmentBadgeText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(10),
    color: lightColors.textHint,
  },
  segmentBadgeTextActive: {
    color: "#fff",
  },
  sortOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sortSheet: {
    backgroundColor: lightColors.white,
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    padding: s(24),
    paddingBottom: vs(40),
  },
  sortHandle: {
    width: s(40),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: lightColors.border,
    alignSelf: "center",
    marginBottom: vs(20),
  },
  sortTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    marginBottom: vs(16),
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: vs(14),
    paddingHorizontal: s(16),
    borderRadius: s(14),
    marginBottom: vs(4),
  },
  sortOptionActive: {
    backgroundColor: lightColors.primary + "08",
  },
  sortOptionPressed: {
    backgroundColor: lightColors.primary + "12",
  },
  sortOptionText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(15),
    color: lightColors.textSubtitle,
  },
  sortOptionTextActive: {
    color: lightColors.primary,
    fontWeight: "600",
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(60),
    paddingHorizontal: s(32),
  },
  illustrationWrap: {
    width: s(120),
    height: s(120),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(32),
  },
  illustrationBg: {
    width: s(96),
    height: s(96),
    borderRadius: s(48),
    backgroundColor: lightColors.primary + "08",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  illustrationRing: {
    position: "absolute",
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    borderWidth: 2,
    borderColor: lightColors.primary + "10",
    borderStyle: "dashed",
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    textAlign: "center",
    marginBottom: vs(8),
    lineHeight: s(26),
  },
  message: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(14),
    color: lightColors.textHint,
    textAlign: "center",
    lineHeight: s(22),
    marginBottom: vs(32),
    maxWidth: s(280),
  },
  btnRow: {
    flexDirection: "row",
    gap: s(12),
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
    backgroundColor: lightColors.primary,
    paddingHorizontal: s(24),
    paddingVertical: vs(14),
    borderRadius: s(16),
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  ctaBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
    color: "#fff",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
    backgroundColor: lightColors.white,
    paddingHorizontal: s(24),
    paddingVertical: vs(14),
    borderRadius: s(16),
    borderWidth: 1.5,
    borderColor: lightColors.primary + "20",
  },
  secondaryBtnPressed: {
    backgroundColor: lightColors.bgLight,
  },
  secondaryBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
    color: lightColors.primary,
  },
});
