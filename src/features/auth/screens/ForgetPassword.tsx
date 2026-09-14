import { ScrollView, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { s, vs, ms } from "react-native-size-matters";
import React, { useState } from "react";
import { lightColors } from "../../../../theme";
import GradientText from "../../../Components/GradientText";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../../../Components/buttons/GradientButton";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../Navigation/AuthStack";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import forgetPassword from "../services/auth";
import AuthInput from "../../../Components/inputs/AuthInput";
import { backarrow } from "../../../assests/icons/AllIcon";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login",
  "verifyAccount"
>;

export default function ForgetPassword() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { i18n } = useTranslation();


  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Not Valid Email").required("Email is required"),
  });

async function handleSubmit(values: any) {
  try {
    setLoading(true);
    setApiError(null);

    const result = await forgetPassword(values.email);
    if (result && result.success === true) {
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("verifyAccount", {
          email: values.email,
          source: "forgetPassword",
        });
      }, 2000);
    } else {
      setLoading(false);
      setApiError(result?.message?.en || "Something went wrong");
    }

  } catch (error: any) {
    setLoading(false);
    console.error("Error:", error);
    setApiError(error?.friendlyMessage || "Something went wrong");
  }
}


  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });


  const handleChangeEmail = (text: string) => {
    formik.handleChange("email")(text);
    if (apiError) setApiError(null);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
        <View style={styles.logoContainer}>
          <GradientText 
            text="Alluvo" 
            textStyle={[styles.logo, { textAlign: i18n.language.startsWith("ar") ? "right" : "left", width: "100%" }]} 
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <View style={styles.content}>
            <View style={styles.Inputcontainer}>
              <AuthInput
                label="Email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChangeText={handleChangeEmail}
                onBlur={formik.handleBlur("email")}
                keyboardType="email-address"
                error={formik.errors.email || (apiError ? apiError : undefined)}
                touched={formik.touched.email || !!apiError}
              />

              <GradientButton
                text={loading ? "Sending..." : "Send Email"}
                onPress={formik.handleSubmit}
                disabled={loading || !formik.values.email}
              />

              <TouchableOpacity
                style={styles.backContainer}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={[styles.backText, { textAlign: i18n.language.startsWith("ar") ? "right" : "left" }]}>Back To login</Text>
                <SvgXml xml={backarrow} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  safeArea: {
    flex: 1,
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: s(20),
    justifyContent: "center",
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  Inputcontainer: {
    width: "100%",
    gap: vs(12),
  },
  label: {
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 13,
    letterSpacing: 0,
    color: "#1B2351",
  },
  inputWrapper: {
    height: vs(47),
    borderRadius: s(8),
    backgroundColor: "#fff",
    paddingHorizontal: s(16),
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: vs(4) },
    shadowOpacity: 0.25,
    shadowRadius: s(4),
    elevation: 4,
  },
  input: {
    fontSize: s(13),
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#1B2351",
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
