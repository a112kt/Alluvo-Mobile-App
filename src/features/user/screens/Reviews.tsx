import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import useBrandReviews from "../hooks/BrandProfile/useBrandReviews";
import {
  toggleReviewLike,
  toggleReviewDislike,
} from "../services/BrandProfile";
import EmptyState from "../components/BrandProfile/EmptyState";
import ReviewSummaryCard from "../components/BrandProfile/reviews/ReviewSummaryCard";
import ReviewInputCard from "../components/BrandProfile/reviews/ReviewInputCard";
import ReviewFilterChips from "../components/BrandProfile/reviews/ReviewFilterChips";
import ReviewCard from "../components/BrandProfile/reviews/ReviewCard";
import ReviewSkeleton from "../components/BrandProfile/reviews/ReviewSkeleton";

const FadeCard: React.FC<{ children: React.ReactNode; delay: number }> = ({
  children,
  delay,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

export default function Reviews({ brandId }: { brandId: number }) {
  const {
    response: initialReviews,
    loading,
    refetch,
  } = useBrandReviews(brandId);

  const [reviews, setReviews] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (initialReviews) {
      setReviews(initialReviews);
    }
  }, [initialReviews]);

  // ─── Computed values ────────────────────────────────────────────────────────
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : 0;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const rating = r.rating;
    if (rating >= 1 && rating <= 5) distribution[rating]++;
  });

  const filteredReviews = (() => {
    let result = [...reviews];
    switch (activeFilter) {
      case "recent":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      case "helpful":
        result.sort(
          (a, b) => (b.numOfLikes || 0) - (a.numOfLikes || 0)
        );
        break;
      case "5":
      case "4":
      case "3":
      case "2":
      case "1":
        result = result.filter((r) => r.rating === parseInt(activeFilter));
        break;
      default:
        break;
    }
    return result;
  })();

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleToggleLike = useCallback(
    async (reviewId: number, index: number) => {
      const review = filteredReviews[index];
      if (!review) return;
      const newIsLiked = !review.isLike;

      // Update in main reviews array
      setReviews((prev) =>
        prev.map((r) =>
          r.reviewId === reviewId
            ? {
                ...r,
                isLike: newIsLiked,
                numOfLikes: (r.numOfLikes || 0) + (newIsLiked ? 1 : -1),
              }
            : r
        )
      );

      try {
        await toggleReviewLike(reviewId, newIsLiked);
      } catch {
        // Revert on error
        setReviews((prev) =>
          prev.map((r) =>
            r.reviewId === reviewId
              ? {
                  ...r,
                  isLike: !newIsLiked,
                  numOfLikes: (r.numOfLikes || 0) + (newIsLiked ? -1 : 1),
                }
              : r
          )
        );
      }
    },
    [filteredReviews]
  );

  const handleToggleDislike = useCallback(
    async (reviewId: number, index: number) => {
      const review = filteredReviews[index];
      if (!review) return;
      const newIsDisliked = !review.isDisliked;

      setReviews((prev) =>
        prev.map((r) =>
          r.reviewId === reviewId
            ? {
                ...r,
                isDisliked: newIsDisliked,
                numOfDislikes: (r.numOfDislikes || 0) + (newIsDisliked ? 1 : -1),
              }
            : r
        )
      );

      try {
        await toggleReviewDislike(reviewId, newIsDisliked);
      } catch {
        setReviews((prev) =>
          prev.map((r) =>
            r.reviewId === reviewId
              ? {
                  ...r,
                  isDisliked: !newIsDisliked,
                  numOfDislikes: (r.numOfDislikes || 0) + (newIsDisliked ? -1 : 1),
                }
              : r
          )
        );
      }
    },
    [filteredReviews]
  );

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (loading && reviews.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ReviewSkeleton />
      </ScrollView>
    );
  }

  // ─── Main render ────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Summary card */}
        {totalReviews > 0 && (
          <View style={styles.section}>
            <ReviewSummaryCard
              averageRating={averageRating}
              totalReviews={totalReviews}
              distribution={distribution}
            />
          </View>
        )}

        {/* Input card */}
        <View style={styles.section}>
          <ReviewInputCard brandId={brandId} onSubmitSuccess={refetch} />
        </View>

        {/* Filter chips */}
        {totalReviews > 0 && (
          <View style={styles.section}>
            <ReviewFilterChips
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </View>
        )}

        {/* Reviews list */}
        {filteredReviews.length === 0 && totalReviews > 0 ? (
          <View style={styles.section}>
            <EmptyState type="reviews" />
          </View>
        ) : (
          filteredReviews.map((item, index) => (
            <FadeCard key={item.reviewId || item.id} delay={index * 80}>
              <View style={styles.reviewCardWrapper}>
                <ReviewCard
                  review={item}
                  index={index}
                  onLike={handleToggleLike}
                  onDislike={handleToggleDislike}
                />
              </View>
            </FadeCard>
          ))
        )}

        {/* Empty state when no reviews at all */}
        {totalReviews === 0 && !loading && (
          <View style={styles.section}>
            <EmptyState type="reviews" />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingTop: vs(12),
    paddingHorizontal: scale(12),
    paddingBottom: vs(40),
  },
  section: {
    marginBottom: vs(4),
  },
  reviewCardWrapper: {
    marginBottom: vs(2),
  },
});
