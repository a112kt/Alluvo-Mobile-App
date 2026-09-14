import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import type { TopReelDto } from "../types/dashboard";

interface TopReelCardProps {
  reel: TopReelDto;
  rank: number;
}

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function TopReelCard({ reel, rank }: TopReelCardProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      {reel.thumbnailUrl ? (
        <Image
          source={{ uri: reel.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.thumbPlaceholder]}>
          <Ionicons name="play-circle" size={s(20)} color={lightColors.secondary} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {reel.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="eye-outline" size={s(14)} color={lightColors.textHint} />
          <Text style={styles.metaText}>{fmt(reel.views)} views</Text>
          <Ionicons name="heart-outline" size={s(14)} color={lightColors.textHint} />
          <Text style={styles.metaText}>{fmt(reel.likes)}</Text>
        </View>
      </View>
      <Ionicons name="play-circle" size={s(28)} color={lightColors.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.white,
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  rankBadge: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(10),
  },
  rankText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(11),
    color: lightColors.textSubtitle,
  },
  thumbnail: {
    width: s(44),
    height: s(44),
    borderRadius: s(8),
    backgroundColor: lightColors.bgHeavy,
    marginRight: s(12),
  },
  thumbPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginRight: s(8),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textTitle,
    marginBottom: vs(2),
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
  },
  metaText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(12),
    color: lightColors.textHint,
    marginRight: s(4),
  },
});
