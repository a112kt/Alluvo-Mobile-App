export interface BrandLoginRequest {
  email: string;
  password: string;
}

export interface BrandLoginResponse {
  data: {
    token: string;
  };
}

export interface MyBrandResponse {
  data: {
    id: number;
    displayName: string;
    status: string;
    submittedAt?: string;
    rejectionReason?: string;
    lastFailedStep?: number;
  };
}
