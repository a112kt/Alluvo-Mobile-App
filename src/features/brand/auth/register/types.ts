export interface AccountInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  profileImage?: string;
}

export interface BrandInfoData {
  brandName: string;
  brandLogo?: string;
  category: string;
  country: string;
  city: string;
  district: string;
  numberOfEmployees: string;
  aboutBrand: string;
  brandPolicy: string;
}

export interface VerificationData {
  fullName: string;
  nationalId: string;
  taxNumber: string;
  phone: string;
  frontId?: string;
  backId?: string;
  selfie?: string;
}

export interface BrandRegisterState {
  currentStep: number;
  email: string;
  token: string | null;
  accountInfo: AccountInfoData | null;
  brandInfo: BrandInfoData | null;
}

export interface OptionItem {
  id: string | number;
  name: string;
  nameAr?: string;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: { en: string; ar: string } | string;
  data?: any;
  errors?: { field: string; en: string; ar: string }[] | null;
}
