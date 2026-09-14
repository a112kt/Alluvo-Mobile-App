import { apiCall } from "../../../../services/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReelProduct {
  productId: number;
  productName: string;
  price: number;
  mediaUrl: string;
  discountPercentage: number | null;
  haveOffer: boolean;
  rate: number;
}
export interface Reel {
  reelId: number;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  thumbnail?: string;
  coverImage?: string;
  previewImage?: string;
  poster?: string;
  createdAt: string;
  numOfLikes: number;
  numOfWatches: number;
  numOfComments: number;
  isLiked: boolean;
  brandId: number;
  brandImageUrl: string;
  brandName: string;
  products: ReelProduct[];
  filterId?: string;
}


export interface ReelsMeta {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalPages: number;
}

export interface ReelsResponse {
  success: boolean;
  statusCode: number;
  data: {
    meta: ReelsMeta;
    data: Reel[];
  };
}

export interface ReelsParams {
  pageIndex?: number;
  pageSize?: number;
}

// ─── Service Functions ─────────────────────────────────────────────────────────

export async function getForYouReels(params: ReelsParams = {}): Promise<ReelsResponse> {
  const { pageIndex = 1, pageSize = 10 } = params;
  const res = await apiCall.get("/api/Reel/forYou", {
    params: { pageIndex, pageSize },
  });
  return res.data;
}

export async function getFollowingReels(params: ReelsParams = {}): Promise<ReelsResponse> {
  const { pageIndex = 1, pageSize = 10 } = params;
  const res = await apiCall.get("/api/Reel/following", {
    params: { pageIndex, pageSize },
  });
  return res.data;
}

export async function getReelById(reelId: number): Promise<{ success: boolean; statusCode: number; data: Reel }> {
  const res = await apiCall.get(`/api/Reel/by-id/${reelId}`);
  return res.data;
}

// ─── Comment Types ─────────────────────────────────────────────────────────────

export interface ReelComment {
  id: number;
  content: string;
  userName: string;
  userImage: string | null;
  commentLikeCount: number;
  isLovedByCurrentUser: boolean;
  repliesCount: number;
  createdAt: string;
}

export interface ReelCommentReply {
  id: number;
  content: string;
  userName: string;
  userImage: string | null;
  likeCount: number;
  isLovedByCurrentUser: boolean;
  createdAt: string;
}

export interface CommentsResponse {
  success: boolean;
  statusCode: number;
  data: {
    meta: ReelsMeta;
    data: ReelComment[];
  };
}

export interface RepliesResponse {
  success: boolean;
  statusCode: number;
  data: {
    meta: ReelsMeta;
    data: ReelCommentReply[];
  };
}

// ─── Comment Service Functions ─────────────────────────────────────────────────

export async function getReelComments(
  reelId: number,
  pageNumber = 1,
  pageSize = 10
): Promise<CommentsResponse> {
  const res = await apiCall.get(`/api/ReelComment/${reelId}`, {
    params: { pageNumber, pageSize },
  });
  return res.data;
}

export async function addComment(content: string, reelId: number) {
  const res = await apiCall.post("/api/ReelComment/AddComment", { content, reelId });
  return res.data;
}

export async function toggleCommentLike(commentId: number) {
  const res = await apiCall.post("/api/ReelComment/toggle-like", { commentId });
  return res.data;
}

// ─── Reply Service Functions ───────────────────────────────────────────────────

export async function getCommentReplies(
  commentId: number,
  pageNumber = 1,
  pageSize = 10
): Promise<RepliesResponse> {
  const res = await apiCall.get(`/api/CommentReply/${commentId}`, {
    params: { pageNumber, pageSize },
  });
  return res.data;
}

export async function addReply(content: string, commentId: number) {
  const res = await apiCall.post("/api/CommentReply/reply", { content, commentId });
  return res.data;
}

export async function toggleReplyLike(replyId: number) {
  const res = await apiCall.post("/api/CommentReply/toggle-reply-like", { replyId });
  return res.data;
}

export async function toggleReelLike(reelId: number) {
  const res = await apiCall.post(`/api/Reel/toggle-like/${reelId}`);
  return res.data;
}

export async function trackReelView(
  reelId: number,
  watchedDurationSeconds: number,
  videoDurationSeconds: number
) {
  const res = await apiCall.post("/api/Reel/TrackReelView", {
    reelId,
    watchedDurationSeconds,
    videoDurationSeconds,
  });
  return res.data;
}

// ─── Top Brands ──────────────────────────────────────────────────────────────

export interface TopBrandItem {
  brandId: number;
  brandName: string;
  totalViews: number;
}

export interface TopBrandsResponse {
  brands: TopBrandItem[];
  topN: number;
}

export async function getTopBrands(topN: number = 5): Promise<TopBrandsResponse> {
  const res = await apiCall.get("/api/Reel/topbrands", {
    params: { topN },
  });
  return res.data;
}

// ─── Search Types ────────────────────────────────────────────────────────────

export interface SearchProduct {
  productId: number;
  name: string;
  description: string;
  arDescription: string | null;
  price: number;
  mainImageUrl: string;
}

export interface SearchResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: {
    reels: {
      meta: ReelsMeta;
      data: Reel[];
    };
    products: {
      meta: ReelsMeta;
      data: SearchProduct[];
    };
  };
  errors: null | string;
}

export async function search(
  text: string,
  pageIndex: number = 1,
  pageSize: number = 10
): Promise<SearchResponse> {
  const res = await apiCall.get(`/api/Search/Search`, {
    params: { text, pageIndex, pageSize },
  });
  return res.data;
}