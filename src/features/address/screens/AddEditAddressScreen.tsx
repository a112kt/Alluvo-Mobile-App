import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
  Animated,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../Navigation/types";
import { Address, AddressFormErrors, ValidationError } from "../types";
import { addAddress, updateAddress } from "../api";
import BackBtn from "../../user/components/ProfileManagement/BackBtn";
import { showToast } from "../../../services/toastService";
import { useTranslation } from "react-i18next";
import COUNTRIES, { DEFAULT_COUNTRY, getCountryByName, parsePhoneNumber, Country } from "../data/countries";

const AddEditAddressScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const route = useRoute<RouteProp<UserStackParamList, "AddAddress">>();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const existingAddress = route.params?.address;
  const isEditing = !!existingAddress;

  const scrollRef = useRef<ScrollView>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    city: "",
    street: "",
    building: "",
    floor: "",
    apartment: "",
    postcode: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState<AddressFormErrors>({});

  const formToApiMap: Record<string, string> = {
    lastName: "shippingLastName",
    building: "shippingBuilding",
    floor: "shippingFloor",
    apartment: "shippingApartment",
  };

  const apiToFormMap: Record<string, string> = {};
  for (const [formKey, apiKey] of Object.entries(formToApiMap)) {
    apiToFormMap[apiKey] = formKey;
  }

  useEffect(() => {
    if (existingAddress) {
      const phoneStr = existingAddress.phoneNumber || "";
      const parsed = parsePhoneNumber(phoneStr);
      const matchedCountry =
        (existingAddress.country
          ? getCountryByName(existingAddress.country)
          : undefined) || parsed.country || DEFAULT_COUNTRY;

      setSelectedCountry(matchedCountry);
      setForm({
        name: existingAddress.name || "",
        lastName: existingAddress.lastName || "",
        phoneNumber: parsed.localNumber,
        country: matchedCountry.name,
        city: existingAddress.city || "",
        street: existingAddress.street || "",
        building: existingAddress.building || "",
        floor: existingAddress.floor || "",
        apartment: existingAddress.apartment || "",
        postcode: existingAddress.postcode || "",
        isDefault: existingAddress.isDefault || false,
      });
    }
  }, [existingAddress]);

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (typeof value === "string" && errors[field as keyof AddressFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: AddressFormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = isArabic ? "الاسم الأول مطلوب" : "First name is required";
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = isArabic ? "اسم العائلة مطلوب" : "Last name is required";
    }
    const localDigits = form.phoneNumber.replace(/\D/g, "");
    if (!localDigits) {
      newErrors.phoneNumber = isArabic ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (localDigits.length < 6) {
      newErrors.phoneNumber = isArabic ? "رقم الهاتف غير صالح" : "Invalid phone number";
    }
    if (!form.country.trim()) {
      newErrors.country = isArabic ? "البلد مطلوب" : "Country is required";
    }
    if (!form.city.trim()) {
      newErrors.city = isArabic ? "المدينة مطلوبة" : "City is required";
    }
    if (!form.street.trim()) {
      newErrors.street = isArabic ? "الشارع مطلوب" : "Street is required";
    }
    if (!form.building.trim()) {
      newErrors.building = isArabic ? "رقم المبنى مطلوب" : "Building is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, phoneNumber: digitsOnly }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setForm((prev) => ({ ...prev, country: country.name }));
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: undefined }));
    }
    setShowCountryPicker(false);
  };

  const buildPayload = (): Record<string, any> => {
    const payload: Record<string, any> = {};
    for (const [key, value] of Object.entries(form)) {
      const apiKey = formToApiMap[key] || key;
      if (key === "phoneNumber") {
        const localDigits = (value as string).replace(/\D/g, "");
        payload[apiKey] = `${selectedCountry.code}${localDigits}`;
      } else {
        payload[apiKey] = typeof value === "string" ? value.trim() : value;
      }
    }
    return payload;
  };

  const mapBackendErrors = (backendErrors: ValidationError[]) => {
    const fieldErrors: AddressFormErrors = {};
    const unmappedErrors: string[] = [];
    const lang = isArabic ? "ar" : "en";

    for (const err of backendErrors) {
      const backendField = err.field;
      const lowerField = backendField.toLowerCase();
      let matched = false;

      const foundApiKey = Object.keys(apiToFormMap).find(
        (k) => k.toLowerCase() === lowerField
      );
      if (foundApiKey) {
        const formField = apiToFormMap[foundApiKey] as keyof AddressFormErrors;
        (fieldErrors as any)[formField] = err[lang] || err.en;
        matched = true;
      }

      if (!matched) {
        const directMatch = Object.keys(form).find(
          (k) => k.toLowerCase() === lowerField
        );
        if (directMatch) {
          (fieldErrors as any)[directMatch] = err[lang] || err.en;
          matched = true;
        }
      }

      if (!matched) {
        unmappedErrors.push(err[lang] || err.en);
      }
    }

    return { fieldErrors, unmappedErrors };
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = buildPayload();

      let response;
      if (isEditing && existingAddress?.id) {
        response = await updateAddress(existingAddress.id, payload);
      } else {
        response = await addAddress(payload);
      }

      if (response.success) {
        showToast(
          isEditing
            ? (isArabic ? "تم التحديث" : "Updated")
            : (isArabic ? "تمت الإضافة" : "Added"),
          response.message?.[isArabic ? "ar" : "en"] ||
            (isEditing
              ? (isArabic ? "تم تحديث العنوان بنجاح" : "Address updated successfully")
              : (isArabic ? "تم إضافة العنوان بنجاح" : "Address added successfully")),
          undefined,
          "success"
        );
        navigation.goBack();
      } else if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
        const { fieldErrors, unmappedErrors } = mapBackendErrors(response.errors);
        setErrors(fieldErrors);
        if (unmappedErrors.length > 0) {
          showToast(
            isArabic ? "خطأ في التحقق" : "Validation Error",
            unmappedErrors.join("\n"),
            undefined,
            "error"
          );
        }
      } else {
        showToast(
          isArabic ? "خطأ" : "Error",
          response.message?.[isArabic ? "ar" : "en"] || "Invalid Data",
          undefined,
          "error"
        );
      }
    } catch (error: any) {
      const serverErrors = error?.response?.data?.errors;
      if (serverErrors && Array.isArray(serverErrors) && serverErrors.length > 0) {
        const { fieldErrors, unmappedErrors } = mapBackendErrors(serverErrors);
        setErrors(fieldErrors);
        if (unmappedErrors.length > 0) {
          showToast(
            isArabic ? "خطأ في التحقق" : "Validation Error",
            unmappedErrors.join("\n"),
            undefined,
            "error"
          );
        }
      } else {
        const msg = error?.response?.data?.message?.[isArabic ? "ar" : "en"] || error?.message || "Something went wrong";
        showToast(
          isArabic ? "خطأ" : "Error",
          typeof msg === "string" ? msg : "Invalid Data",
          undefined,
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const textAlign = isArabic ? "right" : "left";

  const renderField = (
    label: string,
    field: keyof typeof form,
    options?: {
      placeholder?: string;
      keyboardType?: "default" | "phone-pad" | "numeric";
      required?: boolean;
      half?: boolean;
      multiline?: boolean;
    }
  ) => {
    const hasError = !!errors[field as keyof AddressFormErrors];
    return (
      <View style={[options?.half ? styles.halfField : styles.fullField]}>
        <Text style={[styles.label, { textAlign }]}>
          {label}
          {options?.required && <Text style={styles.required}> *</Text>}
        </Text>
        <TextInput
          style={[
            styles.input,
            { textAlign },
            hasError && styles.inputError,
            options?.multiline && styles.inputMultiline,
          ]}
          placeholder={options?.placeholder || label}
          placeholderTextColor={lightColors.inputPlaceholder}
          value={String(form[field])}
          onChangeText={(text) => updateField(field, text)}
          keyboardType={options?.keyboardType || "default"}
          editable={!isSubmitting}
          multiline={options?.multiline}
          numberOfLines={options?.multiline ? 3 : 1}
        />
        {hasError && (
          <Text style={[styles.errorText, { textAlign }]}>
            {errors[field as keyof AddressFormErrors]}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          disabled={isSubmitting}
        >
          <BackBtn />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing
            ? (isArabic ? "تعديل العنوان" : "Edit Address")
            : (isArabic ? "إضافة عنوان" : "Add Address")}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.row}>
              {renderField(
                isArabic ? "الاسم الأول" : "First Name",
                "name",
                { placeholder: isArabic ? "الاسم الأول" : "First Name", required: true, half: true }
              )}
              {renderField(
                isArabic ? "اسم العائلة" : "Last Name",
                "lastName",
                { placeholder: isArabic ? "اسم العائلة" : "Last Name", required: true, half: true }
              )}
            </View>

            <View style={styles.fullField}>
              <Text style={[styles.label, { textAlign }]}>
                {isArabic ? "رقم الهاتف" : "Phone Number"}
                <Text style={styles.required}> *</Text>
              </Text>
              <View style={[styles.phoneInputRow, errors.phoneNumber && styles.inputError]}>
                <TouchableOpacity
                  style={styles.countryCodePicker}
                  onPress={() => setShowCountryPicker(true)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                  <Text style={styles.dialCode}>{selectedCountry.code}</Text>
                </TouchableOpacity>
                <TextInput
                  style={[
                    styles.phoneInputField,
                    { textAlign },
                  ]}
                  placeholder={isArabic ? "رقم الهاتف" : "Phone number"}
                  placeholderTextColor={lightColors.inputPlaceholder}
                  value={form.phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  editable={!isSubmitting}
                  maxLength={15}
                />
              </View>
              {errors.phoneNumber && (
                <Text style={[styles.errorText, { textAlign }]}>
                  {errors.phoneNumber}
                </Text>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={[styles.label, { textAlign }]}>
                  {isArabic ? "البلد" : "Country"}
                  <Text style={styles.required}> *</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.countrySelector,
                    errors.country && styles.inputError,
                  ]}
                  onPress={() => setShowCountryPicker(true)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.countrySelectorFlag}>
                    {selectedCountry.flag}
                  </Text>
                  <Text
                    style={[
                      styles.countrySelectorText,
                      !form.country && styles.countrySelectorPlaceholder,
                      { textAlign },
                    ]}
                    numberOfLines={1}
                  >
                    {form.country ||
                      (isArabic ? "اختر البلد" : "Select country")}
                  </Text>
                </TouchableOpacity>
                {errors.country && (
                  <Text style={[styles.errorText, { textAlign }]}>
                    {errors.country}
                  </Text>
                )}
              </View>
              {renderField(
                isArabic ? "المدينة" : "City",
                "city",
                { placeholder: isArabic ? "المدينة" : "City", required: true, half: true }
              )}
            </View>

            {renderField(
              isArabic ? "الشارع" : "Street",
              "street",
              { placeholder: isArabic ? "الشارع" : "Street", required: true }
            )}

            <View style={styles.row}>
              {renderField(
                isArabic ? "رقم المبنى" : "Building",
                "building",
                { placeholder: isArabic ? "رقم المبنى" : "Building", required: true, half: true }
              )}
              {renderField(
                isArabic ? "الطابق" : "Floor",
                "floor",
                { placeholder: isArabic ? "رقم الطابق" : "Floor", half: true }
              )}
            </View>

            <View style={styles.row}>
              {renderField(
                isArabic ? "الشقة" : "Apartment",
                "apartment",
                { placeholder: isArabic ? "رقم الشقة" : "Apartment", half: true }
              )}
              {renderField(
                isArabic ? "الرمز البريدي" : "Postal Code",
                "postcode",
                { placeholder: isArabic ? "الرمز البريدي" : "Postal Code", half: true, keyboardType: "numeric" }
              )}
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { textAlign }]}>
                {isArabic ? "تعيين كعنوان افتراضي" : "Set as default address"}
              </Text>
              <Switch
                value={form.isDefault}
                onValueChange={(val) => updateField("isDefault", val)}
                trackColor={{ false: lightColors.border, true: lightColors.secondary + "50" }}
                thumbColor={form.isDefault ? lightColors.secondary : "#f4f3f4"}
                disabled={isSubmitting}
              />
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={styles.stickyBottom}>
          <TouchableOpacity
            style={[styles.saveBtn, isSubmitting && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>
                {isEditing
                  ? (isArabic ? "حفظ التغييرات" : "Save Changes")
                  : (isArabic ? "إضافة العنوان" : "Add Address")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showCountryPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {isArabic ? "اختر البلد" : "Select Country"}
              </Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Text style={styles.pickerCloseBtn}>
                  {isArabic ? "إغلاق" : "Close"}
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    selectedCountry.code === item.code &&
                      styles.countryItemSelected,
                  ]}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <Text style={styles.countryItemName}>{item.name}</Text>
                  <Text style={styles.countryItemCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddEditAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  backBtn: {
    padding: scale(4),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: lightColors.primary,
    fontFamily: "Inter-SemiBold",
  },
  headerRight: {
    width: scale(44),
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(4),
    flexGrow: 1,
  },
  section: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: scale(10),
  },
  fullField: {
    marginBottom: verticalScale(14),
  },
  halfField: {
    flex: 1,
    marginBottom: verticalScale(14),
  },
  label: {
    fontSize: scale(13),
    color: lightColors.primary,
    marginBottom: verticalScale(6),
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  required: {
    color: lightColors.textDanger,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: scale(14),
    paddingVertical: Platform.OS === "ios" ? verticalScale(13) : verticalScale(10),
    fontSize: scale(15),
    color: lightColors.primary,
    fontFamily: "Inter",
    borderWidth: 1,
    borderColor: lightColors.border + "50",
    minHeight: verticalScale(48),
  },
  inputMultiline: {
    minHeight: verticalScale(80),
    textAlignVertical: "top",
    paddingTop: verticalScale(12),
  },
  inputError: {
    borderColor: lightColors.textDanger,
    borderWidth: 1.5,
  },
  errorText: {
    color: lightColors.textDanger,
    fontSize: scale(11),
    marginTop: verticalScale(4),
    fontFamily: "Inter",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: lightColors.border + "50",
    marginBottom: verticalScale(14),
  },
  switchLabel: {
    fontSize: scale(14),
    color: lightColors.primary,
    flex: 1,
    fontFamily: "Inter-Medium",
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightColors.border + "50",
    minHeight: verticalScale(48),
    overflow: "hidden",
  },
  countryCodePicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    borderRightWidth: 1,
    borderRightColor: lightColors.border + "50",
    backgroundColor: lightColors.bgLight,
    gap: scale(4),
  },
  flagEmoji: {
    fontSize: scale(18),
  },
  dialCode: {
    fontSize: scale(14),
    fontWeight: "500",
    color: lightColors.primary,
    fontFamily: "Inter-Medium",
  },
  phoneInputField: {
    flex: 1,
    paddingHorizontal: scale(14),
    fontSize: scale(15),
    color: lightColors.primary,
    fontFamily: "Inter",
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: scale(14),
    minHeight: verticalScale(48),
    borderWidth: 1,
    borderColor: lightColors.border + "50",
    gap: scale(8),
  },
  countrySelectorFlag: {
    fontSize: scale(18),
  },
  countrySelectorText: {
    flex: 1,
    fontSize: scale(15),
    color: lightColors.primary,
    fontFamily: "Inter",
  },
  countrySelectorPlaceholder: {
    color: lightColors.inputPlaceholder,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderTopStartRadius: scale(20),
    borderTopEndRadius: scale(20),
    maxHeight: "60%",
    paddingBottom: verticalScale(20),
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border + "50",
  },
  pickerTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    color: lightColors.primary,
    fontFamily: "Inter-SemiBold",
  },
  pickerCloseBtn: {
    color: lightColors.secondary,
    fontWeight: "500",
    fontSize: scale(14),
    fontFamily: "Inter-Medium",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border + "25",
  },
  countryItemSelected: {
    backgroundColor: lightColors.secondary + "10",
  },
  countryItemFlag: {
    fontSize: scale(22),
    marginEnd: scale(12),
  },
  countryItemName: {
    flex: 1,
    fontSize: scale(16),
    color: lightColors.primary,
    fontFamily: "Inter",
  },
  countryItemCode: {
    fontSize: scale(14),
    color: lightColors.hint,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  bottomPadding: {
    height: verticalScale(90),
  },
  stickyBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: lightColors.bgLight,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: Platform.OS === "ios" ? verticalScale(30) : verticalScale(14),
    borderTopWidth: 1,
    borderTopColor: lightColors.border + "25",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtn: {
    backgroundColor: lightColors.primary,
    paddingVertical: verticalScale(15),
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
});
