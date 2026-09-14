import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  StatusBar,
} from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { headerWave, arrowSvg } from "../../../assests/icons/AllIcon";
import AuthInput from "../../../Components/inputs/AuthInput";
import GradientButton from "../../../Components/buttons/GradientButton";
import { lightColors } from "../../../../theme";
import { message, planet } from "../../../iconComponent/svgIcons";

export default function ContactUs() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState("");

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#1B2351", "#47C0D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.headerGradient, { paddingTop: insets.top }]}
        >
          <SvgXml xml={headerWave} style={styles.svgWave} />
          <View style={styles.headerContent}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backCircle}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <SvgXml xml={arrowSvg} width={8} height={14} />
            </Pressable>

            <Text style={styles.headerTitle}>Contact Us</Text>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heroTitle}>We’d love to hear from you!</Text>
          <Text style={styles.heroDescription}>
            Have a question, feedback or collaboration idea? Reach out to us —
            we’ll get back to you as soon as possible.
          </Text>

          <View style={styles.formContainer}>
            <AuthInput
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <AuthInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            
            {/* Message field - styled like AuthInput but multiline */}
            <View style={styles.msgWrapper}>
              <Text style={styles.label}>Message</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Enter your message"
                  value={msg}
                  onChangeText={setMsg}
                  multiline={true}
                  style={styles.textArea}
                  placeholderTextColor="#CDD5DF"
                />
              </View>
            </View>

            <View style={{ marginTop: vs(10) }}>
              <GradientButton text="Send message" />
            </View>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerLabel}>Or reach us directly at</Text>
            
            <View style={styles.infoRow}>
              <SvgXml xml={message} />
              <Text style={styles.infoText}>support@alluvo.com</Text>
            </View>
            
            <View style={styles.infoRow}>
              <SvgXml xml={planet} />
              <Text style={styles.infoText}>www.alluvo.com</Text>
            </View>
          </View>
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
    paddingHorizontal: 18,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 12,
    zIndex: 100,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  svgWave: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 100,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  heroTitle: {
    fontSize: s(20),
    fontFamily: "Poppins-Bold",
    color: "#1B2351",
    marginTop: vs(15),
  },
  heroDescription: {
    fontSize: s(14),
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: vs(5),
    lineHeight: vs(20),
  },
  formContainer: {
    marginTop: vs(25),
    gap: vs(8),
  },
  msgWrapper: {
    marginBottom: 8,
  },
  label: {
    fontSize: s(16),
    color: lightColors.primary,
    marginTop: s(8),
    marginBottom: s(6),
    fontFamily: "Inter",
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: s(8),
    height: vs(120),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 6,
    paddingHorizontal: s(15),
    paddingTop: vs(10),
  },
  textArea: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: s(14),
    color: "#111",
    textAlignVertical: "top",
  },
  footerContainer: {
    marginTop: vs(35),
    alignItems: "center",
    gap: vs(15),
  },
  footerLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: s(14),
    color: "#666",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
  },
  infoText: {
    fontFamily: "Poppins-Medium",
    fontSize: s(16),
    color: lightColors.primary,
  },
});
