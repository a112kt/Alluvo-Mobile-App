import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";
import { useFormik } from "formik";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { lightColors } from "../../../../../theme";
import { AuthStackParamList, RootStackParamList } from "../../../../Navigation/types";
import AppLogo from "../../../../Components/AppLogo";
import AuthInput from "../../../../Components/inputs/AuthInput";
import { useBrandLogin } from "../hooks/useBrandLogin";
import { brandLoginValidationSchema } from "../validation";

type BrandLoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, "BrandLogin">;
type RootNavigationType = NativeStackNavigationProp<RootStackParamList, "Auth", "Brand">;

export default function BrandLoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const navigation = useNavigation<BrandLoginNavigationProp>();
  const mainNavigation = useNavigation<RootNavigationType>();
  const { isPending, mutate, isSuccess, error } = useBrandLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [friendlyError, setFriendlyError] = useState<string | null>(null);

  const colors = isDark
    ? {
        bg: "#0D1117",
        surface: "#161B22",
        text: "#E6EDF3",
        textSecondary: "#8B949E",
        textTitle: "#E6EDF3",
        border: "#30363D",
        inputBg: "#0D1117",
        primary: "#58A6FF",
        accent: "#47C0D2",
        placeholder: "#484F58",
        error: "#F85149",
        cardBg: "#161B22",
      }
    : {
        bg: lightColors.bgLight,
        surface: lightColors.white,
        text: lightColors.body,
        textSecondary: lightColors.subtitle,
        textTitle: lightColors.title,
        border: lightColors.inputBorder,
        inputBg: lightColors.inputBackground,
        primary: lightColors.primary,
        accent: lightColors.secondary,
        placeholder: lightColors.inputPlaceholder,
        error: lightColors.textDanger,
        cardBg: lightColors.white,
      };

  const formik = useFormik({
    validateOnMount: true,
    initialValues: { email: "", password: "" },
    validationSchema: brandLoginValidationSchema,
    onSubmit: (values) => {
      setFriendlyError(null);
      mutate(values);
    },
  });

  useEffect(() => {
    if (!isSuccess) return;
    mainNavigation.replace("Brand");
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      const err = error as any;
      if (err?.friendlyMessage) {
        setFriendlyError(err.friendlyMessage);
      } else if (err?.response?.data?.title) {
        setFriendlyError(err.response.data.title);
      } else if (err?.message === "Network Error") {
        setFriendlyError("Unable to connect. Please check your internet connection.");
      } else {
        setFriendlyError("Something went wrong. Please try again.");
      }
    }
  }, [error]);

  const handleCreateBrandAccount = () => {
    navigation.navigate("BrandRegister");
  };

  const handleForgotPassword = () => {
    navigation.navigate("forgetPassword");
  };

  const isFormValid = formik.isValid && formik.dirty;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topSection}>
              <AppLogo size={s(50)} textStyle={styles.logoText} />
            </View>

            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.welcomeTitle, { color: colors.textTitle }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Sign in to manage your brand.
              </Text>

              <View style={styles.formSection}>
                <AuthInput
                  label="Email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={formik.errors.email}
                  touched={formik.touched.email}
                />

                <AuthInput
                  label="Password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  error={formik.errors.password}
                  touched={formik.touched.password}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      forceTextInputFocus={false}
                      onPress={() => setShowPassword((v) => !v)}
                    />
                  }
                />

                <Pressable onPress={handleForgotPassword} style={styles.forgotRow}>
                  <Text style={[styles.forgotText, { color: colors.primary }]}>
                    Forgot Password
                  </Text>
                </Pressable>

                {friendlyError && (
                  <Text style={[styles.errorMessage, { color: colors.error }]}>
                    {friendlyError}
                  </Text>
                )}

                <Pressable
                  style={styles.loginBtnWrapper}
                  disabled={!isFormValid || isPending}
                  onPress={() => formik.handleSubmit()}
                >
                  <LinearGradient
                    colors={
                      !isFormValid || isPending
                        ? ["#B0B8C9", "#B0B8C9"]
                        : [colors.primary, colors.accent]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginBtn}
                  >
                    {isPending ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.loginBtnText}>Login</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            <View style={styles.bottomSection}>
              <Text style={[styles.bottomText, { color: colors.textSecondary }]}>
                Don't have a Brand account?
              </Text>
              <Pressable
                style={[styles.createAccountBtn, { borderColor: colors.primary }]}
                onPress={handleCreateBrandAccount}
              >
                <Text style={[styles.createAccountText, { color: colors.primary }]}>
                  Create Brand Account
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: s(24),
    paddingBottom: vs(40),
    justifyContent: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: vs(32),
    marginTop: vs(20),
  },
  logoText: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "400",
    fontSize: s(36),
  },
  card: {
    borderRadius: s(24),
    borderWidth: 1,
    paddingHorizontal: s(24),
    paddingVertical: vs(32),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  welcomeTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(26),
    textAlign: "center",
    marginBottom: vs(6),
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(15),
    textAlign: "center",
    marginBottom: vs(28),
  },
  formSection: {
    gap: 0,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginTop: vs(4),
    marginBottom: vs(12),
  },
  forgotText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    textDecorationLine: "underline",
  },
  errorMessage: {
    fontFamily: "Inter",
    fontSize: s(13),
    fontWeight: "500",
    textAlign: "center",
    marginBottom: vs(8),
  },
  loginBtnWrapper: {
    width: "100%",
    borderRadius: s(16),
    overflow: "hidden",
    marginTop: vs(4),
  },
  loginBtn: {
    width: "100%",
    height: vs(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: s(16),
  },
  loginBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(17),
    color: "#FFFFFF",
  },
  bottomSection: {
    alignItems: "center",
    marginTop: vs(32),
  },
  bottomText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(14),
    marginBottom: vs(12),
  },
  createAccountBtn: {
    width: "100%",
    height: vs(48),
    borderRadius: s(16),
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  createAccountText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
  },
});
