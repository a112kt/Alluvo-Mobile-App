import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import GradientText from "../../../../../Components/GradientText";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { backArrow } from "../../../../../assests/icons/AllIcon";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const Header = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backBtn, { left: 10 }]}
      >
        <SvgXml xml={backArrow} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <GradientText text={t("checkout")} textStyle={styles.text} />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },

  backBtn: {
    position: "absolute",
    zIndex: 2,
  },

  titleContainer: {
    alignItems: "center",
  },

  text: {
    fontSize: s(22),
    fontWeight: "600",
  },
});
