export interface BrandReelType {
  id: number;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  status: "published" | "draft";
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  productsCount: number;
  isLikedByCurrentUser?: boolean;
  products?: BrandReelProduct[];
  createdAt?: string;
  musicTrackId?: string;
  musicTrackName?: string;
  musicTrackArtist?: string;
  filterId?: string;
}

export interface BrandReelProduct {
  id: number;
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
}

export interface ReelManagementFilter {
  Search?: string;
  Status?: string;
  Sort?: string;
  Page?: number;
  PageSize?: number;
}

export interface BrandProductBrief {
  id: number;
  name: string;
  price: number;
  stockStatus: string;
  rating: number;
}

export interface ReelsListResponse {
  success: boolean;
  statusCode: number;
  data: {
    data: BrandReelType[];
    pagination: {
      pageNumber: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
    counts: {
      all: number;
      published: number;
      draft: number;
    };
  };
}

export interface SingleReelResponse {
  success: boolean;
  statusCode: number;
  data: BrandReelType;
}

export interface ProductsResponse {
  success: boolean;
  statusCode: number;
  data: {
    data: BrandProductBrief[];
    pagination: {
      page: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

export interface FilterPreset {
  id: string;
  name: string;
  icon: string;
  overlayColors: string[];
  overlayOpacity: number;
}

export interface JamendoTrack {
  id: string;
  name: string;
  artistName: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
}

export interface ReelRecordingResult {
  videoUri: string;
  filterId?: string;
  musicTrack?: {
    id: string;
    name: string;
    artistName: string;
  };
  duration: number;
}
