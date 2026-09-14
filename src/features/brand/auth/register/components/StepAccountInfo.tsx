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
import { TextInput } from "react-native-paper";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { Formik } from "formik";
import { accountInfoSchema } from "../schemas";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AuthInput from "../../../../../Components/inputs/AuthInput";
import PhoneInput, { Country } from "../../../../../Components/inputs/PhoneInput";
import DateInput from "../../../../../Components/inputs/DateInput";
import { useBrandRegister } from "../hooks/useBrandRegister";

interface StepAccountInfoProps {
  onSuccess: (email: string) => void;
}

export default function StepAccountInfo({ onSuccess }: StepAccountInfoProps) {
  const { mutate, isPending, error, isSuccess, data } = useBrandRegister();
  const formRef = useRef<any>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Egypt",
    code: "+20",
    flag: "🇪🇬",
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
    if (!isSuccess) return;
    let parsed: any;
    try {
      parsed = JSON.parse(data as string);
    } catch {
      parsed = data;
    }
    if (parsed?.success) {
      onSuccess(formRef.current?.values.email);
    }
  }, [isSuccess, data, onSuccess]);

  const pickImage = async (setFieldValue: (field: string, value: any) => void) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Camera roll permission is required to select a profile photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setFieldValue("profileImage", uri);
    }
  };

  const removeImage = (setFieldValue: (field: string, value: any) => void) => {
    setSelectedImage(null);
    setFieldValue("profileImage", "");
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "Male",
    profileImage: "",
    countryCode: "+20",
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={accountInfoSchema}
        validateOnMount={true}
        onSubmit={(values) => {
          const form = new FormData();
          form.append("FirstName", values.firstName);
          form.append("LastName", values.lastName);
          form.append("Email", values.email);
          form.append("PhoneNumber", `${values.countryCode}${values.phone}`);
          form.append("Password", values.password);
          form.append("DateOfBirth", values.dateOfBirth);
          form.append("Gender", values.gender);
          if (values.profileImage) {
            form.append("ProfileImage", {
              uri: values.profileImage,
              name: "profile.jpg",
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
          const disabled = !isValid || !dirty || isPending;
          return (
            <>
              <View style={styles.avatarWrapper}>
                <TouchableOpacity
                  onPress={() => pickImage(setFieldValue)}
                  activeOpacity={0.85}
                >
                  <View style={styles.avatarCircle}>
                    {selectedImage ? (
                      <Image
                        source={{ uri: selectedImage }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Ionicons
                          name="camera-outline"
                          size={34}
                          color={lightColors.primary}
                          style={{ opacity: 0.45 }}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.avatarHint}>
                  {selectedImage ? "" : "Profile Photo"}
                </Text>
                {selectedImage && (
                  <Pressable
                    onPress={() => removeImage(setFieldValue)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                )}
                {touched.profileImage && errors.profileImage && (
                  <Text style={styles.avatarError}>
                    {errors.profileImage as string}
                  </Text>
                )}
              </View>

              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <AuthInput
                    label="First Name"
                    placeholder="Enter first name"
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    error={errors.firstName}
                    touched={touched.firstName}
                    contentStyle={styles.nameInputContent}
                  />
                </View>
                <View style={styles.nameDivider} />
                <View style={styles.nameField}>
                  <AuthInput
                    label="Last Name"
                    placeholder="Enter last name"
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    error={errors.lastName}
                    touched={touched.lastName}
                    contentStyle={styles.nameInputContent}
                  />
                </View>
              </View>

              <AuthInput
                label="Email"
                placeholder="Enter email address"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                error={errors.email}
                touched={touched.email}
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

              <Text style={styles.sectionTitle}>Security</Text>
              <AuthInput
                label="Password"
                placeholder="Enter password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry={!showPassword}
                error={errors.password}
                touched={touched.password}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword((s) => !s)}
                    forceTextInputFocus={false}
                    color="#6B7280"
                  />
                }
              />
              <AuthInput
                label="Confirm Password"
                placeholder="Confirm password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                secureTextEntry={!showConfirm}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirm ? "eye-off" : "eye"}
                    onPress={() => setShowConfirm((s) => !s)}
                    forceTextInputFocus={false}
                    color="#6B7280"
                  />
                }
              />

              <Text style={styles.sectionTitle}>Additional Info</Text>
              <DateInput
                label="Date of Birth"
                value={values.dateOfBirth}
                onDateChange={(date) => setFieldValue("dateOfBirth", date)}
                error={errors.dateOfBirth}
                touched={touched.dateOfBirth}
              />

              <View style={styles.genderSection}>
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  <Pressable
                    onPress={() => setFieldValue("gender", "Male")}
                    style={[
                      styles.genderPill,
                      values.gender === "Male"
                        ? styles.genderPillActive
                        : styles.genderPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderPillText,
                        values.gender === "Male"
                          ? { color: "#fff" }
                          : { color: "#6B7280" },
                      ]}
                    >
                      Male
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setFieldValue("gender", "Female")}
                    style={[
                      styles.genderPill,
                      values.gender === "Female"
                        ? styles.genderPillActive
                        : styles.genderPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderPillText,
                        values.gender === "Female"
                          ? { color: "#fff" }
                          : { color: "#6B7280" },
                      ]}
                    >
                      Female
                    </Text>
                  </Pressable>
                </View>
                {touched.gender && errors.gender && (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                )}
              </View>

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
                      <Text style={styles.submitBtnText}>  Creating...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitBtnText}>Create Account</Text>
                  )}
                </View>
              </Pressable>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorMsg}>
                    {(error as any)?.message || "Registration failed"}
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
  avatarWrapper: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: lightColors.bgLight || "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: lightColors.inputBorder || "#E4E8EE",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  avatarHint: {
    marginTop: 12,
    fontSize: s(13),
    color: "#6B7280",
    fontFamily: "Inter",
    fontWeight: "500",
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  removeText: {
    fontSize: s(12),
    color: "#DC2626",
    fontFamily: "Inter",
    fontWeight: "600",
  },
  avatarError: {
    color: "#EF4444",
    fontSize: s(12),
    fontFamily: "Inter",
    marginTop: 8,
  },
  nameRow: {
    flexDirection: "row",
  },
  nameField: {
    flex: 1,
  },
  nameDivider: {
    width: 8,
  },
  nameInputContent: {
    paddingHorizontal: s(10),
    fontSize: s(14),
  },
  sectionTitle: {
    fontSize: s(16),
    fontWeight: "700",
    fontFamily: "Inter",
    color: lightColors.primary,
    marginTop: vs(8),
    marginBottom: vs(4),
  },
  genderSection: {
    marginBottom: s(16),
  },
  genderLabel: {
    fontSize: s(14),
    fontWeight: "600",
    marginBottom: s(10),
    fontFamily: "Inter",
    color: lightColors.primary,
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderPill: {
    flex: 1,
    height: s(48),
    borderRadius: s(14),
    overflow: "hidden",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  genderPillActive: {
    borderColor: "transparent",
    backgroundColor: lightColors.primary,
  },
  genderPillInactive: {
    borderColor: "#E4E8EE",
    backgroundColor: "#FFFFFF",
  },
  genderPillText: {
    fontSize: s(14),
    fontWeight: "600",
    fontFamily: "Inter",
  },
  errorText: {
    color: "#EF4444",
    fontSize: s(12),
    fontFamily: "Inter",
    fontWeight: "500",
    marginTop: s(6),
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
