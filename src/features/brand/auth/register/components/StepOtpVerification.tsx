import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { useBrandVerifyOtp } from "../hooks/useBrandRegister";
import { resendOtp } from "../services";
import InfoIcon from "../../../../../iconComponent/info";
import PhoneIcon from "../../../../../iconComponent/phone";

interface StepOtpVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function StepOtpVerification({
  email,
  onSuccess,
  onBack,
}: StepOtpVerificationProps) {
  const { mutate, isPending, isSuccess, isError } = useBrandVerifyOtp();
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const inputsRef = useRef<Array<RNTextInput | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [valid, setValid] = useState(false);
  const [verificationError, setVerificationError] = useState<boolean>(false);
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
  }, [isError]);

  useEffect(() => {
    if (!isSuccess) return;
    onSuccess();
  }, [isSuccess, onSuccess]);

  function handleChangeText(text: string, idx: number) {
    const ch = text.replace(/\s+/g, "").slice(0, 1);
    setCode((prev) => {
      const next = [...prev];
      next[idx] = ch;
      return next;
    });
    if (ch && idx < inputsRef.current.length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  }

  function handleKeyPress(e: any, idx: number) {
    if (e.nativeEvent.key === "Backspace") {
      if (!code[idx] && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
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
      if (data?.data === "OTP resent successfully." || data?.success) {
        setCode(["", "", "", "", ""]);
        setSecondsLeft(60);
        setVerificationError(false);
      }
    } catch (err) {

    } finally {
      setResending(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification code to {email}
      </Text>

      <View style={styles.otpRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <RNTextInput
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            value={code[i]}
            placeholder="_"
            placeholderTextColor="#C4C4C4"
            onFocus={() => {}}
            onBlur={() => {}}
            onChangeText={(t) => {
              if (t.length > 1) {
                handlePasteText(t);
              } else {
                handleChangeText(t, i);
              }
            }}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            maxLength={1}
            style={[
              styles.otpInput,
              { borderColor: verificationError ? "#EF4444" : "#1B2351" },
              { color: verificationError ? "#EF4444" : "#1B2351" },
            ]}
            textAlign="center"
            selectionColor="#1B2351"
            cursorColor="#1B2351"
            autoFocus={i === 0}
            returnKeyType="done"
          />
        ))}
      </View>

      {verificationError ? (
        <Text style={styles.errorMsg}>
          Invalid code. Please try again
        </Text>
      ) : (
        <View style={styles.timerRow}>
          {secondsLeft === 0 ? (
            <TouchableOpacity
              onPress={handleResend}
              disabled={resending}
            >
              <Text style={[styles.resendLink, resending && { color: "#6F7073" }]}>
                {resending ? "Sending..." : "Resend Code"}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              {`${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`}
              {"  "}Resend in
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={{ width: "100%", marginTop: vs(18) }}
        onPress={handleVerify}
        activeOpacity={0.5}
        disabled={verificationError ? (secondsLeft > 0 || resending) : (isPending || !valid)}
      >
        <View
          style={[
            styles.verifyBtn,
            {
              backgroundColor: verificationError ? "#EF4444" : lightColors.primary,
              opacity: (verificationError ? (secondsLeft > 0 || resending) : (!valid || isPending)) ? 0.6 : 1,
            },
          ]}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.verifyBtnText}>
              {verificationError ? (resending ? "Sending..." : "Resend") : "Verify Code"}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <InfoIcon color="#136EBF" />
          <Text style={styles.infoText}>
            If you're experiencing issues with verification, please check your spam folder or reach out to our support team for help.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.contactRow}>
        <PhoneIcon color="#1B6EA8" />
        <Text style={styles.contactText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: s(24),
    paddingTop: vs(16),
  },
  title: {
    fontSize: s(22),
    fontWeight: "700",
    fontFamily: "Inter",
    color: lightColors.primary,
    textAlign: "center",
  },
  subtitle: {
    marginTop: vs(8),
    color: "#6B7280",
    textAlign: "center",
    fontSize: s(14),
    fontFamily: "Inter",
    marginBottom: vs(24),
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: s(10),
  },
  otpInput: {
    width: s(50),
    height: s(50),
    borderRadius: s(10),
    backgroundColor: "#fff",
    borderWidth: 1.5,
    fontSize: s(20),
    fontWeight: "700",
    fontFamily: "Inter",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  errorMsg: {
    color: "#EF4444",
    fontSize: s(14),
    fontFamily: "Inter",
    marginTop: vs(16),
    fontWeight: "500",
  },
  timerRow: {
    marginTop: vs(18),
    alignItems: "center",
  },
  timerText: {
    color: lightColors.primary,
    fontSize: s(14),
    fontFamily: "Inter",
    fontWeight: "500",
  },
  resendLink: {
    color: lightColors.primary,
    fontSize: s(14),
    fontFamily: "Inter",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  verifyBtn: {
    height: vs(54),
    borderRadius: s(14),
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: s(17),
    fontWeight: "600",
    fontFamily: "Inter",
  },
  infoBox: {
    marginTop: vs(18),
    backgroundColor: "#DDEEFD",
    borderRadius: s(12),
    padding: s(14),
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: {
    fontSize: s(12),
    fontFamily: "Inter",
    color: "#1B6EA8",
    flex: 1,
  },
  contactRow: {
    marginTop: vs(22),
    alignItems: "center",
    flexDirection: "row",
    gap: s(10),
  },
  contactText: {
    fontSize: s(16),
    fontWeight: "600",
    fontFamily: "Inter",
    color: "#1B6EA8",
  },
});
