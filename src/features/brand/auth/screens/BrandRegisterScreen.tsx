import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, AuthStackParamList } from "../../../../Navigation/types";
import { headerWave, arrowSvg } from "../../../../assests/icons/AllIcon";

import StepAccountInfo from "../register/components/StepAccountInfo";
import StepOtpVerification from "../register/components/StepOtpVerification";
import StepBrandInfo from "../register/components/StepBrandInfo";
import StepVerification from "../register/components/StepVerification";
import StepSuccess from "../register/components/StepSuccess";

type RootNavigationType = NativeStackNavigationProp<RootStackParamList>;

const TOTAL_STEPS = 5;

export default function BrandRegisterScreen() {
  const navigation = useNavigation<RootNavigationType>();
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const stepTitles = [
    "Account Info",
    "Verification",
    "Brand Info",
    "Identity Check",
    "Success",
  ];

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      if (navigation.canGoBack()) navigation.goBack();
    }
  };

  const handleStep1Success = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep(2);
  };

  const handleStep2Success = () => {
    setCurrentStep(3);
  };

  const handleStep3Success = () => {
    setCurrentStep(4);
  };

  const handleStep4Success = () => {
    setCurrentStep(5);
  };

  const handleComplete = () => {
    navigation.replace("Brand");
  };

  const showBack = currentStep >= 2 && currentStep <= 4;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepAccountInfo onSuccess={handleStep1Success} />;
      case 2:
        return (
          <StepOtpVerification
            email={email}
            onSuccess={handleStep2Success}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepBrandInfo
            token={token || ""}
            onSuccess={handleStep3Success}
          />
        );
      case 4:
        return (
          <StepVerification
            token={token || ""}
            onSuccess={handleStep4Success}
          />
        );
      case 5:
        return <StepSuccess onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#1B2351", "#47C0D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.headerGradient, { paddingTop: insets.top }]}
        >
          <SvgXml xml={headerWave} style={styles.svgWave} />
          <View style={styles.headerContent}>
            {showBack && (
              <Pressable
                onPress={handleBack}
                style={styles.backCircle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <SvgXml xml={arrowSvg} width={8} height={14} />
              </Pressable>
            )}
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Brand Registration</Text>
              <Text style={styles.headerSubtitle}>
                Step {currentStep} of {TOTAL_STEPS}: {stepTitles[currentStep - 1]}
              </Text>
            </View>
          </View>
          <View style={styles.stepIndicator}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i + 1 === currentStep && styles.stepDotActive,
                  i + 1 < currentStep && styles.stepDotCompleted,
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  headerWrapper: {
    position: "relative",
  },
  headerGradient: {
    paddingHorizontal: 20,
    overflow: "hidden",
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  headerTextGroup: {
    flex: 1,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 14,
    zIndex: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: s(20),
    fontWeight: "700",
    fontFamily: "Inter",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: s(12),
    fontFamily: "Inter",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  svgWave: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 100,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  stepDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  stepDotActive: {
    backgroundColor: "#fff",
    width: s(24),
    borderRadius: s(4),
  },
  stepDotCompleted: {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
});
