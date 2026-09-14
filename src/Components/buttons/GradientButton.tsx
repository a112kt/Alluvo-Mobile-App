import React from "react";
import { Text, View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { verticalScale } from "react-native-size-matters";

interface GradientButtonProps {
  text?: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: "default" | "regular";
}

const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onPress,
  style,
  disabled = false,
  children,
  variant = "default"
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonWrapper, style]}>
      {variant === "default" ? (
        <LinearGradient
          colors={["#1B2351", "#47C0D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {children ? children : <Text style={styles.text}>{text}</Text>}
        </LinearGradient>) : (<View style={styles.gradient}>
          {children ? children : <Text style={styles.text}>{text}</Text>}
        </View>)

      }
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    width: "100%",
    height: verticalScale(44),
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter-Bold",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
  },
});
