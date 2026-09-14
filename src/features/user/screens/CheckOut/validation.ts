export interface CheckoutValidationFields {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phoneNumber: string;
  country: string;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  errors: string[];
}

const PHONE_REGEX = /^(10|11|12|15)\d{8}$/;

export function validateCheckoutFields(
  fields: CheckoutValidationFields
): CheckoutValidationResult {
  const errors: string[] = [];

  if (!fields.firstName.trim()) {
    errors.push("First name is required");
  } else if (fields.firstName.trim().length < 3) {
    errors.push("First name must be more than 3 characters");
  }

  if (!fields.lastName.trim()) {
    errors.push("Last name is required");
  } else if (fields.lastName.trim().length < 3) {
    errors.push("Last name must be more than 3 characters");
  }

  if (!fields.country.trim()) {
    errors.push("Country is required");
  }

  if (!fields.address.trim()) {
    errors.push("Street address is required");
  }

  if (!fields.city.trim()) {
    errors.push("City is required");
  }

  if (!fields.phoneNumber.trim()) {
    errors.push("Phone number is required");
  } else if (!PHONE_REGEX.test(fields.phoneNumber.trim())) {
    errors.push("Invalid phone number (must start with 10, 11, 12, or 15)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
