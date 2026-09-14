import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Pressable,
  Animated,
} from "react-native";
import React, { useRef, useEffect } from "react";
import { s, vs } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { headerWave, arrowSvg } from "../../../../assests/icons/AllIcon";
import { lightColors } from "../../../../../theme";
import { useTranslation } from "react-i18next";

const teamMembers = [
  { name: "Ashrakat Raafat Elabd", role: "Mobile Application Developer\nProject Idea Owner" },
  { name: "Abdullah", role: "Frontend Developer" },
  { name: "Aya", role: "Frontend Developer" },
  { name: "Abdelrahman", role: "Backend Developer" },
  { name: "Maryam", role: "Backend Developer" },
  { name: "Nada", role: "Backend Developer" },
  { name: "Esraa", role: "Backend Developer" },
  { name: "Abdelgawad", role: "AI Engineer" },
  { name: "Suzan", role: "AI Engineer" },
  { name: "Tasneem", role: "AI Engineer" },
];

const heroSvg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="38" stroke="url(#heroGrad)" stroke-width="2.5" fill="none"/>
  <circle cx="40" cy="28" r="10" fill="url(#heroGrad)"/>
  <path d="M22 58C22 48.0589 30.0589 40 40 40C49.9411 40 58 48.0589 58 58" stroke="url(#heroGrad)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <circle cx="40" cy="28" r="10" fill="white" opacity="0.3"/>
  <defs>
    <linearGradient id="heroGrad" x1="20" y1="20" x2="60" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#47C0D2"/>
      <stop offset="1" stop-color="#1B2351"/>
    </linearGradient>
  </defs>
</svg>`;

const appVersion = "1.0.0";

export default function AboutUs() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const fadeAnim5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(fadeAnim1, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeAnim2, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeAnim3, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeAnim4, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeAnim5, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.safe, { backgroundColor: lightColors.bgLight }]}>
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
            <Text style={styles.headerTitle}>{t("aboutUs")}</Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim1, alignItems: "center" }}>
          <SvgXml xml={heroSvg} width={80} height={80} />
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim2 }]}>
          <Text style={[styles.sectionTitle, { color: lightColors.primary }]}>
            {t("aboutWhoWeAre")}
          </Text>
          <Text style={[styles.sectionText, { color: lightColors.body }]}>
            {t("aboutWhoWeAreDesc")}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim2 }]}>
          <Text style={[styles.sectionTitle, { color: lightColors.primary }]}>
            {t("aboutOurVision")}
          </Text>
          <Text style={[styles.sectionText, { color: lightColors.body }]}>
            {t("aboutOurVisionText")}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim3 }]}>
          <Text style={[styles.sectionTitle, { color: lightColors.primary }]}>
            {t("aboutMeetTeam")}
          </Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View
                key={index}
                  style={[
                    styles.teamCard,
                    {
                      backgroundColor: lightColors.bgLight,
                      shadowColor: lightColors.hint,
                    },
                  ]}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {member.name.charAt(0)}
                  </Text>
                </View>
                <Text
                  style={[styles.memberName, { color: lightColors.primary }]}
                  numberOfLines={2}
                >
                  {member.name}
                </Text>
                <Text
                  style={[styles.memberRole, { color: lightColors.body }]}
                  numberOfLines={3}
                >
                  {member.role}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim4 }]}>
          <Text style={[styles.sectionTitle, { color: lightColors.primary }]}>
            {t("aboutSpecialThanks")}
          </Text>
          <Text style={[styles.sectionText, { color: lightColors.body }]}>
            {t("aboutSpecialThanksText")}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.footerSection, { opacity: fadeAnim5 }]}>
          <Text style={[styles.versionText, { color: lightColors.hint }]}>
            {t("appVersion")} {appVersion}
          </Text>
          <Text style={[styles.footerText, { color: lightColors.body }]}>
            {t("aboutFooter")}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 24,
  },
  section: {
    marginTop: vs(28),
  },
  sectionTitle: {
    fontSize: s(20),
    fontFamily: "Poppins-Bold",
    marginBottom: vs(10),
  },
  sectionText: {
    fontSize: s(14),
    fontFamily: "Poppins-Regular",
    lineHeight: vs(22),
  },
  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: vs(6),
  },
  teamCard: {
    width: "48%",
    borderRadius: s(16),
    padding: s(14),
    marginBottom: vs(14),
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarCircle: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: "#47C0D2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(8),
  },
  avatarText: {
    color: "#fff",
    fontSize: s(18),
    fontFamily: "Poppins-Bold",
  },
  memberName: {
    fontSize: s(13),
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: vs(4),
  },
  memberRole: {
    fontSize: s(11),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: vs(16),
  },
  footerSection: {
    marginTop: vs(40),
    alignItems: "center",
    paddingBottom: vs(20),
  },
  versionText: {
    fontSize: s(12),
    fontFamily: "Poppins-Regular",
    marginBottom: vs(6),
  },
  footerText: {
    fontSize: s(13),
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
});
