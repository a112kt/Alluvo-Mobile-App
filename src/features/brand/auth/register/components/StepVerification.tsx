import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { Formik } from "formik";
import { verificationSchema } from "../schemas";
import * as ImagePicker from "expo-image-picker";
import AuthInput from "../../../../../Components/inputs/AuthInput";
import PhoneInput, { Country } from "../../../../../Components/inputs/PhoneInput";
import { Ionicons } from "@expo/vector-icons";
import { useBrandVerifyIdentity } from "../hooks/useBrandRegister";

interface StepVerificationProps {
  token: string;
  onSuccess: () => void;
}

type UploadField = "frontId" | "backId" | "selfie";

const UPLOAD_LABELS: Record<UploadField, string> = {
  frontId: "Front of National ID",
  backId: "Back of National ID",
  selfie: "Selfie with ID",
};

export default function StepVerification({ token, onSuccess }: StepVerificationProps) {
  const { mutate, isPending, error, isSuccess } = useBrandVerifyIdentity();

  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Egypt",
    code: "+20",
    flag: "🇪🇬",
  });

  const [uploads, setUploads] = useState<Record<UploadField, string | null>>({
    frontId: null,
    backId: null,
    selfie: null,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const pickImage = async (
    field: UploadField,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Camera roll permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setUploads((prev) => ({ ...prev, [field]: uri }));
      setFieldValue(field, uri);
    }
  };

  const removeImage = (
    field: UploadField,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    setUploads((prev) => ({ ...prev, [field]: null }));
    setFieldValue(field, "");
  };

  const initialValues = {
    fullName: "",
    nationalId: "",
    taxNumber: "",
    phone: "",
    countryCode: "+20",
    frontId: "",
    backId: "",
    selfie: "",
  };

  const allImagesUploaded = (values: typeof initialValues) =>
    values.frontId && values.backId && values.selfie;

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Text style={styles.sectionTitle}>Identity Verification</Text>
      <Text style={styles.subtitle}>
        Please provide your ID details and upload the required images to verify your identity.
      </Text>

      <Formik
        initialValues={initialValues}
        validationSchema={verificationSchema}
        validateOnMount={true}
        onSubmit={(values) => {
          const form = new FormData();
          form.append("FullName", values.fullName);
          form.append("NationalId", values.nationalId);
          form.append("TaxNumber", values.taxNumber);
          form.append("PhoneNumber", `${values.countryCode}${values.phone}`);
          if (values.frontId) {
            form.append("IdFrontImage", {
              uri: values.frontId,
              name: "front_id.jpg",
              type: "image/jpeg",
            } as any);
          }
          if (values.backId) {
            form.append("IdBackImage", {
              uri: values.backId,
              name: "back_id.jpg",
              type: "image/jpeg",
            } as any);
          }
          if (values.selfie) {
            form.append("SelfieImage", {
              uri: values.selfie,
              name: "selfie.jpg",
              type: "image/jpeg",
            } as any);
          }
          mutate(form);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          dirty,
        }) => {
          const formFieldsValid = isValid && dirty;
          const imagesComplete = allImagesUploaded(values);
          const canSubmit = formFieldsValid && imagesComplete;
          const disabled = !canSubmit || isPending;

          return (
            <>
              <AuthInput
                label="Full Name"
                placeholder="Enter your full name as on ID"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={errors.fullName}
                touched={touched.fullName}
              />

              <AuthInput
                label="National ID"
                placeholder="Enter 14-digit national ID"
                value={values.nationalId}
                onChangeText={(t) => {
                  const digits = t.replace(/\D/g, "").slice(0, 14);
                  setFieldValue("nationalId", digits);
                }}
                onBlur={handleBlur("nationalId")}
                keyboardType="numeric"
                error={errors.nationalId}
                touched={touched.nationalId}
              />

              <AuthInput
                label="Tax Number (optional)"
                placeholder="Enter tax number"
                value={values.taxNumber}
                onChangeText={handleChange("taxNumber")}
                onBlur={handleBlur("taxNumber")}
                error={errors.taxNumber}
                touched={touched.taxNumber}
              />

              <PhoneInput
                label="Phone Number"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                error={errors.phone}
                touched={touched.phone}
                selectedCountry={selectedCountry}
                maxLength={11}
                onCountryChange={(c) => {
                  setSelectedCountry(c);
                  setFieldValue("countryCode", c.code);
                }}
              />

              <Text style={styles.uploadSectionTitle}>Upload Documents</Text>

              {(Object.keys(UPLOAD_LABELS) as UploadField[]).map((field) => (
                <View key={field} style={styles.uploadRow}>
                  <Text style={styles.fieldLabel}>{UPLOAD_LABELS[field]}</Text>
                  <View style={styles.uploadActions}>
                    {uploads[field] ? (
                      <View style={styles.uploadedPreview}>
                        <Image
                          source={{ uri: uploads[field]! }}
                          style={styles.uploadThumb}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => removeImage(field, setFieldValue)}
                          style={styles.uploadRemove}
                        >
                          <Text style={styles.uploadRemoveText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => pickImage(field, setFieldValue)}
                        style={styles.uploadPlaceholder}
                      >
                        <Ionicons name="camera-outline" size={24} color={lightColors.primary} />
                        <Text style={styles.uploadHint}>Tap to upload</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}

              <Pressable
                onPress={() => {
                  if (!disabled) handleSubmit();
                }}
                disabled={disabled}
                style={({ pressed }) => [
                  styles.submitBtnWrapper,
                  pressed && !disabled && { opacity: 0.92 },
                ]}
              >
                <View
                  style={[
                    styles.submitBtn,
                    disabled && { backgroundColor: "#A0A5B0" },
                  ]}
                >
                  {isPending ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.submitBtnText}>  Submitting...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitBtnText}>Submit Verification</Text>
                  )}
                </View>
              </Pressable>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorMsg}>
                    {(error as any)?.message || "Verification failed"}
                  </Text>
                </View>
              )}
            </>
          );
        }}
      </Formik>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: s(18),
    fontWeight: "700",
    fontFamily: "Inter",
    color: lightColors.primary,
    marginBottom: vs(4),
    marginTop: vs(4),
  },
  subtitle: {
    fontSize: s(13),
    fontFamily: "Inter",
    color: "#6B7280",
    marginBottom: vs(16),
  },
  fieldLabel: {
    fontSize: s(14),
    fontWeight: "600",
    marginBottom: s(6),
    fontFamily: "Inter",
    color: lightColors.primary,
  },
  uploadSectionTitle: {
    fontSize: s(16),
    fontWeight: "700",
    fontFamily: "Inter",
    color: lightColors.primary,
    marginTop: vs(12),
    marginBottom: vs(8),
  },
  uploadRow: {
    marginBottom: s(16),
  },
  uploadActions: {
    borderRadius: s(12),
    overflow: "hidden",
  },
  uploadPlaceholder: {
    height: vs(80),
    borderRadius: s(12),
    borderWidth: 1.5,
    borderColor: lightColors.inputBorder || "#E4E8EE",
    borderStyle: "dashed",
    backgroundColor: lightColors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  uploadHint: {
    fontSize: s(13),
    color: "#6B7280",
    fontFamily: "Inter",
    fontWeight: "500",
  },
  uploadedPreview: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: s(12),
    overflow: "hidden",
    backgroundColor: lightColors.inputBackground,
    borderWidth: 1,
    borderColor: lightColors.inputBorder || "#E4E8EE",
  },
  uploadThumb: {
    width: s(60),
    height: s(60),
    borderRadius: s(8),
  },
  uploadRemove: {
    flex: 1,
    alignItems: "center",
    paddingVertical: s(8),
  },
  uploadRemoveText: {
    color: "#DC2626",
    fontSize: s(13),
    fontFamily: "Inter",
    fontWeight: "600",
  },
  submitBtnWrapper: {
    marginTop: vs(24),
    borderRadius: s(16),
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtn: {
    height: vs(56),
    borderRadius: s(16),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: lightColors.primary,
  },
  submitBtnText: {
    color: "#fff",
    fontFamily: "Inter",
    fontSize: s(17),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: s(12),
    paddingVertical: s(10),
    paddingHorizontal: s(14),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorMsg: {
    color: "#DC2626",
    fontSize: s(13),
    fontFamily: "Inter",
    fontWeight: "500",
  },
});
