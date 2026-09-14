export type UserStackParamList = {
  UserTabs: undefined;
  BrandProfile: { brandId: number; initialTab?: "reels" | "shop" | "offers" | "reviews" | "Policy" };
  Settings: undefined;
  ProfileSettings: undefined;
  PaymentMethod: undefined;
  ShippingAddress: undefined;
  AddAddress: { address?: import("../features/address/types").Address } | undefined;
  Notifications: undefined;
  ContactUs: undefined;
  SearchExplore: undefined;
  ReelDetail: { initialReelId?: number } | undefined;
  BrandReels: { brandId: number; initialIndex: number };
  TopBrandsView: undefined;
  ProductDetails: { product: any } | { productId: number; productName: string };
  Checkout: { brandId?: number; brandName?: string } | undefined;
  Cart: { brandId?: number; brandName?: string } | undefined;
  Shop: { category?: string } | undefined;
  ChatScreen: undefined;
  ChatMessages: { roomIdEncr: string; brandName: string; brandId?: number; brandImage?: string };
  OrderDetails: { orderId: number };
  AboutUs: undefined;
};

export type AuthStackParamList = {
  LanguageSelection: undefined;
  Login: undefined;
  BrandLogin: undefined;
  BrandRegister: undefined;
  Register: undefined;
  forgetPassword: undefined;
  role: undefined;
  verifyAccount: {
    email: string;
    source?: "signup" | "forgetPassword";
  };
  resetPassword: undefined;
  interest: undefined;
};

export type BrandStackParamList = {
  BrandRoot: undefined;
};

export type RootStackParamList = {
  Auth: { screen: keyof AuthStackParamList; params?: any } | undefined;
  Splash: undefined;
  Brand: undefined;
  User: { screen: keyof UserStackParamList; params?: any } | undefined;
};
