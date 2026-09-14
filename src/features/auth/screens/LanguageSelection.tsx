import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../../src/i18n";

const LanguageSelection = () => {
  const navigation = useNavigation<any>();
  const [selectedLang, setSelectedLang] = useState<"en" | "ar">("en");

  const handleContinue = async () => {
    await AsyncStorage.setItem("user-language", selectedLang);
    await i18n.changeLanguage(selectedLang);
    navigation.replace('role');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Language</Text>
        <Text style={styles.subtitle}>الرجاء اختيار لغتك المفضلة</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* English Card */}
        <TouchableOpacity
          onPress={() => setSelectedLang("en")}
          style={[
            styles.card,
            selectedLang === "en" ? styles.activeCard : null,
          ]}
        >
          <Text style={[styles.cardTitle, selectedLang === "en" ? styles.activeText : null]}>
            English
          </Text>
        </TouchableOpacity>

        {/* Arabic Card */}
        <TouchableOpacity
          onPress={() => setSelectedLang("ar")}
          style={[
            styles.card,
            selectedLang === "ar" ? styles.activeCard : null,
          ]}
        >
          <Text style={[styles.cardTitle, selectedLang === "ar" ? styles.activeText : null]}>
            العربية
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        style={styles.continueButtonWrapper}
      >
        <LinearGradient
          colors={["#47C0D2", "#1B2351"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>
            {selectedLang === "ar" ? "متابعة" : "Continue"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },
  header: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  title: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: lightColors.primary,
    marginBottom: verticalScale(5),
  },
  subtitle: {
    fontSize: scale(16),
    color: "#666",
  },
  cardsContainer: {
    gap: verticalScale(20),
    marginBottom: verticalScale(40),
  },
  card: {
    width: "100%",
    paddingVertical: verticalScale(20),
    backgroundColor: "#fff",
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeCard: {
    borderColor: "#47C0D2",
    backgroundColor: "#f0fbef", // Very light tint of brand/concept
  },
  cardTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: lightColors.primary,
  },
  activeText: {
    color: "#47C0D2",
  },
  continueButtonWrapper: {
    width: "100%",
    alignItems: "stretch",
  },
  continueButton: {
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: scale(18),
    fontWeight: "bold",
  },
});
