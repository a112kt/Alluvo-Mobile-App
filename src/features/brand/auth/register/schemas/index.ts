import * as Yup from "yup";

export const accountInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First name must be at least 3 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(3, "Last name must be at least 3 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^(10|11|12|15)\d{8}$/, "Invalid phone number")
    .required("Phone number is required"),
  password: Yup.string()
    .min(7, "Password must be at least 7 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one digit")
    .matches(/[@$!%*?&#]/, "Must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  gender: Yup.string()
    .oneOf(["Male", "Female"], "Invalid gender")
    .required("Gender is required"),
  profileImage: Yup.mixed().required("Profile image is required"),
});

export const brandInfoSchema = Yup.object().shape({
  brandName: Yup.string().required("Brand name is required"),
  brandLogo: Yup.mixed().required("Brand logo is required"),
  category: Yup.string().required("Category is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  numberOfEmployees: Yup.string().required("Number of employees is required"),
  aboutBrand: Yup.string().required("About brand is required"),
  brandPolicy: Yup.string().required("Brand policy is required"),
});

export const verificationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  nationalId: Yup.string()
    .matches(/^\d{14}$/, "National ID must be exactly 14 digits")
    .required("National ID is required"),
  taxNumber: Yup.string(),
  phone: Yup.string()
    .matches(/^(10|11|12|15)\d{8}$/, "Invalid phone number")
    .required("Phone number is required"),
});
