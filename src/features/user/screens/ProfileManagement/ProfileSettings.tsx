import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/ProfileManagement/Header";
import { lightColors } from "../../../../../theme";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import SettingInput from "../../components/ProfileManagement/SettingInput";
import GradientButton from "../../../../Components/buttons/GradientButton";
import { editSVG } from "../../../../assests/icons/AllIcon";
import * as ImagePicker from "expo-image-picker";
import { useProfile, useUpdateProfile, useUpdatePassword, useUpdateProfileImage } from "../../hooks/UserProfile/useProfile";
import { ImageUploadData } from "../../services/Profile";
import { showToast } from "../../../../services/toastService";
import { createAudioPlayer } from "expo-audio";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const ProfileSettings = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const { data: profileResponse, isLoading: isProfileLoading } = useProfile();
  const profileData = profileResponse?.data;

  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();
  const updateProfileImageMutation = useUpdateProfileImage();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageUploadData | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (profileData) {
      setUsername(`${profileData.firstName || ""} ${profileData.lastName || ""}`.trim());
      setEmail(profileData.email || "");
      setPhoneNumber(profileData.phoneNumber || "");
    }
  }, [profileData]);

  const playSuccessSound = async () => {
    try {
      const player = createAudioPlayer(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav' }
      );
      player.play();
    } catch {}
  };

  const pickImageFromCamera = async () => {
    setShowImagePicker(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Camera access is needed to take a photo");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        fileName: (asset as any).fileName || "profile.jpg",
        mimeType: (asset as any).mimeType || "image/jpeg",
      });
    }
  };

  const pickImageFromGallery = async () => {
    setShowImagePicker(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Gallery access is needed to select a photo");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        fileName: (asset as any).fileName || "profile.jpg",
        mimeType: (asset as any).mimeType || "image/jpeg",
      });
    }
  };

  const removePhoto = () => {
    setShowImagePicker(false);
    setSelectedImage(null);
  };

  const getFriendlyMessage = (error: any) => {
    if (error?.friendlyMessage) return error.friendlyMessage;
    if (error?.message) return error.message;
    return isArabic ? "حدث خطأ ما" : "Something went wrong";
  };

  const validateForm = () => {
    let isValid = true;

    setUsernameError("");
    setEmailError("");
    setPhoneNumberError("");
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!username.trim()) {
      setUsernameError(isArabic ? "الاسم مطلوب" : "Name is required");
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError(isArabic ? "يجب أن يتكون الاسم من 3 أحرف على الأقل" : "Name must be at least 3 characters");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError(isArabic ? "البريد الإلكتروني مطلوب" : "Email is required");
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError(isArabic ? "صيغة البريد الإلكتروني غير صالحة" : "Invalid email format");
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      setPhoneNumberError(isArabic ? "رقم الهاتف مطلوب" : "Phone number is required");
      isValid = false;
    }

    if (showPasswordEdit) {
      if (!oldPassword) {
        setOldPasswordError(isArabic ? "كلمة المرور الحالية مطلوبة" : "Current password is required");
        isValid = false;
      }
      if (!newPassword) {
        setNewPasswordError(isArabic ? "كلمة المرور الجديدة مطلوبة" : "New password is required");
        isValid = false;
      } else if (newPassword.length < 6) {
        setNewPasswordError(isArabic ? "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل" : "Password must be at least 6 characters");
        isValid = false;
      }
      if (!confirmPassword) {
        setConfirmPasswordError(isArabic ? "تأكيد كلمة المرور مطلوب" : "Confirm password is required");
        isValid = false;
      } else if (newPassword !== confirmPassword) {
        setConfirmPasswordError(isArabic ? "كلمة المرور غير متطابقة" : "Passwords do not match");
        isValid = false;
      }
    }

    return isValid;
  };

  const isSaving = updateProfileMutation.isPending || updatePasswordMutation.isPending || updateProfileImageMutation.isPending;

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      const nameParts = username.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const profileResult = await updateProfileMutation.mutateAsync({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      if (showPasswordEdit && oldPassword && newPassword) {
        await updatePasswordMutation.mutateAsync({
          currentPassword: oldPassword,
          newPassword,
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordEdit(false);
      }

      let imageChanged = false;
      if (selectedImage) {
        await updateProfileImageMutation.mutateAsync({
          uri: selectedImage.uri,
          fileName: selectedImage.fileName,
          mimeType: selectedImage.mimeType,
        });
        setSelectedImage(null);
        imageChanged = true;
      }

      let successMsg = "";
      if (imageChanged) {
        successMsg = isArabic ? "تم تغيير الصورة بنجاح" : "Profile image updated successfully";
        await playSuccessSound();
      } else {
        const msg = profileResult?.message;
        successMsg = msg
          ? (typeof msg === "string" ? msg : (isArabic ? msg.ar || msg.en : msg.en))
          : (isArabic ? "تم تحديث البيانات بنجاح" : "Profile details updated successfully");
      }

      showToast(isArabic ? "نجاح" : "Success", successMsg, undefined, "success");
    } catch (error: any) {
      setUsernameError("");
      setEmailError("");
      setPhoneNumberError("");
      setOldPasswordError("");
      setNewPasswordError("");
      setConfirmPasswordError("");

      if (error instanceof TypeError) {
        showToast(
          isArabic ? "خطأ في الاتصال" : "Network Error",
          isArabic ? "يرجى التحقق من اتصال الإنترنت" : "Please check your internet connection.",
          undefined,
          "error"
        );
        return;
      }

      let apiResponse: any = null;
      try {
        if (error?.message) apiResponse = JSON.parse(error.message);
      } catch {}
      if (!apiResponse) apiResponse = error?.response?.data;

      if (apiResponse?.errors && Array.isArray(apiResponse.errors)) {
        let handled = false;
        for (const err of apiResponse.errors) {
          const errMsg = typeof err === "string" ? err : (isArabic ? err.ar || err.en : err.en);
          const field = err.field?.toLowerCase();
          handled = true;

          if (field === "firstname" || field === "lastname" || field === "name" || field === "username") {
            setUsernameError(errMsg);
          } else if (field === "email") {
            setEmailError(errMsg);
          } else if (field === "phonenumber" || field === "phone") {
            setPhoneNumberError(errMsg);
          } else if (field === "currentpassword" || field === "oldpassword" || field === "password") {
            setOldPasswordError(errMsg);
          } else if (field === "newpassword") {
            setNewPasswordError(errMsg);
          } else {
            showToast(isArabic ? "خطأ" : "Error", errMsg, undefined, "error");
          }
        }
        if (handled) return;
      }

      const errorMsg = getFriendlyMessage(error);
      showToast(isArabic ? "خطأ" : "Error", errorMsg, undefined, "error");
    }
  };

  const renderPasswordField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error: string,
    setError: (v: string) => void,
    showPassword: boolean,
    setShowPassword: (v: boolean) => void
  ) => (
    <View style={styles.passwordField}>
      <Text style={styles.passwordLabel}>{label}</Text>
      <View style={styles.passwordInputWrapper}>
        <SettingInput
          placeholder={label}
          placeholderTextColor="#535A65"
          value={value}
          onChangeText={(text) => { onChangeText(text); setError(""); }}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={lightColors.iconGray}
          />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header text={isArabic ? "ملفك الشخصي" : "Your Profile"} />

          {isProfileLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={lightColors.primary} />
            </View>
          ) : (
            <>
              <View style={styles.body}>
                <TouchableOpacity
                  style={styles.imgContainer}
                  onPress={() => setShowImagePicker(true)}
                  disabled={isSaving}
                >
                  <Image
                    style={styles.img}
                    source={
                      selectedImage
                        ? { uri: selectedImage.uri }
                        : profileData?.profileImageUrl
                        ? { uri: profileData.profileImageUrl }
                        : require("../../../../assests/imgs/ProfileImg.png")
                    }
                  />
                  {updateProfileImageMutation.isPending && (
                    <View style={styles.imageLoadingOverlay}>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                  <LinearGradient
                    colors={["#47C0D2", "#1B2351"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cricle}
                  >
                    <SvgXml xml={editSVG} />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <SettingInput
                    placeholder={isArabic ? "اسم المستخدم" : "UserName"}
                    placeholderTextColor="#1B2351"
                    value={username}
                    onChangeText={(text) => { setUsername(text); setUsernameError(""); }}
                  />
                  {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                  <SettingInput
                    placeholder="gmail@12.example"
                    placeholderTextColor="#1B2351"
                    value={email}
                    onChangeText={(text) => { setEmail(text); setEmailError(""); }}
                  />
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                  <SettingInput
                    placeholder="+20122235436"
                    placeholderTextColor="#1B2351"
                    value={phoneNumber}
                    onChangeText={(text) => { setPhoneNumber(text); setPhoneNumberError(""); }}
                  />
                  {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}

                  {!showPasswordEdit ? (
                    <SettingInput
                      placeholder="***********"
                      showEdit
                      onEditPress={() => setShowPasswordEdit(true)}
                      placeholderTextColor="#1B2351"
                      value="***********"
                      secureTextEntry
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.cancelPasswordBtn}
                        onPress={() => {
                          setShowPasswordEdit(false);
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setOldPasswordError("");
                          setNewPasswordError("");
                          setConfirmPasswordError("");
                        }}
                      >
                        <Text style={styles.cancelPasswordText}>
                          {isArabic ? "إلغاء تغيير كلمة المرور" : "Cancel password change"}
                        </Text>
                      </TouchableOpacity>

                      {renderPasswordField(
                        isArabic ? "كلمة المرور الحالية" : "Current Password",
                        oldPassword,
                        setOldPassword,
                        oldPasswordError,
                        setOldPasswordError,
                        showOldPassword,
                        setShowOldPassword
                      )}

                      {renderPasswordField(
                        isArabic ? "كلمة المرور الجديدة" : "New Password",
                        newPassword,
                        setNewPassword,
                        newPasswordError,
                        setNewPasswordError,
                        showNewPassword,
                        setShowNewPassword
                      )}

                      {renderPasswordField(
                        isArabic ? "تأكيد كلمة المرور" : "Confirm Password",
                        confirmPassword,
                        setConfirmPassword,
                        confirmPasswordError,
                        setConfirmPasswordError,
                        showConfirmPassword,
                        setShowConfirmPassword
                      )}
                    </>
                  )}
                </View>
              </View>

              <View style={styles.fixedBtnBox}>
                <GradientButton
                  text={
                    updateProfileMutation.isPending
                      ? (isArabic ? "جاري الحفظ..." : "Saving...")
                      : (isArabic ? "حفظ التغييرات" : "Save Changes")
                  }
                  onPress={isSaving ? undefined : handleSaveChanges}
                  style={isSaving ? { opacity: 0.6 } : undefined}
                  disabled={isSaving}
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showImagePicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.imagePickerOverlay}
          activeOpacity={1}
          onPress={() => setShowImagePicker(false)}
        >
          <View style={styles.imagePickerCard}>
            <Text style={styles.imagePickerTitle}>
              {isArabic ? "اختر صورة" : "Choose Photo"}
            </Text>
            <TouchableOpacity style={styles.imagePickerOption} onPress={pickImageFromCamera}>
              <Ionicons name="camera-outline" size={24} color={lightColors.primary} />
              <Text style={styles.imagePickerOptionText}>
                {isArabic ? "كاميرا" : "Camera"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePickerOption} onPress={pickImageFromGallery}>
              <Ionicons name="images-outline" size={24} color={lightColors.primary} />
              <Text style={styles.imagePickerOptionText}>
                {isArabic ? "المعرض" : "Gallery"}
              </Text>
            </TouchableOpacity>
            {(selectedImage || profileData?.profileImageUrl) && (
              <TouchableOpacity style={styles.imagePickerOption} onPress={removePhoto}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <Text style={[styles.imagePickerOptionText, { color: "#EF4444" }]}>
                  {isArabic ? "إزالة الصورة" : "Remove Photo"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.imagePickerCancel}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.imagePickerCancelText}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
  },
  imgContainer: {
    width: scale(92),
    alignSelf: 'flex-start',
  },
  img: {
    width: scale(92),
    height: scale(92),
    borderWidth: scale(6),
    borderRadius: scale(46),
    borderColor: lightColors.white,
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: scale(92),
    height: scale(92),
    borderRadius: scale(46),
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scale(6),
    borderColor: lightColors.white,
  },
  cricle: {
    width: scale(30),
    height: scale(30),
    borderWidth: scale(3),
    borderRadius: scale(15),
    borderColor: lightColors.white,
    position: "absolute",
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    marginTop: verticalScale(20),
  },
  inputContainer: {
    marginTop: verticalScale(20),
  },
  passwordField: {
    marginTop: verticalScale(4),
  },
  passwordLabel: {
    fontSize: scale(13),
    color: lightColors.primary,
    marginTop: verticalScale(8),
    marginBottom: verticalScale(2),
  },
  passwordInputWrapper: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: scale(12),
    top: "50%",
    transform: [{ translateY: -11 }],
    zIndex: 10,
    padding: scale(4),
  },
  cancelPasswordBtn: {
    marginBottom: verticalScale(8),
  },
  cancelPasswordText: {
    color: lightColors.textDanger,
    fontSize: scale(13),
    fontWeight: "500",
  },
  fixedBtnBox: {
    marginTop: verticalScale(30),
    paddingBottom: verticalScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(100),
  },
  errorText: {
    color: "red",
    fontSize: scale(12),
    marginTop: verticalScale(3),
    marginStart: scale(5),
  },
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  imagePickerCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: scale(20),
    paddingBottom: verticalScale(30),
  },
  imagePickerTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    color: lightColors.primary,
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  imagePickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
    gap: scale(12),
  },
  imagePickerOptionText: {
    fontSize: scale(16),
    color: lightColors.primary,
  },
  imagePickerCancel: {
    marginTop: verticalScale(16),
    paddingVertical: verticalScale(12),
    alignItems: "center",
  },
  imagePickerCancelText: {
    fontSize: scale(16),
    color: lightColors.subtitle,
  },
});
