import { AxiosError } from "axios";
import { apiCall } from "../../../../services/apiClient";
import { API_BASE_URL } from "../../../../src/config/env";
type loginData={
    email:string;
    password:string;
}
type registerData ={
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  DateOfBirth: string;
  Gender: string;
  ProfileImage?: string;
}
type verificationData={
  email:string;
  otp:string;
}
//Login function
export async function login(data:loginData) {
    const res = await apiCall.post("/api/Auth/Login",data)
    return res.data
}
//Register function
export async function register(data:registerData) { 
  const form = new FormData();
  form.append("FirstName", data.FirstName);
  form.append("LastName", data.LastName);
  form.append("Email", data.Email);
  form.append("PhoneNumber", `+20${data.PhoneNumber}`);
  form.append("Password", data.Password);
  form.append("DateOfBirth", data.DateOfBirth);
  form.append("Gender", data.Gender);
  form.append("ProfileImage", {
      uri: data.ProfileImage,
      name: "profile.jpg",
      type: "image/jpg",
    } as any);
    // NOTE : we had to use fetch instead of axios because axios has some problems and limitations with form data in react native
   const resp = await fetch(`${API_BASE_URL}/api/Auth/Register`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      body: form,
    })
  return await resp.text()
}
//Verify Account function
export async function verification(data:verificationData) {
  const res = await apiCall.post("/api/Otp/VerifyOtp",data)
  return res.data
}
// Resend OTP function
export async function resendOtp(email: string) {
  const res = await apiCall.post(`/api/Otp/ResendOtp?email=${email}`);
  return res.data;
}

// Forget password
export default async function forgetPassword(email: string) {
  const response = await apiCall.post( "/api/Auth/ForgetPassword",
    { email }
  );
  return response.data;
}

// ResetPassword
export async function resetPassword(token: string, newPassword: string) {
  try {
    const res = await apiCall.post(
      "/api/Auth/ResetPassword",
      {
        newPassword: newPassword,
      },
    ); // No need to add our headers because we are using interceptor with axios instance 

    return res.data;
  } catch (error: any) {
    console.error("Reset password failed:", error.response?.data || error.message);
    throw error;
  }
}
