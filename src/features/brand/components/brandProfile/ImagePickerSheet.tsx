import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import * as ImagePicker from "expo-image-picker";

interface Props {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string, fileName: string, mimeType: string) => void;
}

export default function ImagePickerSheet({
  visible,
  onClose,
  onImageSelected,
}: Props) {
  const pickFromGallery = async () => {
    onClose();
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission required",
        "Gallery access is needed to select a photo"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      onImageSelected(
        asset.uri,
        (asset as any).fileName || "image.jpg",
        (asset as any).mimeType || "image/jpeg"
      );
    }
  };

  const pickFromCamera = async () => {
    onClose();
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission required",
        "Camera access is needed to take a photo"
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      onImageSelected(
        asset.uri,
        (asset as any).fileName || "photo.jpg",
        (asset as any).mimeType || "image/jpeg"
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.sheetTitle}>Select Image</Text>
          <Pressable style={styles.option} onPress={pickFromCamera}>
            <Ionicons name="camera-outline" size={s(22)} color={lightColors.primary} />
            <Text style={styles.optionText}>Take Photo</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={pickFromGallery}>
            <Ionicons name="images-outline" size={s(22)} color={lightColors.primary} />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: lightColors.white,
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
    padding: s(20),
    paddingBottom: vs(32),
  },
  sheetTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: lightColors.textTitle,
    textAlign: "center",
    marginBottom: vs(16),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(12),
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.separator,
  },
  optionText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(14),
    color: lightColors.textTitle,
  },
  cancelBtn: {
    marginTop: vs(12),
    paddingVertical: vs(12),
    alignItems: "center",
  },
  cancelText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textDanger,
  },
});
