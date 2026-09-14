import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import type { TopEngagedUserDto } from "../../types/brandProfile";

interface Props {
  users: TopEngagedUserDto[];
  isLoading?: boolean;
}

export default function TopEngagedUsersCard({ users, isLoading }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Top Engaged Users</Text>
      {users.length > 0 ? (
        users.map((user, index) => (
          <View
            key={user.userId}
            style={[styles.userRow, index < users.length - 1 && styles.userRowBorder]}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            {user.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons
                  name="person-outline"
                  size={s(16)}
                  color={lightColors.textInactive}
                />
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user.displayName}
              </Text>
              <Text style={styles.userMeta}>
                {user.ordersCount.toLocaleString("en")} orders {"\u2022"} Score{" "}
                {user.engagementScore.toFixed(1)}
              </Text>
            </View>
            <View style={styles.statsCol}>
              <View style={styles.statItem}>
                <Ionicons
                  name="eye-outline"
                  size={s(12)}
                  color={lightColors.textHint}
                />
                <Text style={styles.statValue}>
                  {user.reelViewsCount.toLocaleString("en")}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  name="heart-outline"
                  size={s(12)}
                  color={lightColors.textHint}
                />
                <Text style={styles.statValue}>
                  {user.reelLikesCount.toLocaleString("en")}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : !isLoading ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="people-outline"
            size={s(32)}
            color={lightColors.textInactive}
          />
          <Text style={styles.emptyText}>No engagement data yet</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: lightColors.textTitle,
    marginBottom: vs(14),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(10),
    gap: s(10),
  },
  userRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lightColors.separator,
  },
  rankBadge: {
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(10),
    color: lightColors.textSubtitle,
  },
  avatar: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
  },
  avatarPlaceholder: {
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textTitle,
  },
  userMeta: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textHint,
    marginTop: vs(1),
  },
  statsCol: {
    alignItems: "flex-end",
    gap: vs(4),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(3),
  },
  statValue: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(11),
    color: lightColors.textSubtitle,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: vs(24),
  },
  emptyText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(13),
    color: lightColors.textHint,
    marginTop: vs(8),
  },
});
