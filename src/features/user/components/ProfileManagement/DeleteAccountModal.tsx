import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { SvgXml } from "react-native-svg";

interface DeleteAccountModalProp{
  onCancel:any;
  onDelete:any;
}
const markSvg =`<svg width="2" height="13" viewBox="0 0 2 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="2" height="9" rx="1" fill="white"/>
<rect y="11" width="2" height="2" rx="1" fill="white"/>
</svg>
`
const DeleteAccountModal:React.FC<DeleteAccountModalProp> = ({ onCancel, onDelete }) => {
  return (
    <View style={[styles.modalContainer, { backgroundColor: lightColors.white }]}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: lightColors.white }]}>
        <View style={styles.iconContainer2}>
          <SvgXml xml={markSvg}/>
        </View>
      </View>

      {/* Text */}
      <Text style={[styles.title, { color: lightColors.primary }]}>You are going to delete your account</Text>
      <Text style={[styles.subtitle, { color: lightColors.subtitle }]}>You won't be able to restore your data</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={{ flex: 1, marginEnd: 10 }} onPress={onCancel}>
          <LinearGradient
            colors={["#47C0D2", "#1B2351"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={[styles.buttonText, { color: lightColors.white }]}>Cancel</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1 }} onPress={onDelete}>
          <LinearGradient
            colors={["#E41818", "#7E0D0D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={[styles.buttonText, { color: lightColors.white }]}>Delete</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteAccountModal;

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: scale(80),
    height:verticalScale(80),
   position:'absolute',
   borderRadius:scale(45),
   justifyContent:'center',
   alignItems:'center',
   zIndex:99,
   marginTop:scale(-40),
  },
  iconContainer2:{
    backgroundColor: "#E41818",
    width:scale(22),
    height:verticalScale(22),
    borderRadius:scale(50),
    padding:scale(10),
    justifyContent:'center',
    alignItems:'center'
  
  },
  icon: { 
    fontWeight: "bold",
    fontSize: scale(9),

  },
  title: {
    fontSize: scale(20),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    paddingTop:verticalScale(30),
    flexShrink:2
  },
  subtitle: {
    fontSize: scale(13),
    textAlign: "center",
    marginBottom: verticalScale(30),
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(12),
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "300",
    fontSize: scale(16),
  },
});
