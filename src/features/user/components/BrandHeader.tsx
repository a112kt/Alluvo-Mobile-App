import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SvgXml, SvgUri } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../../../Components/GradientText";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { backarrow, emptyStar, filledStar } from "../../../assests/icons/AllIcon";
import { scale, vs } from "react-native-size-matters";
import { toggleFollowBrand } from "../services/BrandProfile";
import { useTranslation } from "react-i18next";
import { useCreateNewChat } from "../hooks/useChat";
import { getBrandOwner, getRoomList } from "../services/chat";
import { UserStackParamList } from "../../../Navigation/types";
import { decrypt } from "../../../utils/chatHelpers";


const verifiedBadge = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#47C0D2"/>
  <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default function BrandHeader({ brandData, brandId }: { brandData?: any; brandId: number }) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const createNewChatMutation = useCreateNewChat();
  const [isMessaging, setIsMessaging] = useState(false);

  const getFollowStatus = (data: any) => {
    if (!data) return false;
    if (data.isFollowed !== undefined) return data.isFollowed;
    if (data.isFollow !== undefined) return data.isFollow;
    if (data.isFollowing !== undefined) return data.isFollowing;
    if (data.followed !== undefined) return data.followed;
    return false;
  };

  const getFollowersCount = (data: any) => {
    if (!data) return 0;
    return data.followersCount ?? data.totalFollowers ?? data.followers ?? data.followers_count ?? 0;
  };

  const [isFollowed, setIsFollowed] = useState(getFollowStatus(brandData));
  const [followersCount, setFollowersCount] = useState(getFollowersCount(brandData));

  useEffect(() => {
    if (brandData) {
      setIsFollowed(getFollowStatus(brandData));
      setFollowersCount(getFollowersCount(brandData));
    }
  }, [brandData]);

  const handleFollow = async () => {
    const targetBrandId = brandId || brandData?.brandId;
    if (!targetBrandId) return;
    const newStatus = !isFollowed;

    setIsFollowed(newStatus);
    setFollowersCount((prev: number) => newStatus ? prev + 1 : prev - 1);

    try {
      const res = await toggleFollowBrand(targetBrandId);
      if (res?.data) {
        setIsFollowed(res.data.isFollowed !== undefined ? res.data.isFollowed : (res.data.isFollow !== undefined ? res.data.isFollow : res.data.isFollowing));
        setFollowersCount(res.data.totalFollowers !== undefined ? res.data.totalFollowers : res.data.followersCount);
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      setIsFollowed(!newStatus);
      setFollowersCount((prev: number) => !newStatus ? prev + 1 : prev - 1);
    }
  };

  const rating = brandData?.rate || 0;
  const totalStars = 5;
  const isSvg = brandData?.logoUrl?.toLowerCase().endsWith(".svg");
  const resolvedLogoUrl = brandData?.logoUrl
    ? (brandData.logoUrl.startsWith("http") ? brandData.logoUrl : `${process.env.EXPO_PUBLIC_API_URL}/${brandData.logoUrl}`)
    : null;

  return (
    <View>
      <View style={styles.card}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <SvgXml xml={backarrow} width={scale(10)} height={scale(14)} />
        </Pressable>

        <View style={styles.profileRow}>
          <View style={styles.photoWrapper}>
            {isSvg ? (
              <SvgUri uri={resolvedLogoUrl!} width={scale(68)} height={scale(68)} />
            ) : (
              <Image
                source={resolvedLogoUrl ? { uri: resolvedLogoUrl } : require("../../../assests/imgs/Profile.png")}
                style={styles.brandPhoto}
              />
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{brandData?.totalReelLikes || "0"}</Text>
              <Text style={styles.statLabel}>{t("likes")}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followersCount}</Text>
              <Text style={styles.statLabel}>{t("followers")}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{brandData?.followingCount || "0"}</Text>
              <Text style={styles.statLabel}>{t("following")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.nameRow}>
          <GradientText text={brandData?.displayName || "Brand"} textStyle={styles.brandName} />
          <SvgXml xml={verifiedBadge} width={scale(18)} height={scale(18)} style={styles.verifiedIcon} />
        </View>

        <View style={styles.ratingRow}>
          {[...Array(totalStars)].map((_, index) => (
            <SvgXml
              key={index}
              xml={index < rating ? filledStar : emptyStar}
              width={14}
              height={14}
              style={{ marginHorizontal: 2 }}
            />
          ))}
          <Text style={styles.ratingText}>{rating > 0 ? rating.toFixed(1) : "0.0"}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.followBtn}
          activeOpacity={0.85}
          onPress={handleFollow}
        >
          {isFollowed ? (
            <View style={styles.unfollowBg}>
              <Text style={styles.unfollowText} numberOfLines={1}>
                {t("unfollow")}
              </Text>
            </View>
          ) : (
            <LinearGradient
              colors={["#1B2351", "#47C0D2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.followGradient}
            >
              <Text style={styles.followText} numberOfLines={1}>
                {t("follow")}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.messageBtn, isMessaging && styles.messageBtnDisabled]}
          disabled={isMessaging}
          onPress={async () => {
            const targetBrandId = brandId || brandData?.brandId;
            if (!targetBrandId) return;
            setIsMessaging(true);
            try {
              const ownerRes: any = await getBrandOwner(targetBrandId);
              const ownerData = ownerRes?.data;
              const ownerId = ownerData?.ownerId;
              if (!ownerId) {
                Alert.alert("Error", "Brand owner not found");
                return;
              }

              let ownerName: string =
                ownerData?.ownerName || ownerData?.name || ownerData?.displayName ||
                ownerData?.userName || ownerData?.fullName || brandData?.displayName || "Brand Owner";

              let ownerImage: string | undefined =
                ownerData?.ownerImage || ownerData?.imageUrl || ownerData?.profileImage ||
                ownerData?.avatarUrl || ownerData?.logoUrl || undefined;

              const response: any = await createNewChatMutation.mutateAsync(ownerId);

              const roomIdEncr: string | undefined =
                typeof response?.data === "string"
                  ? response.data
                  : response?.data?.roomIdEncr || response?.data?.roomIdEnc ||
                    response?.data?.roomId || response?.roomIdEncr ||
                    response?.roomIdEnc || response?.roomId;

              if (!roomIdEncr) {
                Alert.alert("Error", "Could not open chat room");
                return;
              }

              try {
                const roomsRes: any = await getRoomList();
                const rooms = roomsRes?.data || [];
                const targetRoomIdDec = decrypt(roomIdEncr);
                const matchedRoom = rooms.find((r: any) => {
                  const rDec = decrypt(r.roomIdEnc);
                  return rDec === targetRoomIdDec;
                });
                if (matchedRoom) {
                  if (matchedRoom.userName) ownerName = matchedRoom.userName;
                  if (matchedRoom.userImageUrl) ownerImage = matchedRoom.userImageUrl;
                }
              } catch (roomErr) {
                console.warn("Failed to fetch room list or match room details:", roomErr);
              }

              navigation.navigate("ChatMessages", {
                roomIdEncr, brandId: targetBrandId,
                brandName: ownerName, brandImage: ownerImage,
              });
            } catch (e: any) {
              const msg = e?.friendlyMessage || e?.message || "Something went wrong";
              Alert.alert("Error", msg);
            } finally {
              setIsMessaging(false);
            }
          }}
        >
          <Text style={styles.messageText}>{t("message")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: scale(16),
    marginTop: Platform.OS === 'android' ? vs(10) : vs(6),
    borderRadius: scale(20),
    paddingVertical: scale(20),
    paddingHorizontal: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  backBtn: {
    marginBottom: scale(8),
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  photoWrapper: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  brandPhoto: {
    width: scale(68),
    height: scale(68),
    borderRadius: scale(34),
  },
  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginLeft: scale(16),
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#1B2351",
  },
  statLabel: {
    fontSize: scale(12),
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: scale(2),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(14),
  },
  brandName: {
    fontWeight: "700",
    fontSize: scale(22),
    fontFamily: "Inter",
  },
  verifiedIcon: {
    marginLeft: scale(6),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(8),
  },
  ratingText: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: scale(6),
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    gap: scale(12),
    marginTop: scale(12),
    marginBottom: scale(20),
  },
  followBtn: {
    flex: 1,
    height: scale(44),
    borderRadius: scale(22),
    overflow: "hidden",
  },
  followGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  followText: {
    color: "#FFFFFF",
    fontSize: scale(14),
    fontWeight: "600",
    fontFamily: "Inter",
    textAlign: "center",
  },
  unfollowBg: {
    flex: 1,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(22),
  },
  unfollowText: {
    color: "#4B5563",
    fontSize: scale(14),
    fontWeight: "600",
    fontFamily: "Inter",
    textAlign: "center",
  },
  messageBtn: {
    flex: 1,
    height: scale(44),
    borderRadius: scale(22),
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  messageBtnDisabled: {
    opacity: 0.5,
  },
  messageText: {
    fontSize: scale(14),
    fontWeight: "600",
    fontFamily: "Inter",
    color: "#4B5563",
  },
});
