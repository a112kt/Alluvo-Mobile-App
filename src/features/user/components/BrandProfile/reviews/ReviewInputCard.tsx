import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { scale, vs } from "react-native-size-matters";
import { filledStar, emptyStar } from "../../../../../assests/icons/AllIcon";
import { lightColors } from "../../../../../../theme";
import { addBrandReview } from "../../../services/BrandProfile";
import { showToast } from "../../../../../services/toastService";
import { useTranslation } from "react-i18next";

interface Props {
  brandId: number;
  onSubmitSuccess: () => void;
}

export default function ReviewInputCard({ brandId, onSubmitSuccess }: Props) {
  const { t } = useTranslation();
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const starScales = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(1))
  ).current;

  const handleStarPress = (index: number) => {
    setSelectedRating(index + 1);
    Animated.sequence([
      Animated.spring(starScales[index], {
        toValue: 0.7,
        useNativeDriver: true,
        damping: 8,
        stiffness: 200,
      }),
      Animated.spring(starScales[index], {
        toValue: 1,
        useNativeDriver: true,
        damping: 8,
        stiffness: 200,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      showToast(t("ratingRequired"), t("pleaseSelectRating"), undefined, "warning");
      return;
    }
    if (!reviewText.trim()) {
      showToast(t("commentRequired"), t("pleaseWriteReview"), undefined, "warning");
      return;
    }
    Keyboard.dismiss();
    setIsSubmitting(true);
    try {
      await addBrandReview(brandId, selectedRating, reviewText.trim());
      setReviewText("");
      setSelectedRating(0);
      showToast(t("reviewSubmitted"), t("reviewPosted"), undefined, "success");
      onSubmitSuccess();
    } catch (err) {
      showToast(t("review"), t("failedToSubmitReview"), undefined, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormFilled = selectedRating > 0 && reviewText.trim().length > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("writeAReview")}</Text>

      {/* Star selector */}
      <View style={styles.starsRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleStarPress(i)}
            activeOpacity={0.7}
            accessibilityLabel={`Rate ${i + 1} out of 5 stars`}
            accessibilityRole="button"
          >
            <Animated.View style={{ transform: [{ scale: starScales[i] }] }}>
              <SvgXml
                xml={i < selectedRating ? filledStar : emptyStar}
                width={scale(30)}
                height={scale(30)}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
        {selectedRating > 0 && (
          <Text style={styles.ratingLabel}>
            {selectedRating}/5
          </Text>
        )}
      </View>

      {/* Multiline text input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("shareExperience")}
          placeholderTextColor="#A2ACB5"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={reviewText}
          onChangeText={setReviewText}
          editable={!isSubmitting}
          maxLength={500}
        />
        {reviewText.length > 0 && (
          <Text style={styles.charCount}>{reviewText.length}/500</Text>
        )}
      </View>

      {/* Submit button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting || !isFormFilled}
        activeOpacity={0.85}
        accessibilityLabel={t("submitReview")}
        accessibilityState={{ disabled: isSubmitting || !isFormFilled }}
      >
        <LinearGradient
          colors={
            isFormFilled && !isSubmitting
              ? ["#1B2351", "#47C0D2"]
              : ["#B0B8C9", "#B0B8C9"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.submitButton,
            (!isFormFilled || isSubmitting) && styles.submitButtonDisabled,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>{t("submitReview")}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(20),
    padding: scale(20),
    marginBottom: vs(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  title: {
    fontSize: scale(15),
    fontWeight: "600",
    color: "#28364A",
    fontFamily: "Inter",
    marginBottom: vs(14),
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: vs(14),
  },
  ratingLabel: {
    fontSize: scale(13),
    fontWeight: "600",
    color: lightColors.primary,
    fontFamily: "Inter",
    marginLeft: scale(4),
  },
  inputContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: scale(12),
    minHeight: vs(80),
  },
  input: {
    fontSize: scale(13),
    fontFamily: "Inter",
    color: "#28364A",
    lineHeight: scale(20),
    padding: 0,
  },
  charCount: {
    fontSize: scale(10),
    color: "#A2ACB5",
    fontFamily: "Inter",
    textAlign: "right",
    marginTop: vs(6),
  },
  submitButton: {
    height: vs(48),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(14),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Inter",
  },
});
