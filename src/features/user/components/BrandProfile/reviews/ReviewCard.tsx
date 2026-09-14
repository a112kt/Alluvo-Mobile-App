import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { scale, vs } from "react-native-size-matters";
import {
  filledStar,
  emptyStar,
  like,
  likeActive,
  unLike,
  unLikeActive,
} from "../../../../../assests/icons/AllIcon";

interface ReviewData {
  reviewId: number;
  rating: number;
  comment: string;
  userDisplayName?: string;
  name?: string;
  userImageUrl?: string;
  numOfLikes?: number;
  numOfDislikes?: number;
  isLike?: boolean;
  isDisliked?: boolean;
  createdAt?: string;
}

interface Props {
  review: ReviewData;
  index: number;
  onLike: (reviewId: number, index: number) => void;
  onDislike: (reviewId: number, index: number) => void;
}

function getRelativeDate(dateStr?: string): string {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReviewCard({ review, index, onLike, onDislike }: Props) {
  const likeScale = useRef(new Animated.Value(1)).current;
  const dislikeScale = useRef(new Animated.Value(1)).current;

  const animatePress = (sv: Animated.Value) => {
    Animated.sequence([
      Animated.timing(sv, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(sv, {
        toValue: 1,
        useNativeDriver: true,
        damping: 8,
        stiffness: 200,
      }),
    ]).start();
  };

  const handleLike = () => {
    animatePress(likeScale);
    onLike(review.reviewId, index);
  };

  const handleDislike = () => {
    animatePress(dislikeScale);
    onDislike(review.reviewId, index);
  };

  return (
    <View style={styles.card}>
      {/* Header: Avatar + Name + Stars + Date */}
      <View style={styles.header}>
        <Image
          source={
            review.userImageUrl
              ? { uri: review.userImageUrl }
              : require("../../../../../assests/imgs/Avater.png")
          }
          style={styles.avatar}
        />
        <View style={styles.headerRight}>
          <Text style={styles.name} numberOfLines={1}>
            {review.userDisplayName || review.name || "User"}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <SvgXml
                  key={i}
                  xml={i <= (review.rating || 0) ? filledStar : emptyStar}
                  width={scale(12)}
                  height={scale(12)}
                />
              ))}
            </View>
            <Text style={styles.dateSeparator}>·</Text>
            <Text style={styles.date}>{getRelativeDate(review.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Comment text */}
      <Text style={styles.comment}>{review.comment}</Text>

      {/* Footer: Like + Dislike pills */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleLike}
          activeOpacity={0.7}
          style={[
            styles.pill,
            review.isLike && styles.pillLikeActive,
          ]}
          accessibilityLabel="Like review"
          accessibilityRole="button"
        >
          <SvgXml
            xml={review.isLike ? likeActive : like}
            width={scale(14)}
            height={scale(14)}
          />
          <Text
            style={[
              styles.pillText,
              review.isLike && styles.pillTextLikeActive,
            ]}
          >
            {review.numOfLikes || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDislike}
          activeOpacity={0.7}
          style={[
            styles.pill,
            review.isDisliked && styles.pillDislikeActive,
          ]}
          accessibilityLabel="Dislike review"
          accessibilityRole="button"
        >
          <SvgXml
            xml={review.isDisliked ? unLikeActive : unLike}
            width={scale(14)}
            height={scale(14)}
          />
          <Text
            style={[
              styles.pillText,
              review.isDisliked && styles.pillTextDislikeActive,
            ]}
          >
            {review.numOfDislikes || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: vs(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    borderWidth: 2,
    borderColor: "#E8F4F8",
  },
  headerRight: {
    flex: 1,
    marginLeft: scale(12),
  },
  name: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#28364A",
    fontFamily: "Inter",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(2),
  },
  starsRow: {
    flexDirection: "row",
    gap: scale(1),
  },
  dateSeparator: {
    fontSize: scale(12),
    color: "#D0D5DD",
    marginHorizontal: scale(6),
  },
  date: {
    fontSize: scale(11),
    color: "#A2ACB5",
    fontFamily: "Inter",
  },
  comment: {
    fontSize: scale(13),
    fontWeight: "400",
    color: "#484D56",
    fontFamily: "Inter",
    lineHeight: scale(20),
    marginTop: vs(12),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginTop: vs(12),
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    paddingHorizontal: scale(12),
    paddingVertical: vs(6),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pillLikeActive: {
    backgroundColor: "#E8F8F5",
    borderColor: "#47C0D2",
  },
  pillDislikeActive: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  pillText: {
    fontSize: scale(12),
    fontWeight: "500",
    color: "#535A65",
    fontFamily: "Inter",
  },
  pillTextLikeActive: {
    color: "#47C0D2",
  },
  pillTextDislikeActive: {
    color: "#EF4444",
  },
});
