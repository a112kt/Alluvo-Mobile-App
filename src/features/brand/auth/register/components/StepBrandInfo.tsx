import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import { TextInput } from "react-native-paper";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { Formik } from "formik";
import { brandInfoSchema } from "../schemas";
import * as ImagePicker from "expo-image-picker";
import AuthInput from "../../../../../Components/inputs/AuthInput";
import { Ionicons } from "@expo/vector-icons";
import {
  useBrandAddInfo,
} from "../hooks/useBrandRegister";
import { getCountries, getCities, getCategories, uploadMedia } from "../services";

interface StepBrandInfoProps {
  token: string;
  onSuccess: () => void;
}

interface OptionItem {
  id: string | number;
  name: string;
}

const EMPLOYEE_OPTIONS = [
  "1-10",
  "21-30",
  "31-40",
  "41-50",
  "50+",
];

export default function StepBrandInfo({ token, onSuccess }: StepBrandInfoProps) {
  const { mutate, isPending, error, isSuccess } = useBrandAddInfo();

  const [countries, setCountries] = useState<OptionItem[]>([]);
  const [cities, setCities] = useState<OptionItem[]>([]);
  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);

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
    loadCountries();
    loadCategories();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      const list = res?.data || res || [];
      setCountries(list.map((c: any) => ({ id: c.id || c.name, name: c.name })));
    } catch (err) {

    }
  };

  const loadCities = async (countryName: string) => {
    try {
      const res = await getCities(countryName);
      const list = res?.data || res || [];
      setCities(list.map((c: any) => ({ id: c.id || c.name, name: c.name })));
    } catch (err) {

    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      const list = res?.data || res || [];
      setCategories(list.map((c: any) => ({ id: c.id || c.name, name: c.name })));
    } catch (err) {

    }
  };

  const pickLogo = async (setFieldValue: (field: string, value: any) => void) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Camera roll permission is required.");
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
      setSelectedLogo(uri);
      setFieldValue("brandLogo", uri);
    }
  };

  const renderDropdown = (
    label: string,
    value: string,
    options: OptionItem[],
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    onSelect: (name: string) => void,
    placeholder: string,
  ) => (
    <>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.dropdown} onPress={onOpen}>
        <Text style={[styles.dropdownText, !value && { color: "#A0A5B0" }]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </Pressable>
      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{label}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item.name);
                    onClose();
                  }}
                >
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );

  const initialValues = {
    brandName: "",
    brandLogo: "",
    category: "",
    country: "",
    city: "",
    district: "",
    numberOfEmployees: "",
    aboutBrand: "",
    brandPolicy: "",
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={brandInfoSchema}
        validateOnMount={true}
        onSubmit={async (values) => {
          try {
            let logoUrl = "";
            if (values.brandLogo) {
              setUploadingLogo(true);
              logoUrl = await uploadMedia(values.brandLogo);
              setUploadingLogo(false);
            }
            mutate({
              DisplayName: values.brandName,
              Description: values.aboutBrand,
              LogoUrl: logoUrl,
              ReturnPolicyAsHtml: values.brandPolicy,
              category: values.category,
              country: values.country,
              Governorate: values.city,
              district: values.district,
              numberOfEmployees: values.numberOfEmployees,
            });
          } catch (err) {
            setUploadingLogo(false);

          }
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
          const disabled = !isValid || !dirty || isPending || uploadingLogo;
          return (
            <>
              <Text style={styles.sectionTitle}>Brand Information</Text>

              <AuthInput
                label="Brand Name"
                placeholder="Enter brand name"
                value={values.brandName}
                onChangeText={handleChange("brandName")}
                onBlur={handleBlur("brandName")}
                error={errors.brandName}
                touched={touched.brandName}
              />

              <Text style={styles.fieldLabel}>Brand Logo</Text>
              <Pressable
                onPress={() => pickLogo(setFieldValue)}
                style={[
                  styles.logoUpload,
                  selectedLogo && { borderColor: lightColors.primary, borderStyle: "solid" },
                ]}
              >
                {selectedLogo ? (
                  <Image
                    source={{ uri: selectedLogo }}
                    style={styles.logoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Ionicons name="cloud-upload-outline" size={32} color={lightColors.primary} />
                    <Text style={styles.logoHint}>Upload Brand Logo</Text>
                  </View>
                )}
              </Pressable>
              {touched.brandLogo && errors.brandLogo && (
                <Text style={styles.fieldError}>{errors.brandLogo as string}</Text>
              )}

              {renderDropdown(
                "Category",
                values.category,
                categories,
                showCategoryPicker,
                () => setShowCategoryPicker(true),
                () => setShowCategoryPicker(false),
                (val) => setFieldValue("category", val),
                "Select category",
              )}
              {touched.category && errors.category && (
                <Text style={styles.fieldError}>{errors.category as string}</Text>
              )}

              {renderDropdown(
                "Country",
                values.country,
                countries,
                showCountryPicker,
                () => setShowCountryPicker(true),
                () => setShowCountryPicker(false),
                (val) => {
                  setFieldValue("country", val);
                  setFieldValue("city", "");
                  loadCities(val);
                },
                "Select country",
              )}
              {touched.country && errors.country && (
                <Text style={styles.fieldError}>{errors.country as string}</Text>
              )}

              {renderDropdown(
                "City",
                values.city,
                cities,
                showCityPicker,
                () => setShowCityPicker(true),
                () => setShowCityPicker(false),
                (val) => setFieldValue("city", val),
                "Select city",
              )}
              {touched.city && errors.city && (
                <Text style={styles.fieldError}>{errors.city as string}</Text>
              )}

              <AuthInput
                label="District"
                placeholder="Enter district"
                value={values.district}
                onChangeText={handleChange("district")}
                onBlur={handleBlur("district")}
                error={errors.district}
                touched={touched.district}
              />

              {renderDropdown(
                "Number of Employees",
                values.numberOfEmployees,
                EMPLOYEE_OPTIONS.map((e) => ({ id: e, name: e })),
                showEmployeePicker,
                () => setShowEmployeePicker(true),
                () => setShowEmployeePicker(false),
                (val) => setFieldValue("numberOfEmployees", val),
                "Select range",
              )}
              {touched.numberOfEmployees && errors.numberOfEmployees && (
                <Text style={styles.fieldError}>{errors.numberOfEmployees as string}</Text>
              )}

              <Text style={styles.fieldLabel}>About Brand</Text>
              <TextInput
                placeholder="Tell us about your brand"
                value={values.aboutBrand}
                onChangeText={handleChange("aboutBrand")}
                onBlur={handleBlur("aboutBrand")}
                mode="flat"
                multiline
                numberOfLines={4}
                style={styles.textArea}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                contentStyle={styles.textAreaContent}
                theme={{
                  colors: {
                    placeholder: "#A0A5B0",
                    text: "#111",
                    primary: lightColors.primary,
                  },
                }}
              />
              {touched.aboutBrand && errors.aboutBrand && (
                <Text style={styles.fieldError}>{errors.aboutBrand as string}</Text>
              )}

              <Text style={styles.fieldLabel}>Brand Policy</Text>
              <TextInput
                placeholder="Enter your return policy and terms"
                value={values.brandPolicy}
                onChangeText={handleChange("brandPolicy")}
                onBlur={handleBlur("brandPolicy")}
                mode="flat"
                multiline
                numberOfLines={3}
                style={styles.textArea}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                contentStyle={styles.textAreaContent}
                theme={{
                  colors: {
                    placeholder: "#A0A5B0",
                    text: "#111",
                    primary: lightColors.primary,
                  },
                }}
              />
              {touched.brandPolicy && errors.brandPolicy && (
                <Text style={styles.fieldError}>{errors.brandPolicy as string}</Text>
              )}

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
                  {isPending || uploadingLogo ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.submitBtnText}>
                        {"  "}{uploadingLogo ? "Uploading..." : "Saving..."}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.submitBtnText}>Continue</Text>
                  )}
                </View>
              </Pressable>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorMsg}>
                    {(error as any)?.message || "Failed to save brand info"}
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
  sectionTitle: {
    fontSize: s(18),
    fontWeight: "700",
    fontFamily: "Inter",
    color: lightColors.primary,
    marginBottom: vs(12),
    marginTop: vs(4),
  },
  fieldLabel: {
    fontSize: s(14),
    fontWeight: "600",
    marginBottom: s(6),
    fontFamily: "Inter",
    color: lightColors.primary,
  },
  fieldError: {
    color: "#EF4444",
    fontSize: s(12),
    fontFamily: "Inter",
    fontWeight: "500",
    marginTop: s(4),
    marginBottom: s(8),
  },
  logoUpload: {
    width: "100%",
    height: vs(120),
    borderRadius: s(16),
    borderWidth: 1.5,
    borderColor: lightColors.inputBorder || "#E4E8EE",
    borderStyle: "dashed",
    backgroundColor: lightColors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: s(16),
    overflow: "hidden",
  },
  logoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoHint: {
    marginTop: 8,
    fontSize: s(13),
    color: "#6B7280",
    fontFamily: "Inter",
    fontWeight: "500",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    height: s(52),
    borderRadius: s(16),
    borderWidth: 1.5,
    borderColor: lightColors.inputBorder || "#E4E8EE",
    backgroundColor: lightColors.inputBackground,
    paddingHorizontal: s(16),
    marginBottom: s(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownText: {
    flex: 1,
    fontSize: s(15),
    fontFamily: "Inter",
    color: "#111",
  },
  dropdownArrow: {
    fontSize: s(10),
    color: "#6B7280",
  },
  textArea: {
    backgroundColor: lightColors.inputBackground,
    borderRadius: s(16),
    borderWidth: 1.5,
    borderColor: lightColors.inputBorder || "#E4E8EE",
    marginBottom: s(4),
  },
  textAreaContent: {
    fontFamily: "Inter",
    fontSize: s(15),
    paddingHorizontal: s(16),
    paddingVertical: s(8),
    minHeight: vs(80),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: lightColors.inputBackground,
    borderTopStartRadius: s(20),
    borderTopEndRadius: s(20),
    maxHeight: "60%",
    paddingBottom: vs(20),
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: s(20),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border || "#E4E8EE",
  },
  pickerTitle: {
    fontSize: s(18),
    fontWeight: "600",
    fontFamily: "Inter",
    color: lightColors.primary,
  },
  closeBtn: {
    fontWeight: "600",
    fontSize: s(14),
    fontFamily: "Inter",
    color: lightColors.primary,
  },
  optionItem: {
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.bgLight || "#F5F5F5",
  },
  optionText: {
    fontSize: s(16),
    fontFamily: "Inter",
    color: "#111",
  },
});
