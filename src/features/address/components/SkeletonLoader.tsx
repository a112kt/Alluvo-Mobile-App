import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

const SkeletonBlock: React.FC<{ width?: any; height?: number; borderRadius?: number; style?: any }> = ({
  width = "100%",
  height = 14,
  borderRadius = 6,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.row}>
              <SkeletonBlock width={scale(40)} height={scale(40)} borderRadius={20} />
              <View style={styles.nameBlock}>
                <SkeletonBlock width={scale(140)} height={16} />
                <SkeletonBlock width={scale(80)} height={12} style={{ marginTop: 6 }} />
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.details}>
            <SkeletonBlock width="90%" height={13} />
            <SkeletonBlock width="70%" height={13} style={{ marginTop: 8 }} />
            <SkeletonBlock width="50%" height={13} style={{ marginTop: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default SkeletonLoader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: scale(14),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameBlock: {
    marginLeft: scale(10),
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: lightColors.border + "30",
    marginHorizontal: scale(14),
  },
  details: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
  },
  skeleton: {
    backgroundColor: lightColors.bgHeavy + "60",
  },
});
