import React, { useEffect, useRef, useState } from "react";
import SuccessCard from "../../../Components/cards/SuccessCard";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import GradientText from "../../../Components/GradientText";
import { SvgXml } from "react-native-svg";
import { lightColors } from "../../../../theme";
import { TextInput as RNTextInput } from "react-native";
import TimerIcon from "../../../iconComponent/timer";
import useVerificaion from "../hooks/useVerificaion";
import type { AuthStackParamList } from "../../../Navigation/AuthStack";
import { RouteProp } from "@react-navigation/native";
import { resendOtp } from "../services/auth";
import InfoIcon from "../../../iconComponent/info";
import PhoneIcon from "../../../iconComponent/phone";
import { useAppDispatch } from "../../../Redux/store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { s, vs, ms } from "react-native-size-matters";
import { setToken } from "../../../Redux/slices/authSlice";
import { RootStackParamList } from "../../../Navigation/AppNavigator";
import { backIcon } from "../../../assests/icons/AllIcon";

type RootNavigationType = NativeStackNavigationProp<
  RootStackParamList,
  "Auth",
  "User"
>;
type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "resetPassword",
  "interest"
>;

export default function VerifyOtpScreen() {
  const navigation = useNavigation<RootNavigationType>();
  const Autnavigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { mutate, isPending, isSuccess, data, isError } = useVerificaion();
  type VerifyAccountRouteProp = RouteProp<AuthStackParamList, "verifyAccount">;
  const route = useRoute<VerifyAccountRouteProp>();
  const email = route.params.email;
  const source = (route.params as any).source as
    | "signup"
    | "forgetPassword"
    | undefined;
  useEffect(() => {

  }, []);

  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [valid, setValid] = useState(false);
  const [verificationError, setVerificationError] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const timer =
      secondsLeft > 0
        ? setInterval(() => setSecondsLeft((s) => s - 1), 1000)
        : null;
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [secondsLeft]);

  useEffect(() => {
    if (code.every((c) => c.length === 1)) {
      Keyboard.dismiss();
    }
    setValid(code.every((c) => c.length === 1));
  }, [code]);
  useEffect(() => {
    setVerificationError(isError);
    setSecondsLeft(60);
  }, [isError]);
  useEffect(() => {
    if (!isSuccess) return;
    if (source === "forgetPassword") {
      Autnavigation.navigate("resetPassword");
    } else if (source === "signup") {
      setShowModal(true);
    }
  }, [isSuccess, source]);

  function handleChangeText(text: string, idx: number) {
    const ch = text.replace(/\s+/g, "").slice(0, 1);
    setCode((prev) => {
      const next = [...prev];
      next[idx] = ch;
      return next;
    });

    if (ch && idx < inputsRef.current.length - 1) {
      // focus next
      const nextInput = inputsRef.current[idx + 1];
      nextInput?.focus();
    }
  }

  function handleKeyPress(e: any, idx: number) {
    if (e.nativeEvent.key === "Backspace") {
      if (!code[idx] && idx > 0) {
        const prevInput = inputsRef.current[idx - 1];
        prevInput?.focus();
        setCode((prev) => {
          const next = [...prev];
          next[idx - 1] = "";
          return next;
        });
      } else {
        setCode((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
      }
    }
  }

  function handlePasteText(pasted: string) {
    const digits = pasted.replace(/\D/g, "").slice(0, 5).split("");
    if (digits.length) {
      const filled = Array.from({ length: 5 }, (_, i) => digits[i] ?? "");
      setCode(filled);
      const lastIndex = Math.min(digits.length - 1, 4);
      inputsRef.current[lastIndex]?.focus();
    }
  }

  function handleVerify() {
    if (verificationError) {
      handleResend();
    } else {
      const otp = code.join("");
      mutate({ email, otp });
    }
  }

  async function handleResend() {
    try {
      setResending(true);
      const data = await resendOtp(email);
      // apiCall returns res.data, which we named 'data' in the service
      // The current backend response in auth.ts standardization returns the data directly
      if (data.data === "OTP resent successfully." || data.success) {
        setCode(["", "", "", "", ""]);
        setSecondsLeft(60);
        setVerificationError(false);
      } else {
        Alert.alert("Error", data.message?.en || data.data || "Failed to resend OTP");
      }
    } catch (error: any) {
      const errorMsg = error?.friendlyMessage || error.message || "Failed to resend code";
      Alert.alert("Error", errorMsg);
    } finally {
      setResending(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { opacity: isSuccess && source === "signup" ? 0.8 : 1 },
      ]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.canGoBack() ? navigation.goBack() : null
            }
            style={styles.headerBack}
          >
            <SvgXml xml={backIcon} width={24} height={25} />
          </TouchableOpacity>

          <GradientText text={"Alluvo"} textStyle={styles.text} />
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.container}>
          <Image
            source={
              verificationError
                ? require("../../../assests/imgs/verification-error.png")
                : require("../../../assests/imgs/verify.png")
            }
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.title,
              { color: verificationError ? "#EF4444" : "#1B2351" },
            ]}
          >
            Verify Your Account
          </Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to your email
          </Text>

          {/* OTP inputs */}
          <View style={styles.otpRow}>
            {Array.from({ length: 5 }).map((_, i) => {
              const [isFocused, setIsFocused] = useState(false);
              return (
                <RNTextInput
                  key={i}
                  ref={(el: RNTextInput | null) => {
                    inputsRef.current[i] = el;
                  }}
                  value={code[i]}
                  placeholder={isFocused ? "|" : "_"}
                  placeholderTextColor={isFocused ? "#1B2351" : "#C4C4C4"}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChangeText={(t) => {
                    if (t.length > 1) {
                      handlePasteText(t);
                    } else {
                      handleChangeText(t, i);
                    }
                  }}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  keyboardType={
                    Platform.OS === "ios" ? "number-pad" : "numeric"
                  }
                  maxLength={1}
                  style={[
                    styles.otpInput,
                    isFocused && { borderColor: "#1B2351", borderWidth: 1.4 },
                    { borderColor: verificationError ? "#EF4444" : "#1B2351" },
                    { color: verificationError ? "#EF4444" : "#1B2351" },
                  ]}
                  textAlign="center"
                  selectionColor="#1B2351"
                  cursorColor="#1B2351"
                  autoFocus={i === 0}
                  returnKeyType="done"
                />
              );
            })}
          </View>


          {/* timer row VS error message */}
          {verificationError ? (
            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text
                style={{
                  fontFamily: "inter",
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#EF4444",
                }}
              >
                Invalid code. Please try again
              </Text>
            </View>
          ) : (
            <View style={styles.timerRow}>
              {secondsLeft === 0 ? (
                <>
                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={secondsLeft > 0 || resending}
                  >
                    <Text
                      style={{
                        fontFamily: "inter",
                        fontSize: 14,
                        fontWeight: 400,
                        color: resending ? "#6F7073" : "#1B2351",
                      }}
                    >
                      {resending ? "Sending..." : "Resend Code"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <TimerIcon />
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.timerText}>
                      {` ${String(Math.floor(secondsLeft / 60)).padStart(
                        2,
                        "0"
                      )}:${String(secondsLeft % 60).padStart(2, "0")}`}
                    </Text>
                    <Text style={styles.resend}>
                      This may take up to 1 minute.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
          {verificationError && (
            <View>
              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.textLine}>or</Text>
                <View style={styles.line} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Text>you can resend after ...</Text>
                <TimerIcon />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.timerText}>
                    {` ${String(Math.floor(secondsLeft / 60)).padStart(
                      2,
                      "0"
                    )}:${String(secondsLeft % 60).padStart(2, "0")}`}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Verify button */}
          <TouchableOpacity
            style={{ width: "100%", marginTop: 18 }}
            onPress={handleVerify}
            activeOpacity={0.5}
            disabled={verificationError ? (secondsLeft > 0 || resending) : (isPending || !valid)}
          >
            {verificationError ? (
              <LinearGradient
                colors={["#892727", "#EF4444"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.verifyBtn,
                  { opacity: (secondsLeft > 0 || resending) ? 0.6 : 1 },
                ]}
              >
                <Text style={styles.verifyBtnText}>
                  {resending ? "Sending..." : "Resend"}
                </Text>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={["#1B2351", "#47C0D2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.verifyBtn,
                  { opacity: !valid || isPending ? 0.6 : 1 },
                ]}
              >
                <Text style={styles.verifyBtnText}>
                  {isPending ? "Verifying..." : "Verify Otp"}
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          {/* info box */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: verificationError ? "#FEE2E2" : "#DDEEFD" },
            ]}
          >
            <View style={styles.infoRow}>
              <InfoIcon color={verificationError ? "#EF4444" : "#136EBF"} />
              <Text
                style={[
                  styles.infoText,
                  { color: verificationError ? "#B91C1C" : "#1B6EA8" },
                ]}
              >
                If you’re experiencing issues with verification, please check
                your spam folder or reach out to our support team for help.
              </Text>
            </View>
          </View>

          {/* contact support */}
          <TouchableOpacity style={styles.contactRow}>
            <PhoneIcon color={verificationError ? "#EF4444" : "#1B6EA8"} />
            <Text
              style={[
                styles.contactText,
                { color: verificationError ? "#EF4444" : "#1B6EA8" },
              ]}
            >
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
      >
        <SuccessCard
          onContinue={() => {
            setShowModal(false);
            Autnavigation.navigate("interest");
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const BOX = {
  radius: 12,
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  headerRow: {
    height: vs(51),
    paddingHorizontal: s(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBack: {
    width: s(50),
    height: vs(40),
    borderRadius: s(20),
    alignItems: "center",
    justifyContent: "center",
    color: "#6F7073",
  },

  text: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: s(24),
    marginStart: s(10),
  },
  backChevron: {
    fontSize: s(28),
    color: "#333",
  },
  logo: {
    width: s(120),
    height: vs(34),
  },

  container: {
    paddingHorizontal: s(24),
    alignItems: "center",
  },

  illustration: {
    width: s(200),
    height: s(180),
  },

  title: {
    marginTop: vs(6),
    fontSize: s(24),
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    marginTop: vs(8),
    color: "#6b6b6b",
    textAlign: "center",
    fontSize: s(13),
    marginBottom: vs(18),
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: vs(8),
    paddingHorizontal: s(6),
    gap: s(10),
  },
  otpInput: {
    width: s(40),
    height: s(40),
    borderRadius: s(8),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E9EF",
    ...BOX.shadow,
    fontSize: s(18),
    marginHorizontal: s(4),
    fontWeight: "700",
  },

  timerRow: {
    width: "100%",
    marginTop: vs(18),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(4),
    gap: s(4),
  },
  timerText: {
    color: "#1B2351",
    fontWeight: "400",
    fontSize: s(14),
  },
  resend: {
    color: "#777",
    fontSize: s(12),
    marginStart: s(8),
    marginBottom: vs(10),
  },

  verifyBtn: {
    height: vs(54),
    borderRadius: s(14),
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: s(18),
    fontWeight: "600",
  },

  infoBox: {
    marginTop: vs(18),
    backgroundColor: "#DDEEFD",
    borderRadius: s(12),
    padding: s(14),
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: vs(6) },
    shadowOpacity: 0.06,
    shadowRadius: s(12),
    elevation: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  infoText: {
    fontSize: s(12),
    flex: 1,
  },

  contactRow: {
    marginTop: vs(22),
    alignItems: "center",
    flexDirection: "row",
    gap: s(10),
  },
  contactIcon: {
    fontSize: 22,
    marginEnd: 8,
    color: "#1B6EA8",
  },
  contactText: {
    fontSize: s(18),
    fontWeight: "600",
  },
  errorText: { color: "red", fontSize: s(12), marginTop: vs(2) },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(22),
    width: "80%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EF4444",
  },
  textLine: {
    marginHorizontal: s(5),
    fontFamily: "Inter",
    fontSize: s(12),
    fontWeight: "400",
    color: "#6F7073",
    marginBottom: vs(7),
  },
});
