import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, vs, ms } from "react-native-size-matters";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SvgXml } from "react-native-svg";
import { TextInput } from "react-native-paper";
import { lightColors } from "../../../../theme";
import AuthInput from "../../../Components/inputs/AuthInput";
import { useNavigation } from "@react-navigation/native";
import AuthDivider from "../../../Components/auth/AuthDivider";
import SocialAuthGroup from "../../../Components/auth/SocialAuthGroup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useLogin } from "../hooks/useLogin";
import { useAppDispatch } from "../../../Redux/store";
import { setToken } from "../../../Redux/slices/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useGoogleAuthRequest, useTikTokAuthRequest } from "../services/socialAuth";
import { shadow_SVG } from "../../../assests/icons/AllIcon";
import { useTranslation } from "react-i18next";
import AppLogo from "../../../Components/AppLogo";
import { AuthStackParamList, RootStackParamList } from "../../../Navigation/types";


type RootNavigationType = NativeStackNavigationProp<RootStackParamList, "User">;
type LoginScreenProps = NativeStackNavigationProp<
  AuthStackParamList,
  "Register",
  "forgetPassword"
>;
export default function LoginScreen() {
  const mainNavigation = useNavigation<RootNavigationType>();
  const navigation = useNavigation<LoginScreenProps>();
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.auth.token);


  const [visible, setVisible] = useState(false);
  const { error, isPending,  mutate,data, isSuccess } = useLogin();
  const { t, i18n } = useTranslation();

  const myform = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required(t("emailReq"))
        .email(t("emailInv")),
      password: Yup.string()
        .required(t("passReq"))
        .min(7, t("passMin")),
    }),
    onSubmit: (values) => {
      mutate(values);
    },
  });
  useEffect(() => {
    if (!isSuccess) return;
    mainNavigation.replace("User", { screen: "UserTabs" });
  }, [isSuccess]);

  const { handleGoogleAuth } = useGoogleAuthRequest(
    (token) => {
      dispatch(setToken(token));
      mainNavigation.replace("User", { screen: "UserTabs" });
    },
    (err) => console.error("Google login failed:", err)
  );

  const { handleTikTokAuth } = useTikTokAuthRequest(
    (token) => {
      dispatch(setToken(token));
      mainNavigation.replace("User", { screen: "UserTabs" });
    },
    (err) => console.error("TikTok login failed:", err)
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled
        >
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <AppLogo size={65} textStyle={styles.text} />
            <SvgXml
              xml={shadow_SVG}
              width={237}
              height={24}
              style={styles.shadow}
            />
          </View>

          {/* Form area */}
          <View style={styles.formCard}>
            <AuthInput
              label={t("email")}
              placeholder={t("enterEmail")}
              value={myform.values.email}
              onChangeText={myform.handleChange("email")}
              onBlur={myform.handleBlur("email")}
              keyboardType="email-address"
              error={myform.errors.email}
              touched={myform.touched.email}
            />

            <AuthInput
              label={t("password")}
              placeholder={t("enterPassword")}
              value={myform.values.password}
              onChangeText={myform.handleChange("password")}
              onBlur={myform.handleBlur("password")}
              secureTextEntry={!visible}
              error={myform.errors.password}
              touched={myform.touched.password}
              right={
                <TextInput.Icon
                  icon={visible ? "eye-off" : "eye"}
                  forceTextInputFocus={false}
                  onPress={() => setVisible((v) => !v)}
                />
              }
            />

            <Pressable 
              onPress={() => navigation.navigate("forgetPassword")}
              style={{ width: "100%" }}
            >
              <Text style={[styles.forgetPassword, { textAlign: i18n.language.startsWith("ar") ? "center" : "center" }]}>
                {t("forgetPassword")}
              </Text>
            </Pressable>

            <TouchableOpacity
              style={styles.loginButton}
              disabled={!myform.isValid}
              onPress={() => {
                myform.handleSubmit();
              }}
            >
              <LinearGradient
                colors={["#1B2351", "#47C0D2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.loginButton,
                  { opacity: myform.isValid ? 1 : 0.6 },
                ]}
              >
                {isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginText}>{t("loginText")}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            {/* server messages */}
            {error && (
              <Text
                style={[
                  styles.errorText,
                  { textAlign: "left", marginTop: 8, width: "100%" },
                ]}
              >
                {error?.friendlyMessage || error?.message || "An error occurred"}
              </Text>
            )}

            <AuthDivider />
            <SocialAuthGroup onGooglePress={handleGoogleAuth} onTiktokPress={handleTikTokAuth} />


            <View style={[styles.SignUp, { flexDirection: "row" }]}>
              <Text style={styles.SignUpText}>{t("dontHaveAccount")}</Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text style={styles.SignInbtn}>{t("signUp")}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoWrapper: {
    alignItems: "center",
    marginTop: 100,
  },
  text: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 40,
    marginStart: 10,
  },
  shadow: {
    marginTop: 15,
  },
  formCard: {
    marginTop: 40,
  },
  label: {
    marginBottom: vs(6),
    color: lightColors.primary,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(14),
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: s(8),
    marginBottom: vs(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.08,
    shadowRadius: s(4),
    elevation: 6,
  },
  inputContent: {
    height: vs(42),
    paddingHorizontal: s(6),
    fontFamily: "Inter",
  },
  error: {
    color: "red",
    fontSize: s(12),
    marginBottom: vs(10),
  },
  forgetPassword: {
    color: lightColors.primary,
    fontWeight: "500",
    fontSize: s(13),
    textAlign: "left",
    textDecorationLine: "underline",
    marginTop: vs(10),
  },
  loginButton: {
    width: "100%",
    height: vs(44),
    borderRadius: s(10),
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(10),
  },
  loginText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(16),
    color: "#fff",
  },
  SignUp: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: vs(15),
  },
  SignUpText: {
    fontWeight: "500",
    fontSize: s(16),
    color: "#666666",
  },
  SignInbtn: {
    marginHorizontal: s(5),
    color: lightColors.primary,
    fontSize: s(16),
    textDecorationLine: "underline",
  },
  errorText: { color: "red", fontSize: s(12), marginTop: vs(2) },
});
