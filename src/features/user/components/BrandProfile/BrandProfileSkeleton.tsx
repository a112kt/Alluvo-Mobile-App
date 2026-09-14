import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { s, vs } from "react-native-size-matters";

function Shimmer({ width, height, borderRadius = s(12), flex, style }: { width?: number | string; height: number; borderRadius?: number; flex?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: "#E2E8F0", opacity, flex },
        style,
      ]}
    />
  );
}

export default function BrandProfileSkeleton() {
  return (
    <View style={styles.container}>
      <Shimmer width="100%" height={vs(240)} borderRadius={0} />

      <View style={styles.logoRow}>
        <Shimmer width={s(96)} height={s(96)} borderRadius={s(28)} style={styles.logoShimmer} />
      </View>

      <View style={styles.bodyCard}>
        <View style={styles.nameRow}>
          <Shimmer width="50%" height={s(26)} borderRadius={s(8)} />
          <View style={styles.badgesRow}>
            <Shimmer width={s(64)} height={s(24)} borderRadius={s(12)} />
            <Shimmer width={s(60)} height={s(24)} borderRadius={s(12)} />
          </View>
        </View>

        <Shimmer width="40%" height={s(14)} borderRadius={s(6)} style={{ marginTop: vs(8) }} />

        <Shimmer width="100%" height={s(14)} borderRadius={s(6)} style={{ marginTop: vs(14) }} />
        <Shimmer width="85%" height={s(14)} borderRadius={s(6)} style={{ marginTop: vs(6) }} />
        <Shimmer width="60%" height={s(14)} borderRadius={s(6)} style={{ marginTop: vs(6) }} />

        <View style={styles.statsRow}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.statItem}>
              <Shimmer width={s(44)} height={s(44)} borderRadius={s(14)} />
              <Shimmer width={s(50)} height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(8) }} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.analyticsRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.analyticsCard}>
            <Shimmer width={s(40)} height={s(40)} borderRadius={s(12)} />
            <Shimmer width={s(48)} height={s(20)} borderRadius={s(6)} style={{ marginTop: vs(10) }} />
            <Shimmer width={s(60)} height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
          </View>
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Shimmer width={s(40)} height={s(40)} borderRadius={s(12)} />
          <View style={{ flex: 1, marginLeft: s(12) }}>
            <Shimmer width="55%" height={s(14)} borderRadius={s(4)} />
            <Shimmer width="75%" height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
          </View>
        </View>
        <View style={[styles.infoRow, { marginTop: vs(12) }]}>
          <Shimmer width={s(40)} height={s(40)} borderRadius={s(12)} />
          <View style={{ flex: 1, marginLeft: s(12) }}>
            <Shimmer width="55%" height={s(14)} borderRadius={s(4)} />
            <Shimmer width="65%" height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
          </View>
        </View>
      </View>

      <View style={styles.ownerCard}>
        <Shimmer width={s(52)} height={s(52)} borderRadius={s(16)} />
        <View style={{ flex: 1, marginLeft: s(14) }}>
          <Shimmer width="50%" height={s(16)} borderRadius={s(6)} />
          <Shimmer width="70%" height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
          <Shimmer width="55%" height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(4) }} />
        </View>
        <Shimmer width={s(72)} height={s(36)} borderRadius={s(18)} />
      </View>

      <View style={styles.actionsRow}>
        <Shimmer flex={1} height={s(48)} borderRadius={s(24)} style={{ marginRight: s(6) }} />
        <Shimmer flex={1} height={s(48)} borderRadius={s(24)} style={{ marginLeft: s(6) }} />
      </View>

      <View style={styles.tabsBar}>
        <Shimmer width={s(48)} height={s(40)} borderRadius={s(20)} />
        <Shimmer width={s(48)} height={s(40)} borderRadius={s(20)} />
        <Shimmer width={s(48)} height={s(40)} borderRadius={s(20)} />
        <Shimmer width={s(48)} height={s(40)} borderRadius={s(20)} />
        <Shimmer width={s(48)} height={s(40)} borderRadius={s(20)} />
      </View>

      <View style={styles.contentArea}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.contentCard}>
            <Shimmer width="100%" height={vs(180)} borderRadius={s(16)} />
            <Shimmer width="70%" height={s(14)} borderRadius={s(4)} style={{ marginTop: vs(10) }} />
            <Shimmer width="40%" height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  logoRow: {
    alignItems: "center",
    marginTop: vs(-48),
  },
  logoShimmer: {
    borderWidth: 5,
    borderColor: "#F8FAFC",
  },
  bodyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: s(20),
    marginTop: vs(16),
    borderRadius: s(24),
    padding: s(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgesRow: {
    flexDirection: "row",
    gap: s(6),
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: vs(24),
    paddingTop: vs(20),
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statItem: {
    alignItems: "center",
  },
  analyticsRow: {
    flexDirection: "row",
    marginHorizontal: s(20),
    marginTop: vs(16),
    gap: s(10),
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: s(20),
    padding: s(16),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: s(20),
    marginTop: vs(16),
    borderRadius: s(24),
    padding: s(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: s(20),
    marginTop: vs(16),
    borderRadius: s(24),
    padding: s(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  actionsRow: {
    flexDirection: "row",
    marginHorizontal: s(20),
    marginTop: vs(16),
  },
  tabsBar: {
    flexDirection: "row",
    marginHorizontal: s(20),
    marginTop: vs(16),
    backgroundColor: "#FFFFFF",
    borderRadius: s(24),
    padding: s(6),
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  contentArea: {
    marginHorizontal: s(20),
    marginTop: vs(16),
    gap: s(12),
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: s(16),
    padding: s(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
});
