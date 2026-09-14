import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SvgXml } from "react-native-svg";
import { lightColors } from "../../../../../theme";
import {
  emptyStar,
  filledStar,
  like,
  likeActive,
  sendIcon,
  unLike,
  unLikeActive,
} from "../../../../assests/icons/AllIcon";
import { scale, verticalScale } from "react-native-size-matters";

import UseBrandReviews from "../../hooks/BrandProfile/useBrandReviews";
import {
  addBrandReview,
  toggleReviewDislike,
  toggleReviewLike,
} from "../../services/BrandProfile";
import { showToast } from "../../../../services/toastService";
import EmptyState from "./EmptyState";

const Commint = ({ brandId }: { brandId: number }) => {
  const { response: initialReviews, loading, error, refetch } = UseBrandReviews(brandId);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalStars = 5;

  useEffect(() => {
    if (initialReviews) {
      setReviews(initialReviews);
    }
  }, [initialReviews]);

  const handleToggleLike = async (reviewId: number, index: number) => {
    const review = reviews[index];
    const newIsLiked = !review.isLike;

    // Optimistic update
    const updatedReviews = [...reviews];
    updatedReviews[index] = {
      ...review,
      isLike: newIsLiked,
      numOfLikes: (review.numOfLikes || 0) + (newIsLiked ? 1 : -1),
    };
    setReviews(updatedReviews);

    try {
      await toggleReviewLike(reviewId, newIsLiked);
    } catch (err) {
      console.error("Failed to toggle review like:", err);
      // Revert on error
      setReviews(reviews);
    }
  };

  const handleToggleDislike = async (reviewId: number, index: number) => {
    const review = reviews[index];
    const newIsDisliked = !review.isDisliked;

    // Optimistic update
    const updatedReviews = [...reviews];
    updatedReviews[index] = {
      ...review,
      isDisliked: newIsDisliked,
      numOfDislikes: (review.numOfDislikes || 0) + (newIsDisliked ? 1 : -1),
    };
    setReviews(updatedReviews);

    try {
      await toggleReviewDislike(reviewId, newIsDisliked);
    } catch (err) {
      console.error("Failed to toggle review dislike:", err);
      // Revert on error
      setReviews(reviews);
    }
  };

  const handleSubmitReview = async () => {
    if (selectedRating === 0) {
      showToast("Rating required", "Please select a star rating");
      return;
    }
    if (!reviewText.trim()) {
      showToast("Comment required", "Please write a review comment");
      return;
    }
    setIsSubmitting(true);
    try {
      await addBrandReview(brandId, selectedRating, reviewText.trim());
      setReviewText("");
      setSelectedRating(0);
      showToast("Review submitted", "Your review has been posted");
      refetch();
    } catch (err) {
      console.error("Failed to submit review:", err);
      showToast("Error", "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.centerContent,
          { alignItems: "center", justifyContent: "center", flex: 1 },
        ]}
      >
        <ActivityIndicator size="small" color={lightColors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ScrollView
        contentContainerStyle={styles.centerContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Star rating selector */}
        <View style={styles.starContainer}>
          {[...Array(totalStars)].map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedRating(index + 1)}
              activeOpacity={0.7}
            >
              <SvgXml
                xml={index < selectedRating ? filledStar : emptyStar}
                width={24}
                height={24}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.Commintcontainer, { shadowColor: lightColors.black }]}>
          <TextInput
            placeholder="Add your review"
            placeholderTextColor="#8C8C8C"
            style={styles.input}
            value={reviewText}
            onChangeText={setReviewText}
            editable={!isSubmitting}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={handleSubmitReview}
            disabled={isSubmitting || !reviewText.trim() || selectedRating === 0}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={lightColors.primary} />
            ) : (
              <SvgXml xml={sendIcon} width={16} height={16} />
            )}
          </TouchableOpacity>
        </View>

        {/* reviews list */}
        {reviews.length === 0 ? (
          <EmptyState type="reviews" />
        ) : (
          reviews.map((item, index) => (
            <View key={item.reviewId || item.id} style={styles.Commintcard}>
              <View style={styles.header}>
                <Image
                  source={
                    item.userImageUrl
                      ? { uri: item.userImageUrl }
                      : require("../../../../assests/imgs/Avater.png")
                  }
                  style={styles.avatar}
                />
                <View>
                  <Text style={[styles.Bname, { color: lightColors.primary }]}>
                    {item.userDisplayName || item.name}
                  </Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <SvgXml
                        key={i}
                        xml={i <= (item.rating || 0) ? filledStar : emptyStar}
                        width={10}
                        height={10}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.comment}>{item.comment}</Text>

              <View style={styles.footer}>
                <Text style={styles.date}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </Text>
                <View style={styles.reactions}>
                  <TouchableOpacity
                    style={styles.reactionItem}
                    onPress={() => handleToggleLike(item.reviewId, index)}
                  >
                    <Text style={styles.reactionText}>
                      {item.numOfLikes || 0}
                    </Text>
                    <SvgXml
                      xml={item.isLike ? likeActive : like}
                      width={14}
                      height={14}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reactionItem}
                    onPress={() => handleToggleDislike(item.reviewId, index)}
                  >
                    <Text style={styles.reactionText}>
                      {item.numOfDislikes || 0}
                    </Text>
                    <SvgXml
                      xml={item.isDisliked ? unLikeActive : unLike}
                      width={14}
                      height={14}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Commint;

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  Commintcontainer: {
    flexDirection: "row",
    width: "100%",
    height: verticalScale(42),
    borderWidth: scale(1),
    borderColor: "#D0D5DD",
    backgroundColor: "#FEFEFE",
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(12),
    marginTop: verticalScale(10),
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
  },
  input: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: scale(12),
    color: "#8C8C8C",
    flex: 1,
  },
  iconContainer: {
    paddingStart: scale(8),
  },
  Commintcard: {
    width: "100%",
    padding: scale(10),
    borderRadius: scale(12),
    marginVertical: verticalScale(10),
    elevation: 1,
    shadowOffset: {
      width: 0,
      height: verticalScale(6),
    },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    marginEnd: scale(10),
  },
  Bname: {
    fontSize: scale(16),
    fontWeight: "600",
    fontFamily: "Inter",
  },
  starsRow: {
    flexDirection: "row",
    marginTop: verticalScale(1),
  },
  comment: {
    marginTop: verticalScale(8),
    color: "#4B5563",
    fontSize: scale(13),
    fontWeight: "400",
    fontFamily: "Inter",
    flexShrink: 1,
    marginStart: scale(44),
  },
  footer: {
    marginTop: verticalScale(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: scale(10),
    color: "#8C8C8C",
    fontFamily: "Inter",
  },
  reactions: {
    flexDirection: "row",
    gap: scale(10),
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  reactionText: {
    fontSize: scale(10),
    color: "#404040",
  },
  centerContent: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: verticalScale(20),
    paddingHorizontal: scale(10),
    width: "100%",
  },
});
