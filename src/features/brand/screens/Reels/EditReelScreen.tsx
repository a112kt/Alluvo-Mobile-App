import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import {
  useGetBrandReelById,
  useEditReel,
} from "../../hooks/useReelManagement";
import ProductSelector from "../../components/ReelManagement/ProductSelector";
import { absoluteUrl } from "../../../../config/env";
import { EditReelSkeleton, FadeInView } from "../../components/SkeletonLoader";
import ErrorState from "../../components/ErrorState";

export default function EditReelScreen({ navigation, route }: any) {
  const { reelId } = route.params ?? {};
  const { data, isLoading, isError } = useGetBrandReelById(reelId);
  const { mutateAsync: editReel, isPending: isSaving } = useEditReel();

  const reel = data?.data;

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const player = useVideoPlayer(
    reel?.videoUrl ? absoluteUrl(reel.videoUrl) : null,
    (p) => {
      p.loop = true;
    }
  );

  useEffect(() => {
    if (reel) {
      setTitle(reel.title || "");
      setStatus(reel.status);
      setSelectedProducts(
        reel.products?.map((p) => p.id) ?? []
      );
    }
  }, [reel]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a reel title.");
      return;
    }

    try {
      await editReel({
        ReelId: reel?.id ?? reelId,
        Title: title.trim(),
        Status: status,
        ProductIds: selectedProducts,
        ClearProducts: selectedProducts.length === 0,
      });
      Alert.alert("Success", "Reel updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to update reel. Please try again.");
    }
  };

  const handleClearProducts = () => {
    setSelectedProducts([]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Reel</Text>
          <View style={styles.backBtn} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <EditReelSkeleton />
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
          <Text style={styles.headerTitle}>Edit Reel</Text>
          <View style={styles.backBtn} />
        </View>
        <ErrorState message="Failed to load reel." onRetry={() => navigation.replace("EditReel", { reelId })} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Reel</Text>
        <View style={styles.backBtn} />
      </View>

      <FadeInView delay={50} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.videoContainer}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls={true}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reel title"
              placeholderTextColor={lightColors.textHint}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Published</Text>
              <Switch
                value={status === "published"}
                onValueChange={(v) => setStatus(v ? "published" : "draft")}
                trackColor={{ false: lightColors.bgHeavy, true: lightColors.secondary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Linked Products</Text>
            <ProductSelector
              selectedIds={selectedProducts}
              onSelectionChange={setSelectedProducts}
            />
          </View>

          <View style={styles.formSection}>
            <Pressable
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={s(18)} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </Pressable>
          </View>
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
  },
  headerTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(17),
    color: lightColors.textTitle,
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
  formSection: {
    padding: s(20),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.separator,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textTitle,
    marginBottom: vs(6),
  },
  input: {
    backgroundColor: lightColors.white,
    borderRadius: s(12),
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    fontFamily: "Inter",
    fontSize: s(14),
    color: lightColors.textTitle,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionRow: {
    flexDirection: "row",
    gap: s(10),
    paddingHorizontal: s(20),
    paddingTop: vs(20),
  },
  clearBtn: {
    flex: 1,
    paddingVertical: vs(14),
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: lightColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textSubtitle,
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(6),
    backgroundColor: lightColors.secondary,
    paddingVertical: vs(14),
    borderRadius: s(14),
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: "#fff",
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
  },
});
