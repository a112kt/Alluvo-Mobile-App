import { StyleSheet, Text, View, Modal, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import InputInfo from "./InputInfo";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native";
import { downArrowXml } from "../../../../../assests/icons/AllIcon";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";

const DownArrow = () => (
  <View style={styles.iconContainer}>
    <SvgXml xml={downArrowXml} />
  </View>
);

interface DeliverySectionProps {
  country: string;
  setCountry: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  governorate: string;
  setGovernorate: (val: string) => void;
  postcode: string;
  setPostcode: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  saveInfo: boolean;
  setSaveInfo: (val: boolean) => void;
  building?: string;
  setBuilding?: (val: string) => void;
  floor?: string;
  setFloor?: (val: string) => void;
  apartment?: string;
  setApartment?: (val: string) => void;
}

const COUNTRIES = [
  "Egypt",
  "Saudi Arabia",
  "United Arab Emirates",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman"
];

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Dakahlia",
  "Gharbia",
  "Sharqia",
  "Monufia",
  "Beheira",
  "Fayoum",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan"
];

const DeliverySection = ({
  country,
  setCountry,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  address,
  setAddress,
  city,
  setCity,
  governorate,
  setGovernorate,
  postcode,
  setPostcode,
  phoneNumber,
  setPhoneNumber,
  saveInfo,
  setSaveInfo,
  building,
  setBuilding,
  floor,
  setFloor,
  apartment,
  setApartment,
}: DeliverySectionProps) => {
  const { t } = useTranslation();
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [govModalVisible, setGovModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: lightColors.primary }]}>{t("delivery")}</Text>

      <InputInfo
        label={t("country")}
        placeholder={t("egypt")}
        value={country}
        onPress={() => setCountryModalVisible(true)}
        rightIcon={<DownArrow />}
      />

      <InputInfo 
        label={t("firstName")} 
        placeholder={t("required")} 
        value={firstName}
        onChangeText={setFirstName}
      />

      <InputInfo 
        label={t("lastName")} 
        placeholder={t("required")} 
        value={lastName}
        onChangeText={setLastName}
      />

      <InputInfo 
        label={t("address")} 
        placeholder={t("required")} 
        value={address}
        onChangeText={setAddress}
      />

      <InputInfo 
        label={t("city")} 
        placeholder={t("required")} 
        value={city}
        onChangeText={setCity}
      />

      <InputInfo
        label={t("governorate")}
        placeholder={t("cairo")}
        value={governorate}
        onPress={() => setGovModalVisible(true)}
        rightIcon={<DownArrow />}
      />

      <InputInfo 
        label={t("postcode") || "Postcode (Optional)"} 
        placeholder={t("optional") || "Optional"} 
        value={postcode}
        onChangeText={setPostcode}
      />

      <InputInfo 
        label={t("building") || "Building (Optional)"} 
        placeholder={t("optional") || "Optional"} 
        value={building}
        onChangeText={setBuilding}
      />

      <InputInfo 
        label={t("floor") || "Floor (Optional)"} 
        placeholder={t("optional") || "Optional"} 
        value={floor}
        onChangeText={setFloor}
      />

      <InputInfo 
        label={t("apartment") || "Apartment (Optional)"} 
        placeholder={t("optional") || "Optional"} 
        value={apartment}
        onChangeText={setApartment}
      />

      <InputInfo 
        label={t("phoneNumber")} 
        placeholder={t("required")} 
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        activeOpacity={0.7}
        onPress={() => setSaveInfo(!saveInfo)}
      >
        <View style={[styles.checkboxBox, { backgroundColor: lightColors.white }]}>
          {saveInfo && (
            <SvgXml
              xml={`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${lightColors.primary}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`}
            />
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          {t("saveInfo")}
        </Text>
      </TouchableOpacity>

      <View style={[styles.shippingBar, { backgroundColor: lightColors.secondary + '33' }]}>
        <Text style={styles.shippingText}>{t("shipping")}</Text>
        <Text style={[styles.shippingPrice, { color: lightColors.primary }]}>EGP 60.00</Text>
      </View>

      {/* Country Modal */}
      <Modal
        visible={countryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
          <BlurView intensity={20} tint="dark" style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: lightColors.white }]}>
              <Text style={[styles.modalTitle, { color: lightColors.primary }]}>{t("selectCountry") || "Select Country"}</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item}
              style={{ maxHeight: vs(250), width: "100%" }}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.optionItem,
                    pressed && { backgroundColor: "#F3F4F6" },
                    country === item && { backgroundColor: lightColors.secondary + '26' }
                  ]}
                  onPress={() => {
                    setCountry(item);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, country === item && [styles.selectedOptionText, { color: lightColors.secondary }]]}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setCountryModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>{t("cancel") || "Cancel"}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Governorate Modal */}
      <Modal
        visible={govModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGovModalVisible(false)}
      >
          <BlurView intensity={20} tint="dark" style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: lightColors.white }]}>
              <Text style={[styles.modalTitle, { color: lightColors.primary }]}>{t("selectGovernorate") || "Select Governorate"}</Text>
            <FlatList
              data={GOVERNORATES}
              keyExtractor={(item) => item}
              style={{ maxHeight: vs(250), width: "100%" }}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.optionItem,
                    pressed && { backgroundColor: "#F3F4F6" },
                    governorate === item && { backgroundColor: lightColors.secondary + '26' }
                  ]}
                  onPress={() => {
                    setGovernorate(item);
                    setGovModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, governorate === item && [styles.selectedOptionText, { color: lightColors.secondary }]]}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setGovModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>{t("cancel") || "Cancel"}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default DeliverySection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: s(16),
    marginTop: s(20),
  },
  title: {
    fontSize: s(20),
    fontWeight: "700",
    marginBottom: s(10),
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginEnd: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: s(15),
    marginBottom: s(20),
  },
  checkboxBox: {
    width: s(20),
    height: s(20),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: s(4),
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: s(12),
    color: "#666",
    marginStart: s(10),
  },
  shippingBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: s(15),
    borderRadius: s(8),
    marginBottom: s(20),
  },
  shippingText: {
    fontSize: s(14),
    color: "#666",
  },
  shippingPrice: {
    fontSize: s(14),
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: s(24),
  },
  modalCard: {
    width: "100%",
    borderRadius: s(16),
    padding: s(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: s(16),
    fontWeight: "700",
    marginBottom: vs(15),
    fontFamily: "Inter",
  },
  optionItem: {
    width: "100%",
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderRadius: s(8),
    marginBottom: vs(4),
  },
  optionText: {
    fontSize: s(14),
    color: "#4B5563",
    fontFamily: "Inter",
  },
  selectedOptionText: {
    fontWeight: "700",
  },
  closeBtn: {
    marginTop: vs(15),
    paddingVertical: vs(10),
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  closeBtnText: {
    fontSize: s(14),
    fontWeight: "600",
    color: "#EF4444",
    fontFamily: "Inter",
  },
});
