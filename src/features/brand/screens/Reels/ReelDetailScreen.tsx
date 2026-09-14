import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useGetBrandReelById, useDeleteReel } from "../../hooks/useReelManagement";
import { absoluteUrl } from "../../../../config/env";
import FilterOverlay from "../../components/ReelManagement/FilterOverlay";
import { ReelDetailSkeleton, FadeInView } from "../../components/SkeletonLoader";
import ErrorState from "../../components/ErrorState";

export default function ReelDetailScreen({ navigation, route }: any) {
  const { reelId } = route.params;
  const { data, isLoading, isError } = useGetBrandReelById(reelId);
  const { mutateAsync: deleteReel, isPending: isDeleting } = useDeleteReel();

  const reel = data?.data;

  const player = useVideoPlayer(
    reel?.videoUrl ? absoluteUrl(reel.videoUrl) : null,
    (p) => {
      p.loop = true;
    }
  );

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Reel",
      "Are you sure you want to delete this reel? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReel(reelId);
              navigation.goBack();
            } catch {
              Alert.alert("Error", "Failed to delete reel.");
            }
          },
        },
      ]
    );
  }, [reelId, deleteReel, navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
          </Pressable>
          <Text style={styles.headerTitle}>Reel</Text>
          <View style={styles.backBtn} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ReelDetailSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !reel) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
          </Pressable>
          <Text style={styles.headerTitle}>Reel</Text>
          <View style={styles.backBtn} />
        </View>
        <ErrorState message="Failed to load reel." onRetry={() => navigation.replace("ReelDetail", { reelId })} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {reel.title || "Reel"}
        </Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.navigate("EditReel", { reelId })}
          >
            <Ionicons name="create-outline" size={s(20)} color={lightColors.textTitle} />
          </Pressable>
        </View>
      </View>

      <FadeInView delay={50} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.videoContainer}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls={true}
            />
            {reel.filterId && (
              <FilterOverlay
                activeFilterId={reel.filterId}
                visible={true}
                readOnly={true}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.reelTitle}>{reel.title || "Untitled"}</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  reel.status === "published" ? styles.statusPublished : styles.statusDraft,
                ]}
              >
                <Text style={styles.statusText}>
                  {reel.status === "published" ? "Published" : "Draft"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={s(20)} color={lightColors.textDanger} />
              <Text style={styles.statValue}>{reel.likesCount ?? 0}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={s(20)} color={lightColors.secondary} />
              <Text style={styles.statValue}>{reel.commentsCount ?? 0}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statItem}>
              <Ionicons name="pricetag-outline" size={s(20)} color={lightColors.textSuccess} />
              <Text style={styles.statValue}>{reel.productsCount ?? 0}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
          </View>

          {reel.products && reel.products.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Linked Products</Text>
              {reel.products.map((product, index) => (
                <View key={`reelprod-${product.id}-${index}`} style={styles.productRow}>
                  <View style={styles.productIcon}>
                    <Ionicons name="cube-outline" size={s(18)} color={lightColors.textInactive} />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.productPrice}>EGP {product.price.toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={lightColors.textDanger} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={s(18)} color={lightColors.textDanger} />
                <Text style={styles.deleteBtnText}>Delete Reel</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </FadeInView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
  },
  backBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(17),
    color: lightColors.textTitle,
    textAlign: "center",
    marginHorizontal: s(8),
  },
  headerActions: {
    flexDirection: "row",
    gap: s(8),
  },
  scrollContent: {
    paddingBottom: vs(40),
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 9 / 16,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
  section: {
    padding: s(20),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.separator,
  },
  reelTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    marginBottom: vs(8),
  },
  statusRow: {
    flexDirection: "row",
  },
  statusBadge: {
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: s(8),
  },
  statusPublished: {
    backgroundColor: lightColors.bgSuccess,
  },
  statusDraft: {
    backgroundColor: lightColors.bgWarning,
  },
  statusText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(11),
    color: lightColors.textTitle,
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: vs(16),
    paddingHorizontal: s(20),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.separator,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: lightColors.textTitle,
    marginTop: vs(4),
  },
  statLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
  },
  statDiv: {
    width: 1,
    height: vs(30),
    backgroundColor: lightColors.separator,
    alignSelf: "center",
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(15),
    color: lightColors.textTitle,
    marginBottom: vs(10),
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(8),
    backgroundColor: lightColors.bgLight,
    borderRadius: s(10),
    paddingHorizontal: s(12),
    marginBottom: vs(6),
  },
  productIcon: {
    width: s(34),
    height: s(34),
    borderRadius: s(8),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(10),
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textTitle,
  },
  productPrice: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(8),
    marginHorizontal: s(20),
    marginTop: vs(24),
    paddingVertical: vs(14),
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: lightColors.textDanger,
  },
  deleteBtnDisabled: {
    opacity: 0.5,
  },
  deleteBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textDanger,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
    color: lightColors.textSubtitle,
    marginTop: vs(12),
  },
});
