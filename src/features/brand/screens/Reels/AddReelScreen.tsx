import React, { useState, useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useAddReel } from "../../hooks/useReelManagement";
import VideoPicker from "../../components/ReelManagement/VideoPicker";
import ProductSelector from "../../components/ReelManagement/ProductSelector";
import type { ReelRecordingResult } from "../../types/reelManagement";

function FadeInView({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

export default function AddReelScreen({ navigation, route }: any) {
  const recordingResult: ReelRecordingResult | undefined = route?.params?.recordingResult;
  const { mutateAsync: addReel, isPending } = useAddReel();

  const [videoUri, setVideoUri] = useState<string | null>(
    recordingResult?.videoUri ?? null
  );
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError("Please enter a reel title.");
      return;
    }
    if (!videoUri) {
      Alert.alert("Missing Video", "Please select or record a video first.");
      return;
    }
    setTitleError(null);

    try {
      await addReel({
        title: title.trim(),
        video: { uri: videoUri, name: "reel.mp4", type: "video/mp4" },
        products: selectedProducts,
        status,
        filterId: recordingResult?.filterId,
        musicTrackId: recordingResult?.musicTrack?.id,
        musicTrackName: recordingResult?.musicTrack?.name,
        musicTrackArtist: recordingResult?.musicTrack?.artistName,
      });
      Alert.alert("Success", "Reel uploaded successfully!", [
        { text: "OK", onPress: () => navigation.navigate("BrandTabs") },
      ]);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 413) {
        Alert.alert(
          "File Too Large",
          "Your video exceeds the maximum allowed size. Please use a smaller file and try again."
        );
      } else {
        Alert.alert("Error", err?.friendlyMessage || "Failed to upload reel. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color={lightColors.textTitle} />
        </Pressable>
        <Text style={styles.headerTitle}>New Reel</Text>
        <View style={styles.backBtn} />
      </View>

      <FadeInView delay={50} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VideoPicker
            videoUri={videoUri}
            onVideoPicked={(uri) => setVideoUri(uri)}
            onVideoRemoved={() => setVideoUri(null)}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={[styles.input, titleError && styles.inputError]}
              placeholder="Enter reel title"
              placeholderTextColor={lightColors.textHint}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) setTitleError(null);
              }}
            />
            {titleError && (
              <Text style={styles.errorText}>{titleError}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
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

          <ProductSelector
            selectedIds={selectedProducts}
            onSelectionChange={setSelectedProducts}
          />

          {recordingResult?.filterId && (
            <View style={styles.recordingInfo}>
              <Ionicons name="color-palette-outline" size={s(16)} color={lightColors.secondary} />
              <Text style={styles.recordingInfoText}>
                Filter: {recordingResult.filterId}
              </Text>
            </View>
          )}
          {recordingResult?.musicTrack && (
            <View style={styles.recordingInfo}>
              <Ionicons name="musical-note-outline" size={s(16)} color={lightColors.secondary} />
              <Text style={styles.recordingInfoText}>
                Music: {recordingResult.musicTrack.name} — {recordingResult.musicTrack.artistName}
              </Text>
            </View>
          )}

          <Pressable
            style={[styles.submitBtn, isPending && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Upload Reel</Text>
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
    backgroundColor: lightColors.bgMain,
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
    padding: s(20),
    paddingBottom: vs(40),
  },
  fieldGroup: {
    marginBottom: vs(16),
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
  inputError: {
    borderColor: lightColors.textDanger,
  },
  errorText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textDanger,
    marginTop: vs(4),
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: lightColors.white,
    borderRadius: s(12),
    padding: s(14),
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  recordingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    marginBottom: vs(6),
  },
  recordingInfoText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(12),
    color: lightColors.textSubtitle,
  },
  submitBtn: {
    backgroundColor: lightColors.primary,
    paddingVertical: vs(16),
    borderRadius: s(14),
    alignItems: "center",
    justifyContent: "center",
    marginTop: vs(16),
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: "#fff",
  },
});
