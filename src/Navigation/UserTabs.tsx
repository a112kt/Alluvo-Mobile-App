import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated as RNAnimated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";

import HomeScreen, {
  homeTabPressHandler,
} from "../features/user/screens/HomeUser";
import ExploreScreen, {
  exploreTabPressHandler,
} from "../features/user/screens/ReelsUser";
import ShopScreen from "../features/user/screens/shop";
import ProfileScreen from "../features/user/screens/ProfileManagement/ProfileUser";
import WishlistScreen from "../features/user/screens/WishlistUser";
import SwitchToBrandScreen from "../features/user/screens/SwitchToBrandScreen";
import BrandsScreen from "../features/user/screens/OurBrands";
import { useCart } from "../features/user/hooks/useCart";
import {
  TAB_BAR_HEIGHT,
  SWITCH_MODE_ICON,
  TabBar,
} from "./SharedTabBar";

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Home: { focused: "home", unfocused: "home-outline" },
  Shop: { focused: "cart", unfocused: "cart-outline" },
  Brands: { focused: "business", unfocused: "business-outline" },
  Explore: { focused: "play", unfocused: "play-outline" },
  Wishlist: { focused: "heart", unfocused: "heart-outline" },
  Profile: { focused: "person", unfocused: "person-outline" },
  SwitchMode: SWITCH_MODE_ICON,
};

function CartBadge() {
  const { data: cartData } = useCart();
  const brands = cartData?.data?.brands ?? [];
  const count = brands.length === 1 ? brands[0].items.length : 0;
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    if (count > 0) {
      RNAnimated.sequence([
        RNAnimated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 120,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  if (count <= 0) return null;

  return (
    <RNAnimated.View
      style={[styles.badge, { transform: [{ scale: scaleAnim }] }]}
    >
      <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
    </RNAnimated.View>
  );
}

function UserTabBar({ state, descriptors, navigation }: any) {
  return (
    <TabBar
      state={state}
      descriptors={descriptors}
      navigation={navigation}
      tabIcons={TAB_ICONS}
      onTabPress={(routeName: string) => {
        if (routeName === "Home") homeTabPressHandler?.();
        if (routeName === "Explore") exploreTabPressHandler?.();
      }}
    />
  );
}

export { TAB_BAR_HEIGHT };

export default function UserTabs() {
  const roles = useSelector((state: RootState) => state.auth.roles);
  const isInUserMode = useSelector((state: RootState) => state.auth.isInUserMode);
  const isBrandOwner = roles?.includes("Brand Owner");

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <UserTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: TAB_BAR_HEIGHT },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Brands" component={BrandsScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {isBrandOwner && isInUserMode && <Tab.Screen name="SwitchMode" component={SwitchToBrandScreen} />}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -14,
    right: -14,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
});
