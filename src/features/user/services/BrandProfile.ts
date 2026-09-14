import { apiCall } from "../../../../services/apiClient";

export async function getBrandInfo(brandId: number) {
    try {
        const url = `/api/Brand/BrandInfo/${brandId}`;
        const res = await apiCall.get(url);
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (Info) -", {
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url,
            fullUrl: err.config?.baseURL + err.config?.url
        });
        throw err;
    }
}

// BrandPolicy
export async function getBrandPolicy(brandId: number) {
    try {
        const url = `/api/Brand/BrandPolicy?id=${brandId}`;
        const res = await apiCall.get(url);
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (Policy) -", {
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url,
            fullUrl: err.config?.baseURL + err.config?.url
        });
        throw err;
    }
}

// BrandReviews
export async function getBrandReviews(brandId: number) {
    try {
        const url = `/api/Brand/GetReviewsForBrand?brandId=${brandId}`;
        const res = await apiCall.get(url);
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (Reviews) -", {
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url,
            fullUrl: err.config?.baseURL + err.config?.url
        });
        throw err;
    }
}

// Toggle Review Like
export async function toggleReviewLike(reviewId: number, isLiked: boolean) {
    try {
        const res = await apiCall.post('/api/Brand/ToggleLikeToReview', {
            reviewId,
            isLiked
        });
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (ToggleLike) -", err.response?.data || err.message);
        throw err;
    }
}

// Toggle Review Dislike
export async function toggleReviewDislike(reviewId: number, isDisliked: boolean) {
    try {
        const res = await apiCall.post('/api/Brand/ToggleDislikeToReview', {
            reviewId,
            isDisliked
        });
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (ToggleDislike) -", err.response?.data || err.message);
        throw err;
    }
}

// Add Brand Review
export async function addBrandReview(brandId: number, rating: number, comment: string) {
    try {
        const url = `/api/Brand/${brandId}/review`;
        const res = await apiCall.post(url, { rating, comment });
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (AddReview) -", err.response?.data || err.message);
        throw err;
    }
}

// Toggle Brand Follow
export async function toggleFollowBrand(brandId: number) {
    try {
        const res = await apiCall.post(`/api/Brand/ToggleFollow/${brandId}`);
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (ToggleFollow) -", err.response?.data || err.message);
        throw err;
    }
}

// Get Followed Brands
export async function getFollowedBrands() {
  const res = await apiCall.get("/api/Brand/FollowedBrands");
  return res.data;
}

// Get Brand Reels
export async function getBrandReels(brandId: number) {
    try {
        const url = `/api/Reel/${brandId}`;
        const res = await apiCall.get(url);
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (Reels) -", err.response?.data || err.message);
        throw err;
    }
}

// Get Brand Products
export async function getBrandProducts(brandId: number) {
    try {
        const url = `/api/Product?BrandId=${brandId}`;
        const res = await apiCall.get(url);
        return res.data;
    } catch (err: any) {
        console.error("DEBUG: Service Error (Products) -", {
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        });
        throw err;
    }
}
