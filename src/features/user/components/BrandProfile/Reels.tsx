import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import React, { useRef, useEffect } from "react";
import { scale, vs } from "react-native-size-matters";
import useBrandReels from "../../hooks/BrandProfile/useBrandReels";
import { lightColors } from "../../../../../theme";
import { getProductImageUri } from "../../../../utils/imageUtils";
import { Animated } from "react-native";
import { SvgXml } from "react-native-svg";
import EmptyState from "./EmptyState";

const screenWidth = Dimensions.get("window").width;
const padding = scale(12);
const gap = scale(8);
const cols = 3;
const cardSize = (screenWidth - padding * 2 - gap * (cols - 1)) / cols;

const playIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.45)"/>
  <path d="M10 8L16 12L10 16V8Z" fill="white"/>
</svg>`;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const FadeItem: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

const Reels = ({ brandId, onReelPress }: { brandId: number; onReelPress: (index: number) => void }) => {
  const { response: reels, loading, error } = useBrandReels(brandId);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
        <ActivityIndicator size="small" color={lightColors.primary} />
      </View>
    );
  }

  if (!reels || reels.length === 0) {
    return <EmptyState type="reels" />;
  }

  const rows = chunkArray(reels, 3);
  return (
    <View style={styles.section}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((item: any, i) => {
            const absoluteIndex = rowIdx * 3 + i;
            return (
              <FadeItem key={item.reelId || i} delay={(rowIdx * 3 + i) * 60}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => onReelPress(absoluteIndex)}
                  style={styles.card}
                >
                  <Image
                    source={(() => {
                      const uri = getProductImageUri(item);
                      return uri ? { uri } : require("../../../../assests/imgs/reel.png");
                    })()}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
                    <SvgXml xml={playIcon} width={scale(20)} height={scale(20)} />
                  </View>
                </TouchableOpacity>
              </FadeItem>
            );
          })}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, k) => (
              <View key={`empty-${k}`} style={{ width: cardSize }} />
            ))}
        </View>
      ))}
    </View>
  );
};

export default Reels;

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: scale(12),
    paddingTop: scale(4),
    paddingBottom: vs(20),
  },
  row: {
    flexDirection: "row",
    gap: scale(8),
    marginBottom: scale(8),
  },
  card: {
    width: cardSize,
    height: cardSize * 1.3,
    borderRadius: scale(12),
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: scale(-10),
    marginTop: scale(-10),
    alignItems: "center",
    justifyContent: "center",
  },
});
