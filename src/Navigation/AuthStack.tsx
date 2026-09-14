import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/screens/LoginScreen";
import RegisterScreen from "../features/auth/screens/SignupScreen";
import ForgetPassword from "../features/auth/screens/ForgetPassword";
import role from "../features/auth/screens/role";
import VerifyAccount from "../features/auth/screens/VerifyAccount";
import ResetPassword from "../features/auth/screens/ResetPassword";
import Interests from "../features/auth/screens/Interest";
import LanguageSelection from "../features/auth/screens/LanguageSelection";
import BrandLoginScreen from "../features/brand/auth/screens/BrandLoginScreen";
import BrandRegisterScreen from "../features/brand/auth/screens/BrandRegisterScreen";
import GuestGuard from "../features/brand/navigation/guards/GuestGuard";
import { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<any>();

export default function AuthStack(props: any) {
  return (
    <GuestGuard>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LanguageSelection">
        <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
        <Stack.Screen name="role" component={role} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="BrandLogin" component={BrandLoginScreen} />
        <Stack.Screen name="BrandRegister" component={BrandRegisterScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="forgetPassword" component={ForgetPassword} />
        <Stack.Screen name="verifyAccount" component={VerifyAccount} />
        <Stack.Screen name="resetPassword" component={ResetPassword} />
        <Stack.Screen name="interest" component={Interests} />
      </Stack.Navigator>
    </GuestGuard>
  );
}
