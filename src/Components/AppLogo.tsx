import React from "react";
import { View, Image, StyleSheet, StyleProp, TextStyle } from "react-native";
import GradientText from "./GradientText";
import { scale } from "react-native-size-matters";

interface AppLogoProps {
  size?: number;
  textStyle?: StyleProp<TextStyle>;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = scale(39), textStyle }) => {
  return (
    <View style={[styles.logoWrapper, { flexDirection: "row" }]}>
      {/* <Image
        source={require("../assests/imgs/AlluvoLogo.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      /> */}
      <GradientText 
        text="Alluvo" 
        textStyle={[
            styles.logoText, 
            textStyle, 
            { marginStart: scale(6) }
        ]} 
      />
    </View>
  );
};

export default AppLogo;

const styles = StyleSheet.create({
  logoWrapper: {
    alignItems: "center",
  },
  logoText: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "400",
    fontSize: scale(24),
    letterSpacing: 0,
  },
});
