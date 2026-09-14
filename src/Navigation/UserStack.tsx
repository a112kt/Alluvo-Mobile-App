import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserTabs from "./UserTabs";
import { UserStackParamList } from "./types";
import BrandProfile from "../features/user/screens/BrandProfile";
import Settings from "../features/user/screens/ProfileManagement/Settings";
import ProfileSettings from "../features/user/screens/ProfileManagement/ProfileSettings";
import PaymentMethod from "../features/user/screens/ProfileManagement/PaymentMethod";
import AddressListScreen from "../features/address/screens/AddressListScreen";
import AddEditAddressScreen from "../features/address/screens/AddEditAddressScreen";
import Notifications from "../features/user/screens/Notifications";
import ContactUs from "../features/user/screens/ContactUs";
import SearchExplore from "../features/user/screens/Explore";
import ReelsScreen from "../features/user/screens/ReelsUser";
import BrandReelsScreen from "../features/user/screens/BrandReels";
import TopBrandsView from "../features/user/screens/TopBrandsView";
import ProductDetails from "../features/user/screens/ProductDetails";
import Checkout from "../features/user/screens/CheckOut/Checkout";
import CartUser from "../features/user/screens/CartUser";
import ChatScreen from "../features/user/screens/ChatScreen";
import ChatMessagesScreen from "../features/user/screens/ChatMessagesScreen";
import OrderDetailsScreen from "../features/user/screens/ProfileManagement/OrderDetailsScreen";
import AboutUs from "../features/user/screens/ProfileManagement/AboutUs";
import { ChatProvider } from "../features/user/chatContext/ChatContext";

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
  return (
    <ChatProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserTabs" component={UserTabs} />
        <Stack.Screen name="BrandProfile" component={BrandProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="ShippingAddress" component={AddressListScreen} />
        <Stack.Screen name="AddAddress" component={AddEditAddressScreen} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
        <Stack.Screen name="SearchExplore" component={SearchExplore} />
        <Stack.Screen name="ReelDetail" component={ReelsScreen} />
        <Stack.Screen name="TopBrandsView" component={TopBrandsView} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Checkout"  component={Checkout}/>
        <Stack.Screen name="Cart" component={CartUser} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ChatMessages" component={ChatMessagesScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
      </Stack.Navigator>
    </ChatProvider>
  );
}

