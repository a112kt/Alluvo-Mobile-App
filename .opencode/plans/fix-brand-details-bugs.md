# Fix Plan: Brand Details Page Bugs

## Bug 1: Reel like status not showing on brand details page

### Backend Changes

**File: `D:\Graduation Project\BackEnd\ReelsCommerceSystem\ReelsCommerceSystem.Application\DTOs\Response\Reel\AllReelsInBrandRes.cs`**

Add `IsLiked` property:
```csharp
public class AllReelsInBrandRes
{
    public int ReelId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = null!;
    public int NumOfWatches { get; set; }
    public int NumOfLikes { get; set; }
    public int NumOfShares { get; set; }
    public bool IsLiked { get; set; }  // ADD THIS
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string VideoUrl { get; set; } = null!;
}
```

**File: `D:\Graduation Project\BackEnd\ReelsCommerceSystem\Infrastructure.Infrastructure\Services\ReelService.cs`**

In `GetReelsByBrandAsync` method, after the foreach loop (around line 73), add like-status check before returning:

```csharp
// After the foreach loop that builds AllReels, before the return statement:
if (!string.IsNullOrEmpty(userId))
{
    var reelIds = AllReels.Select(r => r.ReelId).ToList();
    var likedReelIds = await _unitOfWork.Repository<UserReelLike>()
        .GetAllWithSpecAsync(new UserReelLikesByUserAndReelsSpec(userId, reelIds));

    var likedSet = new HashSet<int>(likedReelIds.Select(l => l.ReelId));
    foreach (var reel in AllReels)
    {
        reel.IsLiked = likedSet.Contains(reel.ReelId);
    }
}
```

Note: Need to create `UserReelLikesByUserAndReelsSpec` specification, or use a simpler EF Core query:
```csharp
if (!string.IsNullOrEmpty(userId))
{
    var reelIds = AllReels.Select(r => r.ReelId).ToList();
    var likedReelIds = await _unitOfWork.Context.UserReelLikes
        .Where(l => l.UserId == userId && reelIds.Contains(l.ReelId))
        .Select(l => l.ReelId)
        .ToListAsync();

    var likedSet = new HashSet<int>(likedReelIds);
    foreach (var reel in AllReels)
    {
        reel.IsLiked = likedSet.Contains(reel.ReelId);
    }
}
```

### Mobile Changes
None needed - `BrandReels.tsx:166` already maps `r.isLiked` correctly.

---

## Bug 2: Comment count doesn't refresh after adding

**File: `D:\Graduation Project\Mobile\src\features\user\components\CommentsBottomSheet.tsx`**

1. Add `onCommentAdded` prop:
```typescript
interface Props {
  onClose: () => void;
  reelId: number;
  totalComments: number;
  brandImageUrl?: string;
  onCommentAdded?: () => void;  // ADD THIS
}
```

2. Update component signature:
```typescript
const CommentsBottomSheet: React.FC<Props> = ({
  onClose,
  reelId,
  totalComments,
  brandImageUrl,
  onCommentAdded,  // ADD THIS
}) => {
```

3. In `handleSend`, after successful comment add, call the callback:
```typescript
const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      await addComment(trimmed, reelId);
      setText("");
      loadComments(1);
      onCommentAdded?.();  // ADD THIS LINE
    } catch (e) {
      console.error("Failed to add comment", e);
    } finally {
      setIsSending(false);
    }
  };
```

**File: `D:\Graduation Project\Mobile\src\features\user\screens\ReelsUser.tsx`**

1. Add a handler function before the return statement:
```typescript
const handleCommentAdded = useCallback(() => {
    setReels((prev) => {
      const next = [...prev];
      const r = { ...next[currentPage] };
      r.numOfComments = (r.numOfComments || 0) + 1;
      next[currentPage] = r;
      return next;
    });
  }, [currentPage]);
```

2. Update CommentsBottomSheet usage (around line 559):
```typescript
<CommentsBottomSheet
  onClose={() => setShowComments(false)}
  reelId={reels[currentPage]?.reelId ?? 0}
  totalComments={reels[currentPage]?.numOfComments ?? 0}
  brandImageUrl={reels[currentPage]?.brandImageUrl}
  onCommentAdded={handleCommentAdded}  // ADD THIS
/>
```

**File: `D:\Graduation Project\Mobile\src\features\user\screens\BrandReels.tsx`**

Same pattern:
1. Add handler:
```typescript
const handleCommentAdded = useCallback(() => {
    setReels((prev) => {
      const next = [...prev];
      const r = { ...next[currentPage] };
      r.numOfComments = (r.numOfComments || 0) + 1;
      next[currentPage] = r;
      return next;
    });
  }, [currentPage]);
```

2. Update CommentsBottomSheet usage (around line 414):
```typescript
<CommentsBottomSheet
  onClose={() => setShowComments(false)}
  reelId={reels[currentPage]?.reelId ?? 0}
  totalComments={reels[currentPage]?.numOfComments ?? 0}
  brandImageUrl={reels[currentPage]?.brandImageUrl}
  onCommentAdded={handleCommentAdded}  // ADD THIS
/>
```

---

## Bug 3: Brand logo doesn't appear (hardcoded image)

**File: `D:\Graduation Project\Mobile\src\features\user\components\BrandHeader.tsx`**

Update lines 86-93 to resolve relative URLs:
```tsx
<View style={styles.photoWrapper}>
  {isSvg ? (
    <SvgUri
      uri={brandData.logoUrl?.startsWith("http")
        ? brandData.logoUrl
        : `${process.env.EXPO_PUBLIC_API_URL}/${brandData.logoUrl}`}
      width={scale(68)}
      height={scale(68)}
    />
  ) : (
    <Image
      source={brandData?.logoUrl
        ? { uri: brandData.logoUrl.startsWith("http")
            ? brandData.logoUrl
            : `${process.env.EXPO_PUBLIC_API_URL}/${brandData.logoUrl}` }
        : require("../../../assests/imgs/Profile.png")}
      style={styles.brandPhoto}
    />
  )}
</View>
```

---

## Bug 4: Product cards not same height

**File: `D:\Graduation Project\Mobile\src\features\user\components\BrandProfile\Shop.tsx`**

1. Replace lines 25-26:
```typescript
// OLD:
const tallHeight = cardWidth * 1.35;
const shortHeight = cardWidth * 1.05;

// NEW:
const cardHeight = cardWidth * 1.25;
```

2. Replace line 106 and 114:
```typescript
// OLD:
const isTall = (idx + colIdx) % 2 === 0;
// ...
style={[styles.card, { height: isTall ? tallHeight : shortHeight }]}

// NEW:
// Remove isTall entirely
// ...
style={[styles.card, { height: cardHeight }]}
```

---

## Bug 5: Empty state SVGs for no reels/products/reviews

**New File: `D:\Graduation Project\Mobile\src\features\user\components\BrandProfile\EmptyState.tsx`**

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { scale, vs } from "react-native-size-matters";

interface EmptyStateProps {
  type: "reels" | "products" | "reviews";
}

const reelSvg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="15" width="60" height="50" rx="8" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <circle cx="25" cy="30" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <circle cx="55" cy="30" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <circle cx="25" cy="50" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <circle cx="55" cy="50" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <polygon points="35,32 35,48 48,40" fill="#D1D5DB"/>
</svg>`;

const productSvg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="25" width="50" height="40" rx="6" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <path d="M15 35H65" stroke="#D1D5DB" stroke-width="1.5"/>
  <rect x="25" y="15" width="30" height="15" rx="4" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <circle cx="40" cy="48" r="5" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
</svg>`;

const reviewSvg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="60" height="45" rx="8" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <polygon points="20,65 30,55 40,65" fill="#D1D5DB"/>
  <line x1="22" y1="28" x2="58" y2="28" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="36" x2="48" y2="36" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="44" x2="38" y2="44" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const titles: Record<string, string> = {
  reels: "No reels yet",
  products: "No products yet",
  reviews: "No reviews yet",
};

const subtitles: Record<string, string> = {
  reels: "This brand hasn't posted any reels.",
  products: "This brand hasn't added any products.",
  reviews: "Be the first to review this brand.",
};

const svgs: Record<string, string> = {
  reels: reelSvg,
  products: productSvg,
  reviews: reviewSvg,
};

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <View style={styles.container}>
      <SvgXml xml={svgs[type]} width={scale(80)} height={scale(80)} />
      <Text style={styles.title}>{titles[type]}</Text>
      <Text style={styles.subtitle}>{subtitles[type]}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(40),
    paddingHorizontal: scale(20),
  },
  title: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Inter",
    marginTop: vs(16),
  },
  subtitle: {
    fontSize: scale(13),
    fontWeight: "400",
    color: "#9CA3AF",
    fontFamily: "Inter",
    marginTop: vs(6),
    textAlign: "center",
  },
});
```

**Update `Reels.tsx`** (replace lines 53-60):
```tsx
import EmptyState from "./EmptyState";

// Replace the empty state text:
if (!reels || reels.length === 0) {
  return <EmptyState type="reels" />;
}
```

**Update `Shop.tsx`** — add empty state after the error check (around line 96):
```tsx
import EmptyState from "./EmptyState";

// After the error check, before rows:
if (filteredData.length === 0 && !isLoading) {
  return (
    <View style={styles.section}>
      <EmptyState type={onlyOffers ? "products" : "products"} />
    </View>
  );
}
```

**Update `Commint.tsx`** (replace lines 136-149):
```tsx
import EmptyState from "./EmptyState";

// Replace the reviews.length === 0 block:
{reviews.length === 0 ? (
  <EmptyState type="reviews" />
) : (
  // ... existing reviews map
)}
```

---

## Bug 6: Brand review not integrated with backend

**File: `D:\Graduation Project\Mobile\src\features\user\services\BrandProfile.ts`**

Add review submission function:
```typescript
// Add Brand Review
export async function addBrandReview(brandId: number, rating: number, comment: string) {
    try {
        const url = `/api/Brand/${brandId}/review`;
        const res = await apiCall.post(url, { rating, comment });
        console.log("DEBUG: Service Success (AddReview) - res.status:", res.status);
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (AddReview) -", err.response?.data || err.message);
        throw err;
    }
}
```

**File: `D:\Graduation Project\Mobile\src\features\user\hooks\BrandProfile\useBrandReviews.ts`**

Add refetch capability:
```typescript
import { useEffect, useState, useCallback } from "react";
import { getBrandReviews } from "../../services/BrandProfile";

const UseBrandReviews = (brandId: number) => {
  const [response, setResponse] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!brandId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await getBrandReviews(brandId);
      setResponse(res.data || []);
    } catch (err) {
      console.error("Reviews API Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { response, loading, error, refetch: fetchReviews };
};

export default UseBrandReviews;
```

**File: `D:\Graduation Project\Mobile\src\features\user\components\BrandProfile\Commint.tsx`**

Major rewrite of the review input section:
```tsx
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

  // ... handleToggleLike and handleToggleDislike remain the same ...

  if (loading) {
    return (
      <View style={[styles.centerContent, { alignItems: "center", justifyContent: "center", flex: 1 }]}>
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

        {/* Review input */}
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

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <EmptyState type="reviews" />
        ) : (
          reviews.map((item, index) => (
            // ... existing review card JSX (unchanged) ...
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
```
