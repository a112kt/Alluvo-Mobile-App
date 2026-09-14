import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { Card } from "react-native-paper";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";

interface SettingsProps {
  title: string;
  language?: string;
}
const nextBtnSvg = `<svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_806_7633)">
<path d="M1.0618 17.4135C0.940451 17.5348 0.788767 17.5955 0.621912 17.5955C0.455057 17.5955 0.303373 17.5348 0.182024 17.4135C-0.0606747 17.1708 -0.0606747 16.7764 0.182024 16.5337L7.91797 8.79774L0.182024 1.0618C-0.0606747 0.8191 -0.0606747 0.424719 0.182024 0.182022C0.424719 -0.0606741 0.819101 -0.0606741 1.0618 0.182022L9.23763 8.35786C9.48033 8.60055 9.48033 8.99494 9.23763 9.23763L1.0618 17.4135Z" fill="url(#paint0_linear_806_7633)"/>
</g>
<defs>
<linearGradient id="paint0_linear_806_7633" x1="0" y1="8.79774" x2="9.41966" y2="8.79774" gradientUnits="userSpaceOnUse">
<stop stop-color="#47C0D2"/>
<stop offset="1" stop-color="#1B2351"/>
</linearGradient>
<clipPath id="clip0_806_7633">
<rect width="9.41966" height="17.5955" fill="white"/>
</clipPath>
</defs>
</svg>
`;
const SettingCard: React.FC<SettingsProps> = ({ title, language  }) => {
  return (
    <View style={styles.CardContainer}>
      <Text style={styles.textStyle}>{title}</Text>
      <View style={styles.rightContainer}>
        {language && (
          <Text style={styles.languageText}>{language}</Text>
        )}
        <SvgXml xml={nextBtnSvg} />
      </View>
    </View>
  );
};

export default SettingCard;

const styles = StyleSheet.create({
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
    marginBottom:verticalScale(18)
  },
  textStyle: {
    fontSize: scale(16),
    color: lightColors.primary,
    fontWeight: 400,
    fontFamily: "Poppins-Regular",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },

  languageText: {
    fontSize: scale(14),
    color: lightColors.hint,
    fontFamily: "Poppins-Regular",
  },
});

