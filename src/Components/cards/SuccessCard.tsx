import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import GradientButton from "../buttons/GradientButton";
import { RootStackParamList } from "../../Navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../Navigation/AuthStack";
type SuccessCardProps = {
  title?: string;
  subtitle?: string;
  onContinue?: () => void;
};
type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "resetPassword",
  "interest"
>;


export default function SuccessCard({
  title = "Account Created Successfully",
  subtitle,
  onContinue,
}: SuccessCardProps) {
  const Autnavigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: "#FEFEFE",
          width: 300,
          borderRadius: 16,
          paddingVertical: 32,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center", gap: 24 }}>
          <View
            style={{
              height: 140,
              width: 140,
              borderRadius: 70, 
              overflow: "hidden",
              backgroundColor: "#B4DBE180",
            }}
          >
            <Image
              source={require("../../assests/imgs/verification-success.png")}
              style={{ height: 101, width: 101, alignSelf: "center", marginTop: 20 }}
              resizeMode="contain"
            />
          </View>

          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontWeight: "500",
              fontSize: 16,
              color: "#1B2351",
            }}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 14,
                color: "#6B6B6B",
                textAlign: "center",
              }}
            >
              {subtitle}
            </Text>
          )}

          <GradientButton
            text="Next"
            onPress={() => {
              if (onContinue) onContinue();
              else  Autnavigation.navigate("interest");
            }}
          />

        </View>
      </View>
    </View>
  );
}
