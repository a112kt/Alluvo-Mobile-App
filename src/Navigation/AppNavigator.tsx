import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import BrandStack from "./BrandStack";
import SplashScreen from "../Screens/SplashScreen";
import BrandGuard from "../features/brand/navigation/guards/BrandGuard";
import { RootStackParamList } from "./types";
import { useSignalR } from "../features/user/hooks/useSignalR";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(props: any) {
  useSignalR();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="User" component={UserStack} />
      <Stack.Screen
        name="Brand"
        component={BrandStack}
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
    </Stack.Navigator>
  );
}
