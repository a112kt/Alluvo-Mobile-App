import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import BackBtn from "../../components/ProfileManagement/BackBtn";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightColors } from "../../../../../theme";
import { scale, verticalScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import GradientText from "../../../../Components/GradientText";
import { NavigationProp, useNavigation, CommonActions } from "@react-navigation/native";
import SettingCard from "../../components/ProfileManagement/SettingCard";
import GradientButton from "../../../../Components/buttons/GradientButton";
import { LinearGradient } from "expo-linear-gradient";
import { UserStackParamList } from "../../../../Navigation/types";
import DeleteAccountModal from "../../components/ProfileManagement/DeleteAccountModal";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../../i18n";
import * as Updates from "expo-updates";
import { useRequestDeleteAccountOtp, useConfirmDeleteAccount } from "../../hooks/UserProfile/useProfile";
import { showToast } from "../../../../services/toastService";
import { useAppDispatch } from "../../../../Redux/store";
import { clearAuth } from "../../../../Redux/slices/authSlice";

const Settings = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const dispatch = useAppDispatch();
  const { t, i18n: i18nHook } = useTranslation();
  const isArabic = i18nHook.language.startsWith("ar");

  const requestOtpMutation = useRequestDeleteAccountOtp();
  const confirmDeleteMutation = useConfirmDeleteAccount();

  const [modalVisible, setModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [selectedLang, setSelectedLang] = useState<"en" | "ar">(
    i18n.language.startsWith("ar") ? "ar" : "en",
  );

  const handleDeletePress = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleDelete = async () => {
    setModalVisible(false);
    try {
      await requestOtpMutation.mutateAsync();
      setOtpCode("");
      setOtpError("");
      setOtpModalVisible(true);
    } catch (error: any) {
      const msg = error?.response?.data?.message?.en || error?.message || "Failed to send OTP";
      showToast(isArabic ? "خطأ" : "Error", msg, undefined, "error");
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode.trim()) {
      setOtpError(isArabic ? "يرجى إدخال رمز التحقق" : "Please enter the OTP code");
      return;
    }
    setOtpError("");

    try {
      await confirmDeleteMutation.mutateAsync(otpCode.trim());
      dispatch(clearAuth());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        })
      );
      showToast(
        isArabic ? "تم حذف الحساب" : "Account Deleted",
        isArabic ? "تم حذف حسابك بنجاح" : "Your account has been successfully deleted",
        undefined,
        "success"
      );
    } catch (error: any) {
      setOtpError(error?.friendlyMessage || error?.message || (isArabic ? "رمز تحقق غير صالح" : "Invalid or expired OTP"));
    }
  };

  const handleLanguageSelect = async (lang: "en" | "ar") => {
    setLangModalVisible(false);
    if (lang === selectedLang) return;

    await AsyncStorage.setItem("user-language", lang);

    await i18n.changeLanguage(lang);

    try {
      await Updates.reloadAsync();
    } catch (_) {}
  };

  const isOtpLoading = requestOtpMutation.isPending || confirmDeleteMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackBtn />
            </TouchableOpacity>
            <GradientText text={t("settings")} textStyle={styles.title} />
          </View>
        </View>

        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileSettings")}>
            <SettingCard title={t("profile")} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ShippingAddress")}>
            <SettingCard title={t("shippingAddress")} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("AboutUs")}>
            <SettingCard title={t("aboutUs")} />
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.CardContainer}>
              <Text style={styles.textStyle}>{t("notifications")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setLangModalVisible(true)}>
            <SettingCard
              title={t("language")}
              language={selectedLang === "ar" ? t("arabic") : t("english")}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.containerBtn}>
          <GradientButton text={t("contactWithUs")} onPress={() => { navigation.navigate("ContactUs"); }} />

          <TouchableOpacity style={{ width: "100%" }} onPress={handleDeletePress}>
            <LinearGradient
              colors={["#E41818", "#7E0D0D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>{t("deleteAccount")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalBackground}>
            <DeleteAccountModal
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          </View>
        </Modal>

        <Modal
          visible={otpModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setOtpModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.otpOverlay}
            activeOpacity={1}
            onPress={() => !isOtpLoading && setOtpModalVisible(false)}
          >
            <View style={styles.otpCard}>
              <Text style={styles.otpTitle}>
                {isArabic ? "تأكيد حذف الحساب" : "Confirm Account Deletion"}
              </Text>
              <Text style={styles.otpSubtitle}>
                {isArabic
                  ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى إدخاله أدناه."
                  : "A verification code has been sent to your email. Please enter it below."}
              </Text>

              <TextInput
                style={styles.otpInput}
                placeholder={isArabic ? "رمز التحقق" : "OTP Code"}
                placeholderTextColor={lightColors.inputPlaceholder}
                value={otpCode}
                onChangeText={(text) => { setOtpCode(text); setOtpError(""); }}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isOtpLoading}
              />
              {otpError ? <Text style={styles.otpError}>{otpError}</Text> : null}

              <TouchableOpacity
                style={[styles.otpSubmitBtn, isOtpLoading && { opacity: 0.6 }]}
                onPress={handleOtpSubmit}
                disabled={isOtpLoading}
              >
                {isOtpLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.otpSubmitText}>
                    {isArabic ? "تأكيد الحذف" : "Confirm Deletion"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.otpCancelBtn}
                onPress={() => setOtpModalVisible(false)}
                disabled={isOtpLoading}
              >
                <Text style={styles.otpCancelText}>
                  {isArabic ? "إلغاء" : "Cancel"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={langModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLangModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.langOverlay}
            activeOpacity={1}
            onPress={() => setLangModalVisible(false)}
          >
            <View style={styles.langCard}>
              <Text style={styles.langTitle}>{t("language")}</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleLanguageSelect("en")}
              >
                <View
                  style={[
                    styles.langOption,
                    selectedLang === "en" && styles.langOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      selectedLang === "en" && styles.langOptionTextActive,
                    ]}
                  >
                    English
                  </Text>
                  {selectedLang === "en" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={scale(22)}
                      color="#47C0D2"
                    />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleLanguageSelect("ar")}
              >
                <View
                  style={[
                    styles.langOption,
                    selectedLang === "ar" && styles.langOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      selectedLang === "ar" && styles.langOptionTextActive,
                    ]}
                  >
                    العربية
                  </Text>
                  {selectedLang === "ar" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={scale(22)}
                      color="#47C0D2"
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
    padding: scale(10),
    paddingTop: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    flexDirection: "row",
  },
  title: {
    fontSize: scale(26),
    marginStart: scale(16),
  },
  content: {
    marginTop: verticalScale(20),
  },
  CardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: lightColors.hint,
    marginBottom: verticalScale(18),
  },
  textStyle: {
    fontSize: scale(16),
    color: lightColors.primary,
    fontWeight: 400,
    fontFamily: "Poppins-Regular",
  },
  containerBtn: {
    marginTop: verticalScale(40),
    paddingHorizontal: scale(20),
    gap: verticalScale(12),
  },
  deleteBtn: {
    width: "100%",
    height: verticalScale(48),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    fontSize: scale(16),
    fontWeight: "600",
    color: lightColors.white,
    fontFamily: "Poppins-SemiBold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  otpOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
  },
  otpCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: scale(20),
    padding: scale(24),
    alignItems: "center",
  },
  otpTitle: {
    fontSize: scale(18),
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
    color: lightColors.primary,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  otpSubtitle: {
    fontSize: scale(13),
    color: lightColors.subtitle,
    textAlign: "center",
    marginBottom: verticalScale(20),
    lineHeight: scale(20),
    fontFamily: "Poppins-Regular",
  },
  otpInput: {
    width: "100%",
    height: verticalScale(48),
    borderWidth: 1.5,
    borderColor: lightColors.border,
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    fontSize: scale(20),
    letterSpacing: scale(8),
    textAlign: "center",
    color: lightColors.primary,
    fontFamily: "Inter-Bold",
  },
  otpError: {
    color: "#EF4444",
    fontSize: scale(13),
    marginTop: verticalScale(8),
    textAlign: "center",
  },
  otpSubmitBtn: {
    width: "100%",
    backgroundColor: "#E41818",
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  otpSubmitText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
    fontFamily: "Inter-Bold",
  },
  otpCancelBtn: {
    marginTop: verticalScale(10),
    padding: scale(12),
  },
  otpCancelText: {
    fontSize: scale(15),
    color: lightColors.subtitle,
  },
  langOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
  },
  langCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: scale(20),
    padding: scale(24),
  },
  langTitle: {
    fontSize: scale(18),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
    marginBottom: verticalScale(16),
    textAlign: "center",
  },
  langOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    marginBottom: verticalScale(8),
    borderWidth: 1.5,
    borderColor: "#F0F2F6",
  },
  langOptionActive: {
    borderColor: "#47C0D2",
    backgroundColor: "rgba(71, 192, 210, 0.06)",
  },
  langOptionText: {
    fontSize: scale(16),
    fontFamily: "Poppins-Medium",
    color: lightColors.subtitle,
  },
  langOptionTextActive: {
    color: lightColors.primary,
    fontFamily: "Poppins-SemiBold",
  },
});
