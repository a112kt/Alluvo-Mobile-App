import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BrandRootStack from "../features/brand/navigation/BrandRootStack";
import { BrandStackParamList } from "./types";

const Stack = createNativeStackNavigator<any>();

export default function BrandStack(props: any) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrandRoot" component={BrandRootStack} />
    </Stack.Navigator>
  );
}
