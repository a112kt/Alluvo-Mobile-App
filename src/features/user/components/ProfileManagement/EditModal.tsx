import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { scale, verticalScale } from "react-native-size-matters";
import GradientButton from "../../../../Components/buttons/GradientButton";
import { lightColors } from "../../../../../theme";

interface EditModalProp {
  visible: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
}

const EditModal: React.FC<EditModalProp> = ({
  visible,
  onClose,
  title,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalWrapper}
      >
        <View style={[styles.modalContainer, { backgroundColor: lightColors.white }]}>
          <Text style={styles.title}>{title}</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(20) }}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: lightColors.primary }]}>Card Holder</Text>
              <TextInput style={[styles.input, { backgroundColor: lightColors.iconLight }]} placeholder="User Name" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: lightColors.primary }]}>Card Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: lightColors.iconLight }]}
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginEnd: scale(10) }]}>
                <Text style={[styles.label, { color: lightColors.primary }]}>Valid</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: lightColors.iconLight }]}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginStart: scale(10) }]}>
                <Text style={[styles.label, { color: lightColors.primary }]}>CVV</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: lightColors.iconLight }]}
                  placeholder="XXX"
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <GradientButton text="Save Changes" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    padding: scale(20),
    paddingBottom: verticalScale(30),
  },
  title: {
    fontSize: scale(20),
    fontWeight: "600",
    marginBottom: verticalScale(20),
  },
  inputGroup: {
    marginBottom: verticalScale(9),
  },
  label: {
    fontSize: scale(14),
    marginBottom: verticalScale(1),
  },
  input: {
    borderWidth: 0,
    borderColor: '#ced0d7ff',
    borderRadius: scale(10),
    padding: scale(12),
    fontSize: scale(14),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  confirmBtn: {
    marginTop: verticalScale(0),
  },
  cancelBtn: {
    marginTop: verticalScale(10),
    padding: scale(12),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelTxt: {
    fontSize: scale(15),
    color: "#444",
  },
});