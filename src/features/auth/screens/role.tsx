import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import GradientText from "../../../Components/GradientText";
import { lightColors } from "../../../../theme";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../Navigation/AuthStack";
import { s, vs, ms } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import AppLogo from "../../../Components/AppLogo";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { RootStackParamList } from "../../../Navigation/AppNavigator";
type roleScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register",
  "Login"
>;
type RootNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  "Auth",
  "User"
>;
const Role = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigation = useNavigation<roleScreenNavigationProp>();
  const mainNavigation = useNavigation<RootNavigationType>();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (token !== null) {
      mainNavigation.replace("User", { screen: "UserTabs" });
    }

  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Logo Section */}
      <View style={styles.logo}>
        <AppLogo size={s(37)} textStyle={styles.text} />
      </View>

      {/* Text + Role Section */}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>{t("startAs")}</Text>
          <Text style={styles.regularText}>{t("pickRole")}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsWrapper}>
          <Pressable
            onPress={() => {
              navigation.navigate("BrandLogin");
            }}
            style={styles.roleBtnBrand}
          >
            <Text style={styles.roleTextBrand}>{t("brand")}</Text>
          </Pressable>


          <Pressable
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={[styles.roleBtnCustomer, { marginTop: 16 }]}
          >
            <LinearGradient
              colors={["#1B2351", "#47C0D2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.roleBtnCustomer}
            >
              <Text style={styles.roleTextCustomer}>{t("customer")}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Role;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  logo: {
    marginTop: vs(60),
    marginStart: s(30),
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  text: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "400",
    fontSize: s(24),
    marginStart: s(6),
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: s(20),
  },
  header: {
    marginBottom: vs(60),
    alignItems: "center",
  },
  titleText: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "500",
    fontSize: s(35),
    textAlign: "center",
    marginBottom: vs(12),
  },
  regularText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(17),
    textAlign: "center",
    color: "#666666",
  },
  buttonsWrapper: {
    alignItems: "center",
  },
  roleBtnBrand: {
    width: s(235),
    height: vs(48),
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: lightColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  roleTextBrand: {
    fontFamily: "Inter",
    fontSize: s(15),
    fontWeight: "500",
    color: lightColors.primary,
  },
  roleBtnCustomer: {
    width: s(235),
    height: vs(48),
    borderRadius: s(8),
    alignItems: "center",
    justifyContent: "center",
  },
  roleTextCustomer: {
    fontFamily: "Inter",
    fontSize: s(15),
    fontWeight: "500",
    color: "#fff",
  },
});
