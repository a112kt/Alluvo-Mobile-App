import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BrandHomeScreen from "../screens/Home/BrandHomeScreen";
import ReelsListScreen from "../screens/Reels/ReelsListScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import SwitchToUserScreen from "../../user/screens/SwitchToUserScreen";
import {
  TAB_BAR_HEIGHT,
  SWITCH_MODE_ICON,
  TabBar,
} from "../../../Navigation/SharedTabBar";

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Home: { focused: "home", unfocused: "home-outline" },
  Reels: { focused: "play-circle", unfocused: "play-circle-outline" },
  Profile: { focused: "business", unfocused: "business-outline" },
  SwitchMode: SWITCH_MODE_ICON,
};

function BrandTabBar({ state, descriptors, navigation }: any) {
  return (
    <TabBar
      state={state}
      descriptors={descriptors}
      navigation={navigation}
      tabIcons={TAB_ICONS}
    />
  );
}

export { TAB_BAR_HEIGHT };

export default function BrandTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <BrandTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: TAB_BAR_HEIGHT },
      }}
    >
      <Tab.Screen name="Home" component={BrandHomeScreen} />
      <Tab.Screen name="Reels" component={ReelsListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="SwitchMode" component={SwitchToUserScreen} options={{ tabBarLabel: "Switch to User" }} />
    </Tab.Navigator>
  );
}
