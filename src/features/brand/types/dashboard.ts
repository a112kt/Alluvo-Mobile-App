export interface MyBrandInfo {
  id: number;
  displayName: string;
  status: string;
  submittedAt?: string;
  rejectionReason?: string;
  lastFailedStep?: number;
}

export interface TopReelDto {
  reelId: number;
  title: string;
  thumbnailUrl: string | null;
  views: number;
  likes: number;
}

export interface BrandDashboardData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowthPercentage: number;
  ordersGrowthPercentage: number;
  activeCustomers: number;
  customersGrowthPercentage: number;
  salesGrowthPercentage: number;
  reelCounts: {
    all: number;
    published: number;
    draft: number;
  };
  postCounts: {
    all: number;
    published: number;
    draft: number;
  };
  recentOrders: RecentOrder[];
  revenueTrend: Array<{
    year: number;
    month: number;
    revenue: number;
  }>;
  topProducts: TopProduct[];
  totalReelViews: number;
  totalReelLikes: number;
  topViewedReels: TopReelDto[];
  topLikedReels: TopReelDto[];
}

export interface RecentOrder {
  orderId: number;
  createdAt: string;
  totalAmount: number;
  status: number;
  itemCount: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  imageUrl?: string;
  totalSold: number;
  revenue: number;
}
