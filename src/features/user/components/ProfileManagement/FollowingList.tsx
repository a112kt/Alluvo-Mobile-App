import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useTranslation } from "react-i18next";
import {
  useFollowedBrands,
  useToggleFollowBrand,
  FollowedBrand,
} from "../../hooks/useBrands";

interface FollowingListProps {
  visible: boolean;
  onClose: () => void;
}

const FollowingList = ({ visible, onClose }: FollowingListProps) => {
  const { t } = useTranslation();
  const { data: brands, isLoading } = useFollowedBrands();
  const toggleFollow = useToggleFollowBrand();
  const [unfollowingId, setUnfollowingId] = useState<number | null>(null);

  const handleUnfollow = (brandId: number) => {
    setUnfollowingId(brandId);
    toggleFollow.mutate(brandId, {
      onSettled: () => setUnfollowingId(null),
    });
  };

  const renderBrand = ({ item }: { item: FollowedBrand }) => {
    const isPending = unfollowingId === item.brandId;

    return (
      <View style={styles.brandRow}>
        <Image
          source={{ uri: item.brandLogoUrl }}
          style={[styles.brandLogo, { backgroundColor: lightColors.bgLight }]}
          resizeMode="cover"
        />

        <View style={styles.brandInfo}>
          <Text style={[styles.brandName, { color: lightColors.primary }]} numberOfLines={1}>
            {item.brandDisplayName}
          </Text>
          <Text style={[styles.followerCount, { color: lightColors.subtitle }]}>
            {item.totalFollowers}{" "}
            {item.totalFollowers === 1 ? t("follower") : t("followers")}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleUnfollow(item.brandId)}
          disabled={isPending}
          style={[styles.unfollowBtn, { backgroundColor: lightColors.primary }]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={lightColors.white} />
          ) : (
            <Text style={[styles.unfollowText, { color: lightColors.white }]}>{t("following")}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={[styles.card, { backgroundColor: lightColors.white }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: lightColors.primary }]}>{t("following")}</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: lightColors.bgLight }]}>
              <Text style={[styles.closeText, { color: lightColors.subtitle }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={lightColors.primary} />
            </View>
          ) : !brands || brands.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: lightColors.subtitle }]}>{t("noFollowingYet") || "Not following any brands yet"}</Text>
            </View>
          ) : (
            <FlatList
              data={brands}
              keyExtractor={(item) => String(item.brandId)}
              renderItem={renderBrand}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default FollowingList;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  card: {
    width: "100%",
    maxHeight: "70%",
    borderRadius: scale(16),
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: scale(18),
    fontFamily: "Poppins-SemiBold",
  },
  closeBtn: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: scale(13),
    fontFamily: "Poppins-Medium",
  },
  listContent: {
    paddingVertical: verticalScale(4),
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  brandLogo: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
  },
  brandInfo: {
    flex: 1,
    marginHorizontal: scale(12),
  },
  brandName: {
    fontSize: scale(14),
    fontFamily: "Poppins-Medium",
  },
  followerCount: {
    fontSize: scale(11),
    fontFamily: "Poppins-Regular",
    marginTop: verticalScale(1),
  },
  unfollowBtn: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20),
    minWidth: scale(72),
    alignItems: "center",
    justifyContent: "center",
  },
  unfollowText: {
    fontSize: scale(12),
    fontFamily: "Poppins-Medium",
  },
  loadingBox: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyBox: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyText: {
    fontSize: scale(14),
    fontFamily: "Poppins-Regular",
  },
});
