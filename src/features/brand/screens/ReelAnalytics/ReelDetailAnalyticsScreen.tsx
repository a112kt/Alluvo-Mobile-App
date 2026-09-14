import React, { useState, useMemo } from "react";
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
import { useReelDetailAnalytics } from "../../hooks/useReelDetailAnalytics";
import { ReelAnalyticsSkeleton, FadeInView } from "../../components/SkeletonLoader";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";

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

export default function ReelDetailAnalyticsScreen({ route, navigation }: any) {
  const { reelId } = route?.params ?? {};
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [period, setPeriod] = useState<Period>("monthly");

  const { data: analytics, isLoading, isRefetching, isError, refetch } = useReelDetailAnalytics(
    reelId,
    year
  );

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
          message="Analytics will appear here once this reel starts getting views."
        />
      </SafeAreaView>
    );
  }

  const a = analytics;

  const overviewCards = [
    {
      icon: "eye-outline" as const,
      label: "Current Month Views",
      value: fmt(a.currentMonthViews),
      color: lightColors.secondary,
    },
    {
      icon: "eye-outline" as const,
      label: "Last Month Views",
      value: fmt(a.lastMonthViews),
      color: lightColors.primary,
    },
    {
      icon: "trending-up-outline" as const,
      label: "Views Growth",
      value: `${a.growthPercentage > 0 ? "+" : ""}${a.growthPercentage.toFixed(1)}%`,
      color: "#10B981",
    },
  ];

  const perfData = (() => {
    if (period === "weekly") {
      return a.dailyViews.map((d) => ({ label: d.date.slice(0, 6), value: d.views }));
    }
    if (period === "yearly") {
      return a.yearlyViews.map((y) => ({ label: String(y.year), value: y.views }));
    }
    return a.monthlyViews.slice(-12).map((m) => ({
      label: m.month.slice(0, 3),
      value: m.views,
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
          <Text style={styles.headerSub}>Performance insights for this reel.</Text>
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
              <Text style={styles.sectionTitle}>Views Over Time</Text>
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

        {a.years.length > 1 && (
          <FadeInView delay={210}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Year</Text>
              </View>
              <View style={styles.yearRow}>
                {a.years.map((y) => (
                  <Pressable
                    key={y}
                    style={[styles.yearBtn, year === y && styles.yearBtnActive]}
                    onPress={() => setYear(y)}
                  >
                    <Text style={[styles.yearText, year === y && styles.yearTextActive]}>
                      {y}
                    </Text>
                  </Pressable>
                ))}
              </View>
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
  yearRow: {
    flexDirection: "row",
    gap: s(8),
    flexWrap: "wrap",
  },
  yearBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: s(10),
    backgroundColor: lightColors.bgLight,
  },
  yearBtnActive: {
    backgroundColor: lightColors.primary,
  },
  yearText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textSubtitle,
  },
  yearTextActive: {
    color: "#fff",
  },
});
