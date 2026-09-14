import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal, Image, Platform, Alert, KeyboardAvoidingView } from "react-native";
import { s, vs, ms } from "react-native-size-matters";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { lightColors } from "../../../../theme";
import GradientText from "../../../Components/GradientText";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../../Components/buttons/GradientButton";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../Navigation/AuthStack";
import AuthInput from "../../../Components/inputs/AuthInput";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { resetPassword } from "../services/auth";
import { useSelector } from "react-redux";
import { backarrow } from "../../../assests/icons/AllIcon";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export default function ResetPassword() {
  const token = useSelector((state: any) => state.auth.token);
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const handleContinue = () => {
    setModalVisible(false);
    navigation.navigate("Login");
  };

  // Api connection
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await resetPassword(token, values.password);
        setModalVisible(true);
      } catch (err) {

      }
    },
  });

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.logoContainer}>
              <GradientText 
                text="Alluvo" 
                textStyle={[styles.logo, { textAlign: i18n.language.startsWith("ar") ? "right" : "left", width: "100%" }]} 
              />
            </View>

            <View style={styles.content}>
              <View style={styles.Inputcontainer}>
                <AuthInput
                  label="Password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  secureTextEntry={!showPassword}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword((s) => !s)}
                      forceTextInputFocus={false}
                      color="#CDD5DF"
                    />
                  }
                />

                <AuthInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formik.values.confirmPassword}
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={formik.handleBlur("confirmPassword")}
                  secureTextEntry={!showConfirm}
                  error={formik.errors.confirmPassword}
                  touched={formik.touched.confirmPassword}
                  right={
                    <TextInput.Icon
                      icon={showConfirm ? "eye-off" : "eye"}
                      onPress={() => setShowConfirm((s) => !s)}
                      forceTextInputFocus={false}
                      color="#CDD5DF"
                    />
                  }
                />

                <GradientButton
                  text="Save"
                  onPress={() => formik.handleSubmit()}
                  disabled={!formik.isValid || !formik.dirty}
                />

                <TouchableOpacity
                  style={styles.backContainer}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={[styles.backText, { textAlign: i18n.language.startsWith("ar") ? "right" : "left" }]}>Back to Sign In</Text>
                  <SvgXml xml={backarrow} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Image
              source={require("../../../assests/imgs/password_changed.png")}
              style={modalStyles.image}
              resizeMode="contain"
            />

            <Text style={modalStyles.title}>Password changed successfully</Text>
            <Text style={modalStyles.sub}>
              You can now log in with your new password
            </Text>

            <GradientButton
              text="Continue to Login"
              style={modalStyles.continueBtn}
              onPress={handleContinue}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: lightColors.bgLight,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: s(20),
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    top: 61,
    left: 23,
    gap: 5,
    width: 100,
    height: 51,
    position: "absolute",
  },
  logo: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 24,
    letterSpacing: 0,
    opacity: 1,
    textAlign: "left",
  },
  des: {
    fontFamily: "Inter-Light",
    fontWeight: "300",
    fontStyle: "normal",
    fontSize: s(16),
    letterSpacing: 0,
    color: "#666666",
    textAlignVertical: "center",
    marginBottom: vs(20),
    textAlign: "left",
  },
  Inputcontainer: {
    width: "100%",
    gap: vs(12),
  },
  label: {
  fontSize: s(14),
  color: lightColors.primary,
  marginTop: vs(8),
  marginBottom: vs(6),
  fontFamily: "Inter",
},
input: {
  backgroundColor: "#fff",
  borderRadius: s(8),
  height: vs(48),
  marginBottom: vs(8),
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.08,
  shadowRadius: s(4),
  elevation: 6,
},
  inputContent: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontStyle: "normal",
    fontSize: s(12),
    letterSpacing: 0,
    textAlignVertical: "center",
    color: "#666666",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(10),
    gap: s(5),
  },
  backText: {
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    fontSize: s(13),
    letterSpacing: 0,
    textAlign: "left",
    color: "#3E548D",
    textAlignVertical: "center",
  },
});

/* Modal styles */
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: s(20),
  },
  card: {
    width: s(343),
    height: vs(362),
    gap: vs(16),
    backgroundColor: "#FEFEFE",
    borderRadius: s(16),
    paddingVertical: vs(32),
    paddingHorizontal: s(16),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: vs(4) },
    shadowOpacity: 0.25,
    shadowRadius: s(8),
    elevation: 8,
  },
  image: {
    width: s(140),
    height: s(140),
    borderRadius: s(120),
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "500",
    fontSize: s(16),
    color: "#1B2351",
    textAlign: "center",
  },
  sub: {
    fontFamily: "Inter-Light",
    fontWeight: "500",
    fontSize: s(14),
    color: "#4B5563",
    textAlign: "center",
  },
  continueBtn: {
    width: s(317),
    height: vs(48),
    borderRadius: s(8),
  },
});
