import * as Yup from "yup";

export const brandLoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required.")
    .email("Email must be valid."),
  password: Yup.string()
    .required("Password is required."),
});
