import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Image, Animated, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import type { BrandReelType } from "../../types/reelManagement";

interface ReelCardProps {
  reel: BrandReelType;
  onPress: () => void;
  onEdit?: () => void;
  onAnalytics?: () => void;
  onShare?: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function ReelCard({ reel, onPress, onEdit, onAnalytics, onShare }: ReelCardProps) {
  const isPublished = reel.status === "published";
  const { width: screenW } = useWindowDimensions();
  const thumbHeight = (screenW - s(48)) / (16 / 9);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, friction: 3, tension: 40, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <View style={[styles.thumbWrap, { height: thumbHeight }]}>
          {reel.thumbnail ? (
            <Image source={{ uri: reel.thumbnail }} style={styles.thumb} resizeMode="cover" />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Ionicons name="play-circle-outline" size={s(40)} color={lightColors.textInactive} />
            </View>
          )}
          <View style={styles.playBadge}>
            <Ionicons name="play" size={s(10)} color="#fff" />
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {reel.title || "Untitled Reel"}
            </Text>
            <Text style={styles.date}>{formatDate(reel.createdAt)}</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, isPublished ? styles.badgePublished : styles.badgeDraft]}>
              <View style={[styles.badgeDot, isPublished ? styles.dotPublished : styles.dotDraft]} />
              <Text style={[styles.badgeText, isPublished ? styles.badgeTextPublished : styles.badgeTextDraft]}>
                {isPublished ? "Published" : "Draft"}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={s(12)} color={lightColors.textHint} />
              <Text style={styles.statText}>{formatCount(reel.viewsCount ?? 0)}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="heart-outline" size={s(12)} color={lightColors.textHint} />
              <Text style={styles.statText}>{formatCount(reel.likesCount ?? 0)}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={s(12)} color={lightColors.textHint} />
              <Text style={styles.statText}>{formatCount(reel.commentsCount ?? 0)}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="share-outline" size={s(12)} color={lightColors.textHint} />
              <Text style={styles.statText}>{formatCount(reel.sharesCount ?? 0)}</Text>
              <Text style={styles.statLabel}>Shares</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              onPress={(e) => { e.stopPropagation(); onEdit?.(); }}
            >
              <Ionicons name="create-outline" size={s(14)} color={lightColors.primary} />
              <Text style={styles.actionBtnText}>Edit</Text>
            </Pressable>
            <View style={styles.actionDivider} />
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              onPress={(e) => { e.stopPropagation(); onAnalytics?.(); }}
            >
              <Ionicons name="bar-chart-outline" size={s(14)} color={lightColors.secondary} />
              <Text style={[styles.actionBtnText, { color: lightColors.secondary }]}>Analytics</Text>
            </Pressable>
            <View style={styles.actionDivider} />
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              onPress={(e) => { e.stopPropagation(); onShare?.(); }}
            >
              <Ionicons name="share-social-outline" size={s(14)} color={lightColors.textSubtitle} />
              <Text style={[styles.actionBtnText, { color: lightColors.textSubtitle }]}>Share</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    overflow: "hidden",
    marginBottom: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  thumbWrap: {
    width: "100%",
    backgroundColor: lightColors.bgLight,
    position: "relative",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playBadge: {
    position: "absolute",
    bottom: s(10),
    left: s(10),
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    padding: s(16),
  },
  titleRow: {
    marginBottom: vs(8),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: lightColors.textTitle,
    lineHeight: s(22),
    marginBottom: vs(2),
  },
  date: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textInactive,
  },
  badgeRow: {
    marginBottom: vs(10),
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
    alignSelf: "flex-start",
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: s(12),
  },
  badgePublished: {
    backgroundColor: lightColors.bgSuccess,
  },
  badgeDraft: {
    backgroundColor: lightColors.bgWarning,
  },
  badgeDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
  },
  dotPublished: {
    backgroundColor: lightColors.textSuccess,
  },
  dotDraft: {
    backgroundColor: lightColors.textWarning,
  },
  badgeText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(11),
  },
  badgeTextPublished: {
    color: lightColors.textSuccess,
  },
  badgeTextDraft: {
    color: lightColors.textWarning,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vs(12),
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(3),
  },
  statText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: lightColors.textTitle,
  },
  statLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(10),
    color: lightColors.textHint,
  },
  divider: {
    height: 1,
    backgroundColor: lightColors.border,
    marginBottom: vs(10),
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(4),
    paddingVertical: vs(6),
    borderRadius: s(10),
  },
  actionBtnPressed: {
    backgroundColor: lightColors.bgLight,
  },
  actionBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: lightColors.primary,
  },
  actionDivider: {
    width: 1,
    height: s(16),
    backgroundColor: lightColors.border,
  },
});
