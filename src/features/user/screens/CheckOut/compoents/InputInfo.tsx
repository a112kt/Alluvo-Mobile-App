import { StyleSheet, Text, View, TextInput as RNTextInput, TouchableOpacity } from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  rightIcon?: React.ReactNode;
  editable?: boolean;
  onPress?: () => void;
};

const InputInfo = ({
  label,
  placeholder,
  value,
  onChangeText,
  rightIcon,
  editable = true,
  onPress,
}: Props) => {
  const isDropdown = !!onPress;

  const renderInput = () => (
    <RNTextInput
      style={styles.rnInput}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      editable={editable && !isDropdown}
      pointerEvents={isDropdown ? "none" : "auto"}
      selectionColor="#47C0D2"
    />
  );

  if (isDropdown) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={styles.inputWrapper}
        >
          {renderInput()}
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {renderInput()}
        {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
      </View>
    </View>
  );
};

export default InputInfo;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 15,
  },

  label: {
    fontWeight: "600",
    fontSize: s(12),
    color: "rgba(27, 35, 81, 1)",
    marginBottom: 6,
    fontFamily: "Inter",
  },

  inputWrapper: {
    borderRadius: 9,
    height: vs(40),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(71,192,210,0.2)",
    paddingHorizontal: s(12),
  },

  rnInput: {
    flex: 1,
    height: "100%",
    fontSize: s(12),
    fontFamily: "Inter",
    color: "rgba(27, 35, 81, 1)",
    padding: 0,
  },

  rightIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginStart: s(6),
  },
});
