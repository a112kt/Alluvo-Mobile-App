import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { s, vs } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

interface SocialAuthGroupProps {
  onGooglePress?: () => void;
  onTiktokPress?: () => void;
}

const SocialAuthGroup: React.FC<SocialAuthGroupProps> = ({
  onGooglePress,
  onTiktokPress,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.socialContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.socialButton,
          pressed && styles.socialButtonPressed,
        ]}
        onPress={onGooglePress}
      >
        <Image
          source={require("../../assests/imgs/google.png")}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>{t("signInWithGoogle")}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.socialButton,
          pressed && styles.socialButtonPressed,
        ]}
        onPress={onTiktokPress}
      >
        <Image
          source={require("../../assests/imgs/Tiktok.png")}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>{t("signInWithTiktok")}</Text>
      </Pressable>
    </View>
  );
};

export default SocialAuthGroup;

const styles = StyleSheet.create({
  socialContainer: {
    marginTop: vs(16),
    width: "100%",
    gap: vs(12),
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: vs(52),
    borderWidth: 1,
    borderColor: "#E4E8EE",
    borderRadius: s(14),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  socialButtonPressed: {
    backgroundColor: "#F9FAFB",
    shadowOpacity: 0.02,
    elevation: 1,
  },
  socialIcon: {
    width: s(22),
    height: s(22),
    marginRight: s(10),
  },
  socialText: {
    fontSize: s(15),
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#374151",
    letterSpacing: 0.2,
  },
});
