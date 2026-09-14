export interface Address {
  id?: number;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  street?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  postcode?: string;
  isDefault?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationError {
  field: string;
  en: string;
  ar: string;
}

export interface AddressResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: Address[];
  errors: ValidationError[] | null;
}

export interface SingleAddressResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: Address;
  errors: ValidationError[] | null;
}

export interface AddressFormData {
  name: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  postcode: string;
  isDefault: boolean;
}

export interface AddressFormErrors {
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  street?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  postcode?: string;
}
