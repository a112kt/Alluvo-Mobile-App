import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Animated } from "react-native";
import { TextInput } from "react-native-paper";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../theme";

export interface Country {
  name: string;
  code: string;
  flag: string;
}

const ARAB_COUNTRIES: Country[] = [
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "UAE", code: "+971", flag: "🇦🇪" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
];

interface PhoneInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: any) => void;
  error?: string;
  touched?: boolean;
  style?: any;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  maxLength?: number;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  style,
  selectedCountry,
  onCountryChange,
  maxLength = 11,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [lightColors.inputBorder || "#E4E8EE", lightColors.textInfo || lightColors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: lightColors.primary }]}>{label}</Text>
      )}
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: lightColors.inputBackground,
            borderColor,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.countryPicker, { borderRightColor: lightColors.border || "#E4E8EE" }]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.code}>{selectedCountry.code}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Enter phone number"
          value={value}
          onChangeText={(text) => {
            const digitsOnly = text.replace(/\D/g, "");
            onChangeText(digitsOnly);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          maxLength={maxLength}
          keyboardType="phone-pad"
          mode="flat"
          style={styles.input}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          selectionColor={lightColors.primary}
          cursorColor={lightColors.primary}
          contentStyle={styles.inputContent}
          theme={{
            colors: {
              placeholder: "#A0A5B0",
              text: "#111",
              primary: lightColors.primary,
            },
          }}
        />
      </Animated.View>
      {touched && error && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal visible={showPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerContainer, { backgroundColor: lightColors.inputBackground }]}>
            <View style={[styles.pickerHeader, { borderBottomColor: lightColors.border }]}>
              <Text style={[styles.pickerTitle, { color: lightColors.title }]}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)} activeOpacity={0.7}>
                <Text style={[styles.closeBtn, { color: lightColors.primary }]}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={ARAB_COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryItem, { borderBottomColor: lightColors.bgLight }]}
                  onPress={() => {
                    onCountryChange(item);
                    setShowPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={[styles.countryName, { color: lightColors.title }]}>{item.name}</Text>
                  <Text style={[styles.countryCode, { color: lightColors.body }]}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: s(16),
  },
  label: {
    fontSize: s(14),
    fontWeight: "600",
    marginBottom: s(8),
    fontFamily: "Inter",
  },
  inputWrapper: {
    flexDirection: "row",
    borderRadius: s(16),
    height: s(52),
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(14),
    borderRightWidth: 1,
  },
  flag: {
    fontSize: s(20),
    marginRight: s(6),
  },
  code: {
    fontSize: s(14),
    fontWeight: "600",
    color: "#111",
    fontFamily: "Inter",
  },
  dropdownArrow: {
    fontSize: s(8),
    color: "#6B7280",
    marginLeft: s(4),
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    height: s(52),
  },
  inputContent: {
    paddingHorizontal: s(12),
    fontFamily: "Inter",
    fontSize: s(15),
    justifyContent: "center",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: s(6),
  },
  errorText: {
    color: "#EF4444",
    fontSize: s(12),
    fontFamily: "Inter",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    borderTopStartRadius: s(20),
    borderTopEndRadius: s(20),
    maxHeight: "60%",
    paddingBottom: vs(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: s(20),
    borderBottomWidth: 1,
  },
  pickerTitle: {
    fontSize: s(18),
    fontWeight: "600",
    fontFamily: "Inter",
  },
  closeBtn: {
    fontWeight: "600",
    fontSize: s(14),
    fontFamily: "Inter",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(16),
    borderBottomWidth: 1,
  },
  countryName: {
    flex: 1,
    fontSize: s(16),
    marginStart: s(12),
    fontFamily: "Inter",
  },
  countryCode: {
    fontSize: s(14),
    fontWeight: "500",
    fontFamily: "Inter",
  },
});
