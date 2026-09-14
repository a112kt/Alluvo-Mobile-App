export interface MonthlyViewsStat {
  month: string;
  views: number;
}

export interface DailyViewsStat {
  date: string;
  views: number;
}

export interface YearlyViewsStat {
  year: number;
  views: number;
}

export interface ReelDetailAnalytics {
  growthPercentage: number;
  currentMonthViews: number;
  lastMonthViews: number;
  years: number[];
  monthlyViews: MonthlyViewsStat[];
  dailyViews: DailyViewsStat[];
  yearlyViews: YearlyViewsStat[];
}
