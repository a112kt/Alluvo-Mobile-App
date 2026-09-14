import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { SvgXml } from "react-native-svg";
import { scale, vs } from "react-native-size-matters";
import { filledStar, emptyStar } from "../../../../../assests/icons/AllIcon";
import { useTranslation } from "react-i18next";

interface Props {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

const BAR_TRACK_COLOR = "#F1F5F0";
const BAR_FILL_START = "#1B2351";
const BAR_FILL_END = "#47C0D2";

const AnimatedBar: React.FC<{ percentage: number; delay: number }> = ({
  percentage,
  delay,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 600,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View style={barStyles.track}>
      <Animated.View
        style={[
          barStyles.fill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            }),
          },
        ]}
      />
    </View>
  );
};

const barStyles = StyleSheet.create({
  track: {
    flex: 1,
    height: scale(8),
    backgroundColor: BAR_TRACK_COLOR,
    borderRadius: scale(4),
    overflow: "hidden",
    marginHorizontal: scale(8),
  },
  fill: {
    height: "100%",
    backgroundColor: BAR_FILL_START,
    borderRadius: scale(4),
  },
});

export default function ReviewSummaryCard({
  averageRating,
  totalReviews,
  distribution,
}: Props) {
  const { t } = useTranslation();
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Left: Average rating */}
        <View style={styles.left}>
          <Text style={styles.averageNumber}>
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <SvgXml
                key={i}
                xml={i <= Math.round(averageRating) ? filledStar : emptyStar}
                width={scale(16)}
                height={scale(16)}
              />
            ))}
          </View>
          <Text style={styles.totalText}>
            {t("basedOnReviews", { count: totalReviews })}
          </Text>
        </View>

        {/* Right: Distribution bars */}
        <View style={styles.right}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={styles.barLabel}>{star}★</Text>
                <AnimatedBar percentage={pct} delay={(5 - star) * 80} />
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    gap: scale(20),
  },
  left: {
    alignItems: "center",
    width: scale(100),
  },
  averageNumber: {
    fontSize: scale(48),
    fontWeight: "700",
    color: "#122550",
    fontFamily: "Inter",
    lineHeight: scale(52),
  },
  starsRow: {
    flexDirection: "row",
    marginTop: vs(4),
  },
  totalText: {
    fontSize: scale(11),
    color: "#A2ACB5",
    fontFamily: "Inter",
    marginTop: vs(6),
    textAlign: "center",
  },
  right: {
    flex: 1,
    justifyContent: "space-between",
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barLabel: {
    fontSize: scale(12),
    fontWeight: "500",
    color: "#535A65",
    fontFamily: "Inter",
    width: scale(28),
  },
  barCount: {
    fontSize: scale(11),
    fontWeight: "500",
    color: "#A2ACB5",
    fontFamily: "Inter",
    width: scale(20),
    textAlign: "right",
  },
});
