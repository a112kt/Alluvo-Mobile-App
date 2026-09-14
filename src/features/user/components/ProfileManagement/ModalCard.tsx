import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { scale } from "react-native-size-matters";
import SettingIcon from "../SettingIcon";
import Logout from "./LogoutBtn";
import { lightColors } from "../../../../../theme";
import GradientText from "../../../../Components/GradientText";
import { NavigationProp, useNavigation, CommonActions } from "@react-navigation/native";
import { UserStackParamList } from "../../../../Navigation/types";
import { useAppDispatch } from "../../../../Redux/store";
import { clearAuth } from "../../../../Redux/slices/authSlice";


const ModalCard = () => {
  let navigation = useNavigation<NavigationProp<any>>()
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: lightColors.white }]}>
      <TouchableOpacity onPress={()=>navigation.navigate('Settings')} style={[styles.setting, { borderColor: lightColors.iconGray }]}>
        <GradientText text="Settings" textStyle={{fontSize:scale(20)}}/>
        <SettingIcon />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logout}>
        <Text style={styles.logoutTxt} >LogOut</Text>
        <Logout />
      </TouchableOpacity>
    </View>
  );
};


export default ModalCard;

const styles = StyleSheet.create({
  container: {
    width: scale(180),
    height: scale(100),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(12),
  },
  setting: {
    flexDirection: "row",
    gap: scale(4),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    width: "88%",
    padding: scale(5),
  },
  logout: {
    flexDirection: "row",
    gap: scale(4),
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(6),
  },
  logoutTxt:{
    fontSize:scale(20),
    color:'#F40000',
  }

});
