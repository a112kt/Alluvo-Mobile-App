import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { Ionicons } from "@expo/vector-icons";

interface StepSuccessProps {
  onComplete: () => void;
}

export default function StepSuccess({ onComplete }: StepSuccessProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.checkCircle,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons name="checkmark" size={48} color="#fff" />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={styles.title}>Registration Under Review</Text>
        <Text style={styles.subtitle}>
          Your brand registration has been submitted successfully. Our team will review your application.
        </Text>

        <View style={styles.cardsContainer}>
          <View style={[styles.card, styles.cardAvailable]}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Available Now</Text>
              <Text style={styles.cardDesc}>
                Browse products, watch reels, and explore the platform while you wait.
              </Text>
            </View>
          </View>

          <View style={[styles.card, styles.cardPending]}>
            <Ionicons name="time-outline" size={24} color="#F59E0B" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Pending Approval</Text>
              <Text style={styles.cardDesc}>
                Product listing, order management, and analytics will be available after approval.
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={onComplete}
          style={({ pressed }) => [
            styles.dashboardBtn,
            pressed && { opacity: 0.92 },
          ]}
        >
          <Text style={styles.dashboardBtnText}>Go to Dashboard</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: s(24),
    paddingTop: vs(40),
  },
  checkCircle: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: vs(24),
  },
  title: {
    fontSize: s(22),
    fontWeight: "700",
    fontFamily: "Inter",
    color: lightColors.primary,
    textAlign: "center",
    marginBottom: vs(8),
  },
  subtitle: {
    fontSize: s(14),
    fontFamily: "Inter",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: s(20),
    marginBottom: vs(28),
    paddingHorizontal: s(10),
  },
  cardsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: vs(32),
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: s(16),
    borderRadius: s(14),
    gap: 12,
  },
  cardAvailable: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  cardPending: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: s(15),
    fontWeight: "700",
    fontFamily: "Inter",
    color: lightColors.primary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: s(12),
    fontFamily: "Inter",
    color: "#6B7280",
    lineHeight: s(18),
  },
  dashboardBtn: {
    width: "100%",
    height: vs(54),
    borderRadius: s(16),
    backgroundColor: lightColors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  dashboardBtnText: {
    color: "#fff",
    fontSize: s(17),
    fontWeight: "700",
    fontFamily: "Inter",
    letterSpacing: 0.5,
  },
});
