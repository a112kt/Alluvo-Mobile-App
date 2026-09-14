import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { s, vs, ms } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { lightColors } from "../../../../theme";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../Navigation/AuthStack";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Redux/store";
import * as Yup from "yup";
import { Formik } from "formik";

import { useRegister } from "../hooks/useRegister";
import { useGoogleAuthRequest, useTikTokAuthRequest } from "../services/socialAuth";
import { setToken } from "../../../Redux/slices/authSlice";
import { RootStackParamList } from "../../../Navigation/AppNavigator";
import { headerWave, arrowSvg } from "../../../assests/icons/AllIcon";
import AuthInput from "../../../Components/inputs/AuthInput";
import PhoneInput, {
  Country,
  Country as ICountry,
} from "../../../Components/inputs/PhoneInput";
import AuthDivider from "../../../Components/auth/AuthDivider";
import SocialAuthGroup from "../../../Components/auth/SocialAuthGroup";
import DateInput from "../../../Components/inputs/DateInput";
import { useTranslation } from "react-i18next";

type RegisterData = {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  DateOfBirth: string;
  Gender: string;
  ProfileImage?: string;
};
type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default function RegisterScreen() {
  const { mutate, error, isPending, isSuccess, data } = useRegister();
  const formRef = useRef<any>(null);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();

  // Entrance animation
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

  // Validation schema
  const RegisterSchema = Yup.object().shape({
    FirstName: Yup.string()
      .min(2, t("fnameMin"))
      .required(t("fnameReq")),

    LastName: Yup.string()
      .min(2, t("lnameMin"))
      .required(t("lnameReq")),

    Email: Yup.string()
      .email(t("emailInv"))
      .required(t("emailReq")),

    PhoneNumber: Yup.string()
      .length(11, t("phoneLen"))
      .required(t("phoneReq")),

    Password: Yup.string()
      .min(6, t("passMin"))
      .required(t("passReq")),

    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password")], t("passMatch"))
      .required(t("confirmReq")),

    DateOfBirth: Yup.string().required(t("dobReq")),

    Gender: Yup.string()
      .oneOf(["Male", "Female"], t("invalidGender"))
      .required(t("genderReq")),
  });

  const initialValues: RegisterData & {
    ConfirmPassword?: string;
    CountryCode?: string;
  } = {
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    DateOfBirth: "",
    Gender: "Male",
    ProfileImage: "",
    CountryCode: "+20",
  };

  // UI local states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Egypt",
    code: "+20",
    flag: "🇪🇬",
  });

  // Image picker
  const pickImage = async (
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert(t("grantPermission"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;

      setSelectedImage(uri);
      setFieldValue("ProfileImage", uri);
    } else {

    }
  };

  const removeImage = (setFieldValue: (field: string, value: any) => void) => {
    setSelectedImage(null);
    setFieldValue("ProfileImage", "");
  };

  useEffect(() => {
    if (isSuccess) {
      if (JSON.parse(data).success) {
        navigation.navigate("verifyAccount", {
          email: formRef.current?.values.Email,
          source: "signup",
        });
      }
    }
  }, [isSuccess, dispatch, navigation]);

  const mainNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { handleGoogleAuth } = useGoogleAuthRequest(
    (token) => {
      dispatch(setToken(token));
      mainNavigation.replace("User", { screen: "UserTabs" });
    },
    (err) => console.error("Google signup failed:", err)
  );

  const { handleTikTokAuth } = useTikTokAuthRequest(
    (token) => {
      dispatch(setToken(token));
      mainNavigation.replace("User", { screen: "UserTabs" });
    },
    (err) => console.error("TikTok signup failed:", err)
  );

  return (
    <View style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#1B2351", "#47C0D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.headerGradient, { paddingTop: insets.top }]}
        >
          <SvgXml xml={headerWave} style={styles.svgWave} />
          <View style={styles.headerContent}>
            <Pressable
              onPress={() => {
                if (navigation.canGoBack()) navigation.goBack();
                else navigation.navigate("role" as any);
              }}
              style={styles.backCircle}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <SvgXml xml={arrowSvg} width={8} height={14} />
            </Pressable>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>{t("createAccount")}</Text>
              <Text style={styles.headerSubtitle}>
                Fill in your details to get started
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Formik
              innerRef={formRef}
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              validateOnMount={true}
              onSubmit={(values) => {
                const finalValues = {
                  ...values,
                  PhoneNumber: values.PhoneNumber.startsWith("0")
                    ? values.PhoneNumber.substring(1)
                    : values.PhoneNumber,
                };
                mutate(finalValues);
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
                    {/* Avatar */}
                    <View style={styles.avatarWrapper}>
                      <TouchableOpacity
                        onPress={() => {
                          pickImage(setFieldValue);
                        }}
                        activeOpacity={0.85}
                      >
                        <View style={styles.avatarCircle}>
                          {selectedImage ? (
                            <View style={styles.avatarImageContainer}>
                              <Image
                                key={selectedImage}
                                source={{ uri: selectedImage }}
                                style={styles.avatarImage}
                                resizeMode="cover"
                                fadeDuration={0}
                              />
                            </View>
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
                        {selectedImage ? "" : "Add Profile Photo"}
                      </Text>
                      {selectedImage && (
                        <Pressable
                          onPress={() => removeImage(setFieldValue)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeText}>Remove Photo</Text>
                        </Pressable>
                      )}
                    </View>

                    {/* Name Row */}
                    <View style={styles.nameRow}>
                      <View style={styles.nameField}>
                        <AuthInput
                          label={t("firstName")}
                          placeholder={t("enterFirstName")}
                          value={values.FirstName}
                          onChangeText={handleChange("FirstName")}
                          onBlur={handleBlur("FirstName")}
                          error={errors.FirstName}
                          touched={touched.FirstName}
                          contentStyle={styles.nameInputContent}
                        />
                      </View>
                      <View style={styles.nameDivider} />
                      <View style={styles.nameField}>
                        <AuthInput
                          label={t("lastName")}
                          placeholder={t("enterLastName")}
                          value={values.LastName}
                          onChangeText={handleChange("LastName")}
                          onBlur={handleBlur("LastName")}
                          error={errors.LastName}
                          touched={touched.LastName}
                          contentStyle={styles.nameInputContent}
                        />
                      </View>
                    </View>

                    {/* Email */}
                    <AuthInput
                      label={t("email")}
                      placeholder={t("enterEmail")}
                      value={values.Email}
                      onChangeText={handleChange("Email")}
                      onBlur={handleBlur("Email")}
                      keyboardType="email-address"
                      error={errors.Email}
                      touched={touched.Email}
                    />

                    {/* Phone */}
                    <PhoneInput
                      label={t("phone")}
                      value={values.PhoneNumber}
                      onChangeText={handleChange("PhoneNumber")}
                      onBlur={handleBlur("PhoneNumber")}
                      error={errors.PhoneNumber}
                      touched={touched.PhoneNumber}
                      selectedCountry={selectedCountry}
                      maxLength={11}
                      onCountryChange={(c) => {
                        setSelectedCountry(c);
                        setFieldValue("CountryCode", c.code);
                      }}
                    />

                    {/* Password */}
                    <AuthInput
                      label={t("password")}
                      placeholder={t("enterPassword")}
                      value={values.Password}
                      onChangeText={handleChange("Password")}
                      onBlur={handleBlur("Password")}
                      secureTextEntry={!showPassword}
                      error={errors.Password}
                      touched={touched.Password}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? "eye-off" : "eye"}
                          onPress={() => setShowPassword((s) => !s)}
                          forceTextInputFocus={false}
                          color="#6B7280"
                        />
                      }
                    />

                    {/* Confirm Password */}
                    <AuthInput
                      label={t("confirmPassword")}
                      placeholder={t("enterConfirmPassword")}
                      value={values.ConfirmPassword ?? ""}
                      onChangeText={handleChange("ConfirmPassword")}
                      onBlur={handleBlur("ConfirmPassword")}
                      secureTextEntry={!showConfirm}
                      error={errors.ConfirmPassword}
                      touched={touched.ConfirmPassword}
                      right={
                        <TextInput.Icon
                          icon={showConfirm ? "eye-off" : "eye"}
                          onPress={() => setShowConfirm((s) => !s)}
                          forceTextInputFocus={false}
                          color="#6B7280"
                        />
                      }
                    />

                    {/* Birthday */}
                    <DateInput
                      value={values.DateOfBirth}
                      onDateChange={(date) => setFieldValue("DateOfBirth", date)}
                      error={errors.DateOfBirth}
                      touched={touched.DateOfBirth}
                    />

                    {/* Gender */}
                    <View style={styles.genderSection}>
                      <Text style={styles.genderLabel}>{t("gender")}</Text>
                      <View style={styles.genderRow}>
                        <Pressable
                          onPress={() => setFieldValue("Gender", "Male")}
                          style={[
                            styles.genderPill,
                            values.Gender === "Male"
                              ? styles.genderPillActive
                              : styles.genderPillInactive,
                          ]}
                        >
                          {values.Gender === "Male" ? (
                            <LinearGradient
                              colors={["#1B2351", "#47C0D2"]}
                              style={styles.genderPillGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Image
                                source={require("../../../assests/imgs/male.png")}
                                style={styles.genderIcon}
                              />
                              <Text style={styles.genderPillText}>Male</Text>
                            </LinearGradient>
                          ) : (
                            <>
                              <Image
                                source={require("../../../assests/imgs/male.png")}
                                style={[styles.genderIcon, { tintColor: "#6B7280" }]}
                              />
                              <Text style={[styles.genderPillText, { color: "#6B7280" }]}>
                                Male
                              </Text>
                            </>
                          )}
                        </Pressable>

                        <Pressable
                          onPress={() => setFieldValue("Gender", "Female")}
                          style={[
                            styles.genderPill,
                            values.Gender === "Female"
                              ? styles.genderPillActive
                              : styles.genderPillInactive,
                          ]}
                        >
                          {values.Gender === "Female" ? (
                            <LinearGradient
                              colors={["#1B2351", "#47C0D2"]}
                              style={styles.genderPillGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Image
                                source={require("../../../assests/imgs/female.png")}
                                style={styles.genderIcon}
                              />
                              <Text style={styles.genderPillText}>Female</Text>
                            </LinearGradient>
                          ) : (
                            <>
                              <Image
                                source={require("../../../assests/imgs/female.png")}
                                style={[styles.genderIcon, { tintColor: "#6B7280" }]}
                              />
                              <Text style={[styles.genderPillText, { color: "#6B7280" }]}>
                                Female
                              </Text>
                            </>
                          )}
                        </Pressable>
                      </View>
                      {touched.Gender && errors.Gender && (
                        <View style={styles.errorRow}>
                          <Text style={styles.errorText}>{errors.Gender}</Text>
                        </View>
                      )}
                    </View>

                    {/* Register Button */}
                    <Pressable
                      onPress={() => {
                        if (!disabled) handleSubmit();
                      }}
                      disabled={disabled}
                      style={({ pressed }) => [
                        styles.registerBtnWrapper,
                        pressed && !disabled && styles.registerBtnPressed,
                      ]}
                    >
                      <LinearGradient
                        colors={
                          disabled
                            ? ["#A0A5B0", "#C4C8D0"]
                            : ["#1B2351", "#47C0D2"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                          styles.registerBtn,
                          disabled && styles.registerBtnDisabled,
                        ]}
                      >
                        {isPending ? (
                          <View style={styles.loadingRow}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={styles.registerText}>
                              {"  "}{t("registering")}
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.registerText}>
                            {t("register")}
                          </Text>
                        )}
                      </LinearGradient>
                    </Pressable>

                    {/* Server messages */}
                    {error && (
                      <View style={styles.serverErrorContainer}>
                        <Text style={[styles.serverErrorText, { textAlign: "left" }]}>
                          {error?.message}
                        </Text>
                      </View>
                    )}
                    {(data ? !JSON.parse(data).success : false) && (
                      <View style={styles.serverErrorContainer}>
                        <Text style={[styles.serverErrorText, { textAlign: "left" }]}>
                          {data ? (JSON.parse(data).errors?.[0]?.en || JSON.parse(data).message?.en || "") : ""}
                        </Text>
                      </View>
                    )}

                    <AuthDivider />
                    <SocialAuthGroup onGooglePress={handleGoogleAuth} onTiktokPress={handleTikTokAuth} />

                    {/* Sign in */}
                    <View style={styles.signInSection}>
                      <Text style={styles.signInText}>
                        {t("alreadyHaveAccount")}
                      </Text>
                      <Pressable
                        onPress={() => navigation.navigate("Login" as any)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.signInBtn}>{t("signIn")}</Text>
                      </Pressable>
                    </View>
                  </>
                );
              }}
            </Formik>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },

  headerWrapper: {
    position: "relative",
  },
  headerGradient: {
    paddingHorizontal: 20,
    overflow: "hidden",
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  headerTextGroup: {
    flex: 1,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 14,
    zIndex: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: s(20),
    fontWeight: "700",
    fontFamily: "Inter",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: s(13),
    fontFamily: "Inter",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  svgWave: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 100,
  },

  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },

  // Avatar
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
  avatarImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarHint: {
    marginTop: 12,
    fontSize: s(13),
    color: "#6B7280",
    fontFamily: "Inter",
    fontWeight: "500",
    letterSpacing: 0.2,
    minHeight: 16,
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

  // Name Row
  nameRow: {
    flexDirection: "row",
    marginBottom: 0,
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

  // Gender
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
  },
  genderPillActive: {
    borderColor: "transparent",
  },
  genderPillInactive: {
    borderColor: "#E4E8EE",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  genderPillGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: s(16),
  },
  genderIcon: {
    width: s(18),
    height: s(18),
    marginRight: s(8),
  },
  genderPillText: {
    fontSize: s(14),
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Inter",
  },

  // Register Button
  registerBtnWrapper: {
    marginTop: vs(24),
    borderRadius: s(16),
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  registerBtnPressed: {
    opacity: 0.92,
  },
  registerBtn: {
    height: vs(56),
    borderRadius: s(16),
    alignItems: "center",
    justifyContent: "center",
  },
  registerBtnDisabled: {
    shadowOpacity: 0.05,
    elevation: 1,
  },
  registerText: {
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

  // Error styles
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: s(6),
  },
  errorText: {
    color: "#EF4444",
    fontSize: s(12),
    fontFamily: "Inter",
    fontWeight: "500",
  },
  serverErrorContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: s(12),
    paddingVertical: s(10),
    paddingHorizontal: s(14),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  serverErrorText: {
    color: "#DC2626",
    fontSize: s(13),
    fontFamily: "Inter",
    fontWeight: "500",
  },

  // Sign In
  signInSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(24),
    marginBottom: vs(12),
    paddingVertical: vs(8),
  },
  signInText: {
    fontWeight: "500",
    fontSize: s(14),
    color: "#6B7280",
    fontFamily: "Inter",
  },
  signInBtn: {
    marginLeft: s(6),
    color: lightColors.primary,
    fontSize: s(14),
    fontWeight: "700",
    fontFamily: "Inter",
    textDecorationLine: "underline",
    textDecorationColor: lightColors.primary,
  },
});
