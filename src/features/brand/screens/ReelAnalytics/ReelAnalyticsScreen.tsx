import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import LineChart from "../../components/LineChart";
import { useBrandReelAnalytics } from "../../hooks/useBrandReelAnalytics";
import { ReelAnalyticsSkeleton, FadeInView } from "../../components/SkeletonLoader";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import type { BrandReelAnalytics } from "../../types/reelAnalytics";

type Period = "weekly" | "monthly" | "yearly";

const PERIOD_LABELS: Record<Period, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}



export default function ReelAnalyticsScreen({ navigation }: any) {
  const { data: analytics, isLoading, isRefetching, isError, refetch } = useBrandReelAnalytics();
  const [period, setPeriod] = useState<Period>("weekly");

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Reel Analytics</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ReelAnalyticsSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Reel Analytics</Text>
          </View>
        </View>
        <ErrorState message="Failed to load reel analytics." onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  if (!analytics) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Reel Analytics</Text>
          </View>
        </View>
        <EmptyState
          icon="bar-chart-outline"
          title="No analytics available yet."
          message="Analytics will appear here once you start publishing reels and engaging with your audience."
        />
      </SafeAreaView>
    );
  }

  const a = analytics;

  const overviewCards = [
    { icon: "eye-outline" as const, label: "Total Views", value: fmt(a.totalViews), color: lightColors.secondary },
    { icon: "heart-outline" as const, label: "Total Likes", value: fmt(a.totalLikes), color: lightColors.textDanger },
    { icon: "trending-up-outline" as const, label: "Reels Growth", value: `${a.viewsGrowthPercentage > 0 ? "+" : ""}${a.viewsGrowthPercentage.toFixed(1)}%`, color: "#10B981" },
  ];

  const engagementItems = [
    { label: "Published Reels", value: String(a.reelCounts.published), icon: "checkmark-circle-outline" as const },
    { label: "Product Views", value: fmt(a.productViewsCount), icon: "cube-outline" as const },
    { label: "Engagement Rate", value: `${a.engagementRate.toFixed(1)}%`, icon: "trending-up-outline" as const },
    { label: "Draft Reels", value: String(a.reelCounts.draft), icon: "document-outline" as const },
  ];

  const interactionItems = [
    { label: "Total Views", value: fmt(a.dailyEngagement.totalViews), icon: "eye-outline" as const },
    { label: "Total Likes", value: fmt(a.dailyEngagement.totalLikes), icon: "heart-outline" as const },
    { label: "Total Comments", value: fmt(a.dailyEngagement.totalComments), icon: "chatbubble-outline" as const },
    { label: "Avg Daily Views", value: fmt(Math.round(a.dailyEngagement.totalViews / Math.max(a.dailyEngagement.dailyViews.length, 1))), icon: "stats-chart-outline" as const },
  ];

  const audienceSegments = [
    { label: "Followers", count: a.audienceStats.followersCount, growth: a.audienceStats.followersGrowth, color: lightColors.secondary },
    { label: "Non-Followers", count: a.audienceStats.nonFollowersCount, growth: a.audienceStats.nonFollowersGrowth, color: lightColors.primary },
    { label: "New Users", count: a.audienceStats.newUsersCount, growth: a.audienceStats.newUsersGrowth, color: "#10B981" },
  ];

  const totalAudience = audienceSegments.reduce((sum, s) => sum + s.count, 0) || 1;

  const perfData = (() => {
    if (period === "weekly") {
      return a.dailyViews.map((d) => ({ label: d.date.slice(0, 6), value: d.count }));
    }
    if (period === "yearly") {
      return a.yearlyViews.map((y) => ({ label: String(y.year), value: y.count }));
    }
    return a.monthlyViews.slice(-12).map((m) => ({
      label: m.month.slice(0, 3),
      value: m.count,
    }));
  })();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Reel Analytics</Text>
          <Text style={styles.headerSub}>Track your reel performance and audience engagement.</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <FadeInView delay={50}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.overviewScroll}
            decelerationRate="fast"
            snapToInterval={s(160)}
          >
            {overviewCards.map((item, i) => (
              <View key={i} style={styles.overviewCard}>
                <View style={styles.overviewIcon}>
                  <Ionicons name={item.icon} size={s(22)} color={item.color} />
                </View>
                <Text style={styles.overviewValue}>{item.value}</Text>
                <Text style={styles.overviewLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </FadeInView>

        <FadeInView delay={130}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>All Records</Text>
            </View>
            <View style={styles.recordsRow}>
              {engagementItems.map((item, i) => (
                <React.Fragment key={i}>
                  <View style={styles.recordItem}>
                    <Ionicons name={item.icon} size={s(16)} color={lightColors.secondary} />
                    <Text style={styles.recordValue}>{item.value}</Text>
                    <Text style={styles.recordLabel}>{item.label}</Text>
                  </View>
                  {i < engagementItems.length - 1 && <View style={styles.recordDiv} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={210}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Audience Insights</Text>
            </View>
            {audienceSegments.map((seg, i) => {
              const pct = Math.round((seg.count / totalAudience) * 100);
              return (
                <View key={i} style={styles.segmentRow}>
                  <View style={styles.segmentLabelRow}>
                    <View style={[styles.segmentDot, { backgroundColor: seg.color }]} />
                    <Text style={styles.segmentLabel}>{seg.label}</Text>
                  </View>
                  <View style={styles.segmentBarBg}>
                    <View style={[styles.segmentBarFill, { width: `${pct}%`, backgroundColor: seg.color }]} />
                  </View>
                  <Text style={styles.segmentPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        </FadeInView>

        <FadeInView delay={290}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Performance Over Time</Text>
            </View>
            <View style={styles.periodRow}>
              {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
                <Pressable
                  key={p}
                  style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                    {PERIOD_LABELS[p]}
                  </Text>
                </Pressable>
              ))}
            </View>
            <LineChart data={perfData} />
          </View>
        </FadeInView>

        <FadeInView delay={370}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>User Interaction</Text>
            </View>
            <View style={styles.engagementGrid}>
              {interactionItems.map((item, i) => (
                <View key={i} style={styles.engItem}>
                  <Ionicons name={item.icon} size={s(18)} color={lightColors.secondary} />
                  <Text style={styles.engValue}>{item.value}</Text>
                  <Text style={styles.engLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </FadeInView>

        {a.topViewedReels.length > 0 && (
          <FadeInView delay={450}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Top Reels</Text>
              </View>
              {a.topViewedReels.map((reel, i) => (
                <View key={reel.reelId} style={styles.reelRow}>
                  <Text style={styles.rankNum}>#{i + 1}</Text>
                  <View style={styles.reelThumb}>
                    <Ionicons name="play-circle" size={s(28)} color={lightColors.secondary} />
                  </View>
                  <View style={styles.reelInfo}>
                    <Text style={styles.reelTitle} numberOfLines={1}>{reel.title}</Text>
                    <View style={styles.reelMeta}>
                      <View style={styles.reelMetaItem}>
                        <Ionicons name="eye-outline" size={s(12)} color={lightColors.textHint} />
                        <Text style={styles.reelMetaText}>{fmt(reel.views)}</Text>
                      </View>
                      <View style={styles.reelMetaItem}>
                        <Ionicons name="heart-outline" size={s(12)} color={lightColors.textHint} />
                        <Text style={styles.reelMetaText}>{fmt(reel.likes)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </FadeInView>
        )}

        {a.mostViewedProducts.length > 0 && (
          <FadeInView delay={530}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Most Viewed Products</Text>
              </View>
              {a.mostViewedProducts.map((prod, i) => (
                <View key={`anprod-${prod.productId}-${i}`} style={styles.prodRow}>
                  <Text style={styles.rankNum}>#{i + 1}</Text>
                  <View style={styles.prodImage}>
                    <Ionicons name="cube-outline" size={s(20)} color={lightColors.textInactive} />
                  </View>
                  <View style={styles.prodInfo}>
                    <Text style={styles.prodName} numberOfLines={1}>{prod.name}</Text>
                  </View>
                  <View style={styles.prodViews}>
                    <Ionicons name="eye-outline" size={s(14)} color={lightColors.textHint} />
                    <Text style={styles.prodViewsText}>{fmt(prod.views)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </FadeInView>
        )}

        <View style={{ height: vs(100) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: lightColors.bgLight },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: s(14),
  },
  headerTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(17),
    color: lightColors.textTitle,
  },
  headerSub: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingTop: vs(8),
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(14),
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(17),
    color: lightColors.textTitle,
  },

  overviewScroll: {
    paddingRight: s(20),
    marginBottom: vs(16),
    gap: s(10),
  },
  overviewCard: {
    width: s(150),
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    padding: s(18),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  overviewIcon: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(12),
  },
  overviewValue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(20),
    color: lightColors.textTitle,
    marginBottom: vs(4),
  },
  overviewLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(12),
    color: lightColors.textSubtitle,
  },

  sectionCard: {
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    padding: s(20),
    marginBottom: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  recordsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: vs(4),
  },
  recordItem: { alignItems: "center", flex: 1, gap: vs(4) },
  recordValue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
  },
  recordLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(10),
    color: lightColors.textSubtitle,
    textAlign: "center",
  },
  recordDiv: {
    width: 1,
    height: vs(36),
    backgroundColor: lightColors.separator,
  },

  segmentRow: { flexDirection: "row", alignItems: "center", marginBottom: vs(10) },
  segmentLabelRow: { flexDirection: "row", alignItems: "center", width: s(90), gap: s(6) },
  segmentDot: { width: s(8), height: s(8), borderRadius: s(4) },
  segmentLabel: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: lightColors.textSubtitle,
  },
  segmentBarBg: {
    flex: 1,
    height: vs(8),
    borderRadius: s(4),
    backgroundColor: lightColors.bgLight,
    marginHorizontal: s(10),
    overflow: "hidden",
  },
  segmentBarFill: { height: "100%", borderRadius: s(4) },
  segmentPct: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(13),
    color: lightColors.textTitle,
    width: s(36),
    textAlign: "right",
  },

  periodRow: {
    flexDirection: "row",
    backgroundColor: lightColors.bgLight,
    borderRadius: s(10),
    padding: s(3),
    marginBottom: vs(12),
    alignSelf: "flex-start",
  },
  periodBtn: { paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: s(8) },
  periodBtnActive: {
    backgroundColor: lightColors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  periodText: { fontFamily: "Inter", fontWeight: "500", fontSize: s(12), color: lightColors.textHint },
  periodTextActive: { color: lightColors.primary, fontWeight: "600" },

  engagementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: s(12),
  },
  engItem: {
    width: "46%",
    backgroundColor: lightColors.bgLight,
    borderRadius: s(14),
    padding: s(14),
    alignItems: "center",
  },
  engValue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    marginTop: vs(8),
  },
  engLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
    textAlign: "center",
  },

  reelRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.bgLight,
    borderRadius: s(14),
    padding: s(12),
    marginBottom: vs(8),
  },
  rankNum: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(12),
    color: lightColors.textHint,
    width: s(28),
  },
  reelThumb: {
    width: s(44),
    height: s(44),
    borderRadius: s(10),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reelInfo: { flex: 1, marginRight: s(8) },
  reelTitle: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textTitle,
    marginBottom: vs(4),
  },
  reelMeta: { flexDirection: "row", gap: s(12) },
  reelMetaItem: { flexDirection: "row", alignItems: "center", gap: s(3) },
  reelMetaText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textHint,
  },

  prodRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.bgLight,
    borderRadius: s(14),
    padding: s(12),
    marginBottom: vs(8),
  },
  prodImage: {
    width: s(40),
    height: s(40),
    borderRadius: s(10),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(12),
  },
  prodInfo: { flex: 1, marginRight: s(8) },
  prodName: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textTitle,
  },
  prodViews: { flexDirection: "row", alignItems: "center", gap: s(4) },
  prodViewsText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: lightColors.textSubtitle,
  },


});
