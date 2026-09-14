import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

interface VideoPickerProps {
  videoUri: string | null;
  onVideoPicked: (uri: string) => void;
  onVideoRemoved: () => void;
}

export default function VideoPicker({ videoUri, onVideoPicked, onVideoRemoved }: VideoPickerProps) {
  const [mode, setMode] = useState<"pick" | "record">("pick");

  const player = useVideoPlayer(videoUri ? { uri: videoUri } : null, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (videoUri && player) {
      player.play();
    }
  }, [videoUri, player]);

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Gallery permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      const file = new File(asset.uri);
      if (file.exists && file.size > MAX_FILE_SIZE) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        Alert.alert("Video Too Large", `Your video is ${sizeMB}MB. Maximum allowed size is 1GB.`);
        return;
      }
      onVideoPicked(asset.uri);
    }
  };

  if (videoUri) {
    return (
      <View style={styles.container}>
        <View style={styles.previewWrap}>
          <VideoView
            player={player}
            style={styles.videoPreview}
            contentFit="cover"
            nativeControls={false}
          />
          <Pressable style={styles.removeBtn} onPress={onVideoRemoved}>
            <Ionicons name="close-circle" size={s(28)} color={lightColors.textDanger} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.uploadBox} onPress={pickFromGallery}>
        <Ionicons name="cloud-upload-outline" size={s(40)} color={lightColors.textInactive} />
        <Text style={styles.uploadText}>Tap to select a video</Text>
        <Text style={styles.uploadHint}>MP4, MOV · Max 1GB</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: vs(16),
  },
  uploadBox: {
    width: "100%",
    height: vs(200),
    borderRadius: s(16),
    borderWidth: 2,
    borderColor: lightColors.border,
    borderStyle: "dashed",
    backgroundColor: lightColors.bgUpload,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textSubtitle,
    marginTop: vs(8),
  },
  uploadHint: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textHint,
    marginTop: vs(4),
  },
  previewWrap: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: s(16),
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
  },
  videoPreview: {
    flex: 1,
  },
  removeBtn: {
    position: "absolute",
    top: vs(8),
    right: s(8),
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: s(14),
  },
});
