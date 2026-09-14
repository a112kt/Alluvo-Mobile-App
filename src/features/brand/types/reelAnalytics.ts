export interface MonthlyReelStat {
  month: string;
  count: number;
}

export interface DailyReelStat {
  date: string;
  count: number;
}

export interface YearlyReelStat {
  year: number;
  count: number;
}

export interface TopReel {
  reelId: number;
  title: string;
  thumbnailUrl: string | null;
  views: number;
  likes: number;
}

export interface AudienceStats {
  followersCount: number;
  nonFollowersCount: number;
  newUsersCount: number;
  followersGrowth: number;
  nonFollowersGrowth: number;
  newUsersGrowth: number;
}

export interface MostViewedProduct {
  productId: number;
  name: string;
  imageUrl: string | null;
  views: number;
}

export interface DailyEngagement {
  dailyViews: number[];
  dailyLikes: number[];
  dailyComments: number[];
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface BrandReelAnalytics {
  totalViews: number;
  totalLikes: number;
  viewsGrowthPercentage: number;
  likesGrowthPercentage: number;
  reelCounts: {
    all: number;
    published: number;
    draft: number;
  };
  monthlyViews: MonthlyReelStat[];
  monthlyLikes: MonthlyReelStat[];
  dailyViews: DailyReelStat[];
  dailyLikes: DailyReelStat[];
  yearlyViews: YearlyReelStat[];
  yearlyLikes: YearlyReelStat[];
  topViewedReels: TopReel[];
  topLikedReels: TopReel[];
  audienceStats: AudienceStats;
  mostViewedProducts: MostViewedProduct[];
  dailyEngagement: DailyEngagement;
  engagementRate: number;
  productViewsCount: number;
}
