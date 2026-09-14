import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { useDispatch } from "react-redux";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../../../Components/GradientText";
import GradientButton from "../../../Components/buttons/GradientButton";
import { lightColors } from "../../../../theme";
import { setUserMode } from "../../../Redux/slices/authSlice";
import { useFloatingTabBarPadding } from "../../../hooks/useFloatingTabBarPadding";

export default function SwitchToBrandScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const tabBarPadding = useFloatingTabBarPadding();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={[styles.container, { paddingBottom: tabBarPadding }]}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#1B2351", "#47C0D2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name="swap-horizontal" size={36} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <GradientText
            text="Currently in User Mode"
            textStyle={styles.title}
            gradientColors={["#1B2351", "#47C0D2"] as const}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.description}>
            You are browsing the app as a customer.
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GradientButton
            text="Back to Brand Mode"
            onPress={() => {
              dispatch(setUserMode(false));
              navigation
                .getParent()
                ?.getParent()
                ?.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Brand" }],
                  })
                );
            }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(24),
  },
  iconContainer: {
    marginBottom: verticalScale(24),
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: lightColors.textSubtitle,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: scale(8),
  },
  buttonContainer: {
    width: "100%",
    marginTop: verticalScale(32),
  },
});
