import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BrandTabs from "./BrandTabs";
import ReelAnalyticsScreen from "../screens/ReelAnalytics/ReelAnalyticsScreen";
import ReelDetailAnalyticsScreen from "../screens/ReelAnalytics/ReelDetailAnalyticsScreen";
import RecordReelScreen from "../screens/Reels/RecordReelScreen";
import AddReelScreen from "../screens/Reels/AddReelScreen";
import ReelDetailScreen from "../screens/Reels/ReelDetailScreen";
import EditReelScreen from "../screens/Reels/EditReelScreen";
import Notifications from "../../user/screens/Notifications";
import BrandMessagesScreen from "../screens/Messages/BrandMessagesScreen";
import BrandChatScreen from "../screens/Messages/BrandChatScreen";
import { ChatProvider } from "../../user/chatContext/ChatContext";

const Stack = createNativeStackNavigator<any>();

export default function BrandRootStack() {
  return (
    <ChatProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BrandTabs" component={BrandTabs} />
        <Stack.Screen name="ReelAnalytics" component={ReelAnalyticsScreen} />
        <Stack.Screen name="ReelDetailAnalytics" component={ReelDetailAnalyticsScreen} />
        <Stack.Screen name="RecordReel" component={RecordReelScreen} />
        <Stack.Screen name="AddReel" component={AddReelScreen} />
        <Stack.Screen name="ReelDetail" component={ReelDetailScreen} />
        <Stack.Screen name="EditReel" component={EditReelScreen} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="BrandMessages" component={BrandMessagesScreen} />
        <Stack.Screen name="BrandChat" component={BrandChatScreen} />
      </Stack.Navigator>
    </ChatProvider>
  );
}
