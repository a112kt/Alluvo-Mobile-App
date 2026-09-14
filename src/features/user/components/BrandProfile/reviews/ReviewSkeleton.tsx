import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { scale, vs } from "react-native-size-matters";

const Shimmer: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}> = ({ width, height, borderRadius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity,
          backgroundColor: "#E2E8F0",
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
};

export default function ReviewSkeleton() {
  return (
    <View style={styles.container}>
      {/* Summary card skeleton */}
      <View style={styles.card}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <Shimmer width={scale(56)} height={scale(56)} borderRadius={scale(8)} />
            <Shimmer width={scale(100)} height={scale(12)} borderRadius={6} style={{ marginTop: vs(8) }} />
            <Shimmer width={scale(70)} height={scale(10)} borderRadius={5} style={{ marginTop: vs(6) }} />
          </View>
          <View style={styles.summaryRight}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.barRow}>
                <Shimmer width={scale(14)} height={scale(10)} borderRadius={3} />
                <Shimmer width="100%" height={scale(8)} borderRadius={4} style={{ marginLeft: scale(8) }} />
                <Shimmer width={scale(16)} height={scale(10)} borderRadius={3} style={{ marginLeft: scale(8) }} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Input card skeleton */}
      <View style={styles.card}>
        <Shimmer width={scale(120)} height={scale(16)} borderRadius={6} />
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Shimmer key={i} width={scale(28)} height={scale(28)} borderRadius={scale(14)} />
          ))}
        </View>
        <Shimmer width="100%" height={vs(80)} borderRadius={scale(12)} />
        <Shimmer width="100%" height={vs(48)} borderRadius={scale(12)} style={{ marginTop: vs(12) }} />
      </View>

      {/* Filter chips skeleton */}
      <View style={styles.chipsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Shimmer key={i} width={scale(60)} height={scale(32)} borderRadius={scale(16)} />
        ))}
      </View>

      {/* Review card skeletons */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card}>
          <View style={styles.reviewHeader}>
            <Shimmer width={scale(44)} height={scale(44)} borderRadius={scale(22)} />
            <View style={styles.reviewHeaderRight}>
              <Shimmer width={scale(100)} height={scale(14)} borderRadius={6} />
              <View style={styles.reviewStarsRow}>
                {[1, 2, 3, 4, 5].map((j) => (
                  <Shimmer key={j} width={scale(12)} height={scale(12)} borderRadius={scale(6)} />
                ))}
                <Shimmer width={scale(40)} height={scale(10)} borderRadius={3} style={{ marginLeft: scale(8) }} />
              </View>
            </View>
          </View>
          <Shimmer width="90%" height={scale(12)} borderRadius={5} style={{ marginTop: vs(12) }} />
          <Shimmer width="70%" height={scale(12)} borderRadius={5} style={{ marginTop: vs(6) }} />
          <View style={styles.reviewFooter}>
            <Shimmer width={scale(50)} height={scale(10)} borderRadius={3} />
            <View style={styles.reviewFooterRight}>
              <Shimmer width={scale(60)} height={scale(28)} borderRadius={scale(14)} />
              <Shimmer width={scale(60)} height={scale(28)} borderRadius={scale(14)} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(12),
    paddingTop: vs(12),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(20),
    padding: scale(20),
    marginBottom: vs(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    gap: scale(20),
  },
  summaryLeft: {
    alignItems: "center",
    width: scale(100),
  },
  summaryRight: {
    flex: 1,
    justifyContent: "space-between",
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsRow: {
    flexDirection: "row",
    gap: scale(6),
    marginVertical: vs(14),
  },
  chipsRow: {
    flexDirection: "row",
    gap: scale(8),
    marginBottom: vs(12),
    paddingHorizontal: scale(4),
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewHeaderRight: {
    marginLeft: scale(12),
    flex: 1,
  },
  reviewStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(4),
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: vs(12),
  },
  reviewFooterRight: {
    flexDirection: "row",
    gap: scale(8),
  },
});
