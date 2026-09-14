import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import { lightColors } from "../../../theme";

interface SimpleInputProps {
  label: string;
  placeholder: string;
  style?: ViewStyle;
}

const SimpleInput: React.FC<SimpleInputProps> = ({
  label,
  placeholder,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: lightColors.primary }]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        mode="flat"
        style={[styles.input, { backgroundColor: lightColors.inputBackground }]}
        underlineColor="transparent"
        contentStyle={styles.inputContent}
        theme={{
          colors: {
            placeholder: "#999",
            text: "#111",
          },
        }}
      />
    </View>
  );
};

export default SimpleInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 6,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14,
  },
  input: {
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 6,
    fontFamily: "Inter",
  },
  inputContent: {
    height: 42,
    paddingHorizontal: 6,
    fontFamily: "Inter",
  },
});
