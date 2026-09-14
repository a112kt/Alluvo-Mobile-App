import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated } from "react-native";
import { TextInput } from "react-native-paper";
import { s, vs } from "react-native-size-matters";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { lightColors } from "../../../theme";

interface DateInputProps {
  label?: string;
  value?: string;
  onDateChange: (date: string) => void;
  error?: string;
  touched?: boolean;
  maximumDate?: Date;
}

const DateInput: React.FC<DateInputProps> = ({
  label = "Birthday",
  value,
  onDateChange,
  error,
  touched,
  maximumDate = new Date(),
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused || showDatePicker ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, showDatePicker]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [lightColors.inputBorder || "#E4E8EE", lightColors.textInfo || lightColors.primary],
  });

  const formatDateToDDMMYYYY = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateToYYYYMMDD = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      onDateChange(formatDateToYYYYMMDD(selectedDate));
    }
  };

  const displayDate = value ? formatDateToDDMMYYYY(new Date(value)) : "";

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: lightColors.primary }]}>{label}</Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: lightColors.inputBackground,
            borderColor,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowDatePicker(true)}
          style={styles.inputTouchable}
          onPressIn={() => setIsFocused(true)}
          onPressOut={() => setIsFocused(false)}
        >
          <TextInput
            placeholder="DD/MM/YYYY"
            value={displayDate}
            mode="flat"
            style={styles.input}
            placeholderTextColor="#A0A5B0"
            contentStyle={styles.inputContent}
            editable={false}
            pointerEvents="none"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{
              colors: {
                placeholder: "#A0A5B0",
                text: "#111",
                primary: "transparent",
              },
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assests/imgs/calender.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </Animated.View>

      {touched && error && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={onChange}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DateInput;

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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: s(16),
    height: s(52),
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputTouchable: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "transparent",
    height: "100%",
  },
  inputContent: {
    fontFamily: "Inter",
    fontSize: s(15),
    paddingHorizontal: s(16),
  },
  iconContainer: {
    paddingHorizontal: s(14),
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  icon: {
    width: s(20),
    height: s(20),
    resizeMode: "contain",
    tintColor: "#6B7280",
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
});
