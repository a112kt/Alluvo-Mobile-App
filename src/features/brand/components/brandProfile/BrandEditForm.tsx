import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import type {
  BrandDetailsResponse,
  UpdateBrandDetailsReq,
  SocialLinkReqDto,
} from "../../types/brandProfile";
import ImagePickerSheet from "./ImagePickerSheet";

interface Props {
  brand: BrandDetailsResponse;
  onSubmit: (data: UpdateBrandDetailsReq) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  onLogoUpload: (uri: string, fileName: string, mimeType: string) => void;
  onCoverUpload: (uri: string, fileName: string, mimeType: string) => void;
  isLogoUploading?: boolean;
  isCoverUploading?: boolean;
}

export default function BrandEditForm({
  brand,
  onSubmit,
  onCancel,
  isSubmitting,
  onLogoUpload,
  onCoverUpload,
  isLogoUploading,
  isCoverUploading,
}: Props) {
  const [form, setForm] = useState<UpdateBrandDetailsReq>({
    displayName: brand.displayName,
    description: brand.description,
    returnPolicyAsHtml: brand.returnPolicyAsHtml,
    category: brand.category,
    country: brand.country,
    governorate: brand.governorate,
    district: brand.district,
    numberOfEmployees: brand.numberOfEmployees,
    payoutPhoneNumber: brand.payoutPhoneNumber || "",
    bankAccountNumber: brand.bankAccountNumber || "",
    socialLinks: brand.socialLinks.map((sl) => ({
      id: sl.id,
      platform: sl.platform,
      url: sl.url,
    })),
  });

  const [pickerTarget, setPickerTarget] = useState<"logo" | "cover" | null>(
    null
  );

  const updateField = <K extends keyof UpdateBrandDetailsReq>(
    key: K,
    value: UpdateBrandDetailsReq[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLinkReqDto,
    value: string
  ) => {
    setForm((prev) => {
      const links = [...prev.socialLinks];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, socialLinks: links };
    });
  };

  const removeSocialLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleImageSelected = (
    uri: string,
    fileName: string,
    mimeType: string
  ) => {
    if (pickerTarget === "logo") {
      onLogoUpload(uri, fileName, mimeType);
    } else if (pickerTarget === "cover") {
      onCoverUpload(uri, fileName, mimeType);
    }
    setPickerTarget(null);
  };

  const handleSubmit = async () => {
    await onSubmit(form);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.formTitle}>Edit Brand Information</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Brand Name</Text>
        <TextInput
          style={styles.input}
          value={form.displayName}
          onChangeText={(v) => updateField("displayName", v)}
          placeholder="Brand Name"
          placeholderTextColor={lightColors.inputPlaceholder}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={form.category}
          onChangeText={(v) => updateField("category", v)}
          placeholder="Category"
          placeholderTextColor={lightColors.inputPlaceholder}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={form.description}
          onChangeText={(v) => updateField("description", v)}
          placeholder="Description"
          placeholderTextColor={lightColors.inputPlaceholder}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.imageRow}>
        <View style={styles.imageCol}>
          <Text style={styles.label}>Brand Logo</Text>
          <View style={styles.imagePreviewRow}>
            {brand.logoUrl ? (
              <Image
                source={{ uri: brand.logoUrl }}
                style={styles.imagePreview}
              />
            ) : (
              <View style={[styles.imagePreview, styles.imagePlaceholder]}>
                <Ionicons
                  name="image-outline"
                  size={s(20)}
                  color={lightColors.textInactive}
                />
              </View>
            )}
            <Pressable
              style={styles.changeBtn}
              onPress={() => setPickerTarget("logo")}
              disabled={isLogoUploading}
            >
              {isLogoUploading ? (
                <ActivityIndicator size="small" color={lightColors.primary} />
              ) : (
                <Text style={styles.changeBtnText}>Change</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.imageCol}>
          <Text style={styles.label}>Cover Image</Text>
          <View style={styles.imagePreviewRow}>
            {brand.coverImageUrl ? (
              <Image
                source={{ uri: brand.coverImageUrl }}
                style={styles.coverPreview}
              />
            ) : (
              <View style={[styles.coverPreview, styles.imagePlaceholder]}>
                <Ionicons
                  name="image-outline"
                  size={s(20)}
                  color={lightColors.textInactive}
                />
              </View>
            )}
            <Pressable
              style={styles.changeBtn}
              onPress={() => setPickerTarget("cover")}
              disabled={isCoverUploading}
            >
              {isCoverUploading ? (
                <ActivityIndicator size="small" color={lightColors.primary} />
              ) : (
                <Text style={styles.changeBtnText}>Change</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={form.country}
          onChangeText={(v) => updateField("country", v)}
          placeholder="Country"
          placeholderTextColor={lightColors.inputPlaceholder}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Governorate</Text>
        <TextInput
          style={styles.input}
          value={form.governorate}
          onChangeText={(v) => updateField("governorate", v)}
          placeholder="Governorate"
          placeholderTextColor={lightColors.inputPlaceholder}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>District</Text>
        <TextInput
          style={styles.input}
          value={form.district}
          onChangeText={(v) => updateField("district", v)}
          placeholder="District"
          placeholderTextColor={lightColors.inputPlaceholder}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Number of Employees</Text>
        <TextInput
          style={styles.input}
          value={String(form.numberOfEmployees)}
          onChangeText={(v) =>
            updateField("numberOfEmployees", Number(v) || 0)
          }
          placeholder="0"
          placeholderTextColor={lightColors.inputPlaceholder}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Payout Phone</Text>
        <TextInput
          style={styles.input}
          value={form.payoutPhoneNumber}
          onChangeText={(v) => updateField("payoutPhoneNumber", v)}
          placeholder="Payout phone number"
          placeholderTextColor={lightColors.inputPlaceholder}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Bank Account</Text>
        <TextInput
          style={styles.input}
          value={form.bankAccountNumber}
          onChangeText={(v) => updateField("bankAccountNumber", v)}
          placeholder="Bank account number"
          placeholderTextColor={lightColors.inputPlaceholder}
        />
      </View>

      <View style={styles.socialHeader}>
        <Text style={styles.label}>Social Links</Text>
        <Pressable style={styles.addLinkBtn} onPress={addSocialLink}>
          <Ionicons name="add-circle-outline" size={s(16)} color={lightColors.primary} />
          <Text style={styles.addLinkText}>Add</Text>
        </Pressable>
      </View>
      {form.socialLinks.map((link, index) => (
        <View key={index} style={styles.socialLinkRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={link.platform}
            onChangeText={(v) => updateSocialLink(index, "platform", v)}
            placeholder="Platform"
            placeholderTextColor={lightColors.inputPlaceholder}
          />
          <TextInput
            style={[styles.input, { flex: 2 }]}
            value={link.url}
            onChangeText={(v) => updateSocialLink(index, "url", v)}
            placeholder="URL"
            placeholderTextColor={lightColors.inputPlaceholder}
            keyboardType="url"
          />
          <Pressable
            style={styles.removeLinkBtn}
            onPress={() => removeSocialLink(index)}
          >
            <Ionicons
              name="trash-outline"
              size={s(16)}
              color={lightColors.textDanger}
            />
          </Pressable>
        </View>
      ))}

      <View style={styles.btnRow}>
        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={lightColors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>
      </View>

      {pickerTarget && (
        <ImagePickerSheet
          visible={!!pickerTarget}
          onClose={() => setPickerTarget(null)}
          onImageSelected={handleImageSelected}
        />
      )}
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
  formTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: lightColors.textTitle,
    marginBottom: vs(16),
  },
  fieldGroup: {
    marginBottom: vs(14),
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: lightColors.textSubtitle,
    marginBottom: vs(6),
  },
  input: {
    fontFamily: "Inter",
    fontSize: s(13),
    color: lightColors.textTitle,
    backgroundColor: lightColors.inputBackground,
    borderWidth: 1,
    borderColor: lightColors.inputBorder,
    borderRadius: s(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  multiline: {
    minHeight: vs(80),
  },
  imageRow: {
    flexDirection: "row",
    gap: s(14),
    marginBottom: vs(14),
  },
  imageCol: {
    flex: 1,
  },
  imagePreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
  },
  imagePreview: {
    width: s(52),
    height: s(52),
    borderRadius: s(26),
  },
  coverPreview: {
    width: s(72),
    height: s(42),
    borderRadius: s(8),
  },
  imagePlaceholder: {
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  changeBtn: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderWidth: 1,
    borderColor: lightColors.primary,
    borderRadius: s(8),
  },
  changeBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(11),
    color: lightColors.primary,
  },
  socialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(6),
  },
  addLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(3),
  },
  addLinkText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: lightColors.primary,
  },
  socialLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
    marginBottom: vs(8),
  },
  removeLinkBtn: {
    padding: s(6),
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: s(10),
    marginTop: vs(16),
  },
  cancelButton: {
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: s(10),
  },
  cancelButtonText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textSubtitle,
  },
  saveButton: {
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    backgroundColor: lightColors.primary,
    borderRadius: s(10),
    minWidth: s(100),
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.white,
  },
});
