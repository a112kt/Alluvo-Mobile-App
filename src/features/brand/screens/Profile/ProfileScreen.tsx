import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useBrandTabBarPadding } from "../../navigation/useBrandTabBarPadding";
import { useMyBrand } from "../../hooks/useBrandDashboard";
import {
  useGetBrandDetails,
  useUpdateBrandDetails,
  useGetTopEngagedUsers,
  useUploadBrandLogo,
  useUploadBrandCover,
} from "../../hooks/useBrandProfile";
import type { UpdateBrandDetailsReq } from "../../types/brandProfile";
import BrandInfoCard from "../../components/brandProfile/BrandInfoCard";
import BrandOwnerCard from "../../components/brandProfile/BrandOwnerCard";
import BrandStatsCard from "../../components/brandProfile/BrandStatsCard";
import BrandSocialLinks from "../../components/brandProfile/BrandSocialLinks";
import BrandPolicies from "../../components/brandProfile/BrandPolicies";
import TopEngagedUsersCard from "../../components/brandProfile/TopEngagedUsersCard";
import BrandEditForm from "../../components/brandProfile/BrandEditForm";
import { ProfileSkeleton, FadeInView } from "../../components/SkeletonLoader";
import ErrorState from "../../components/ErrorState";



export default function ProfileScreen() {
  const tabBarPadding = useBrandTabBarPadding();
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });

  const { data: myBrand, isLoading: myBrandLoading } = useMyBrand();
  const brandId = myBrand?.id;

  const {
    data: brand,
    isLoading: brandLoading,
    isError,
    refetch: refetchBrand,
  } = useGetBrandDetails(brandId);

  const {
    data: engagedUsers = [],
    isLoading: engagedLoading,
    refetch: refetchEngaged,
  } = useGetTopEngagedUsers(brandId);

  const { mutateAsync: updateBrand, isPending: isUpdating } =
    useUpdateBrandDetails();
  const { mutateAsync: uploadLogo, isPending: isLogoUploading } =
    useUploadBrandLogo();
  const { mutateAsync: uploadCover, isPending: isCoverUploading } =
    useUploadBrandCover();

  const loading = myBrandLoading || brandLoading;

  const showSnackbar = useCallback(
    (message: string, type: "success" | "error") => {
      setSnackbar({ visible: true, message, type });
      setTimeout(
        () => setSnackbar((prev) => ({ ...prev, visible: false })),
        3000
      );
    },
    []
  );

  const handleUpdate = async (data: UpdateBrandDetailsReq) => {
    try {
      await updateBrand({ brandId: brandId!, data });
      showSnackbar("Brand updated successfully", "success");
      setIsEditing(false);
    } catch {
      showSnackbar("Failed to update brand", "error");
    }
  };

  const handleLogoUpload = async (
    uri: string,
    fileName: string,
    mimeType: string
  ) => {
    try {
      await uploadLogo({ brandId: brandId!, fileUri: uri, fileName, mimeType });
      showSnackbar("Logo updated successfully", "success");
    } catch {
      showSnackbar("Failed to upload logo", "error");
    }
  };

  const handleCoverUpload = async (
    uri: string,
    fileName: string,
    mimeType: string
  ) => {
    try {
      await uploadCover({ brandId: brandId!, fileUri: uri, fileName, mimeType });
      showSnackbar("Cover updated successfully", "success");
    } catch {
      showSnackbar("Failed to upload cover", "error");
    }
  };

  const handleRefresh = () => {
    refetchBrand();
    refetchEngaged();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProfileSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !brand) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ErrorState message="Brand not found. Failed to load profile data." onRetry={handleRefresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarPadding },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={lightColors.primary}
          />
        }
      >
        <FadeInView delay={0}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingLabel}>My Profile</Text>
              <Text style={styles.brandName} numberOfLines={1}>
                {brand.displayName}
              </Text>
            </View>
            {!isEditing && (
              <Pressable
                style={styles.editBtn}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons
                  name="create-outline"
                  size={s(18)}
                  color={lightColors.primary}
                />
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            )}
          </View>
        </FadeInView>

        {isEditing ? (
          <FadeInView delay={100}>
            <BrandEditForm
              brand={brand}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isUpdating}
              onLogoUpload={handleLogoUpload}
              onCoverUpload={handleCoverUpload}
              isLogoUploading={isLogoUploading}
              isCoverUploading={isCoverUploading}
            />
          </FadeInView>
        ) : (
          <>
            <FadeInView delay={100}>
              <BrandInfoCard brand={brand} />
            </FadeInView>

            <FadeInView delay={180}>
              <BrandOwnerCard owner={brand.owner} />
            </FadeInView>

            <FadeInView delay={260}>
              <View style={styles.statsGrid}>
                <BrandStatsCard
                  icon="people-outline"
                  label="Followers"
                  value={brand.followersCount.toLocaleString("en")}
                  color={lightColors.primary}
                />
                <BrandStatsCard
                  icon="bag-outline"
                  label="Products"
                  value={brand.productsCount.toLocaleString("en")}
                  color={lightColors.textSuccess}
                />
                <BrandStatsCard
                  icon="videocam-outline"
                  label="Reels"
                  value={brand.reelsCount.toLocaleString("en")}
                  color={lightColors.secondary}
                />
              </View>
            </FadeInView>

            {brand.returnPolicyAsHtml ? (
              <FadeInView delay={340}>
                <BrandPolicies html={brand.returnPolicyAsHtml} />
              </FadeInView>
            ) : null}

            <FadeInView delay={400}>
              <BrandSocialLinks links={brand.socialLinks} />
            </FadeInView>

            <FadeInView delay={460}>
              <TopEngagedUsersCard
                users={engagedUsers}
                isLoading={engagedLoading}
              />
            </FadeInView>
          </>
        )}
      </ScrollView>

      {snackbar.visible && (
        <View
          style={[
            styles.snackbar,
            snackbar.type === "success"
              ? styles.snackbarSuccess
              : styles.snackbarError,
          ]}
        >
          <Ionicons
            name={
              snackbar.type === "success"
                ? "checkmark-circle-outline"
                : "alert-circle-outline"
            }
            size={s(18)}
            color={lightColors.white}
          />
          <Text style={styles.snackbarText}>{snackbar.message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingTop: vs(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: vs(16),
  },
  headerLeft: {
    flex: 1,
  },
  greetingLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textSubtitle,
  },
  brandName: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(20),
    color: lightColors.textTitle,
    marginTop: vs(2),
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(5),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    backgroundColor: lightColors.bgInfo,
    borderRadius: s(10),
  },
  editBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: lightColors.primary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: s(10),
    marginBottom: vs(4),
  },

  snackbar: {
    position: "absolute",
    bottom: vs(100),
    left: s(20),
    right: s(20),
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    borderRadius: s(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  snackbarSuccess: {
    backgroundColor: lightColors.textSuccess,
  },
  snackbarError: {
    backgroundColor: lightColors.textDanger,
  },
  snackbarText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(13),
    color: lightColors.white,
    flex: 1,
  },
  skeletonHeader: {
    marginBottom: vs(16),
  },
});
