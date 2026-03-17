import api from "./axios";
import { DEVICE_PUBLIC_KEY } from "../services/config";


// ─── Pre Auth Handshake ───────────────────────────────────────
export const preAuthHandshake = async () => {
  try {
    const response = await api.post(
      "/v1/api/auth/pre-auth-handshake",
      { devicePublicKey: DEVICE_PUBLIC_KEY }
    );
    return response.data;
  } catch (error: any) {
    console.error("Full error response:", error.response?.data);
  console.error("Errors array:", error.response?.data?.errors);  
  console.error("Headers sent:", error.config?.headers);
    throw error;
  }
};

// ─── Login ────────────────────────────────────────────────────
export const loginApi = async (username:string,password:string) => {
  try {
    const response = await api.post(
      "/v1/api/auth/login",
      { username, password }
    );
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data);
    throw error;
  }
};

// ─── Validate OTP ─────────────────────────────────────────────
export const validateOtpApi = async (username: string, otpValue: string) => {
  try {
    const response = await api.post(
      "/v1/api/auth/validate-otp",
       { username, otp: parseInt(otpValue, 10) }
    );
    return response.data;
  } catch (error: any) {
    console.error("OTP Validation error:", error.response?.data);
    throw error;
  }
};

// ─── Forgot userId ─────────────────────────────────────────────
export const forgotUserIdApi = async (panNumber: string, emailId: string) => {
  try {
    const response = await api.post("/v1/api/auth/forgot-user-id", {
      panNumber,
      emailId,
    });
    return response.data;
  } catch (error: any) {
    console.error("Forgot User ID API Error:", error.response?.data || error.message);
    throw error; 
  }
};


// ─── Forgot Password ─────────────────────────────────────────────
export const forgotPasswordApi = async (panNumber: string, username: string) => {
  try {
    const response = await api.post("/v1/api/auth/forgot-password", {
      panNumber,
      username,
    });
    return response.data;
  } catch (error: any) {
    console.error("Forgot Password API Error:", error.response?.data || error.message);
    throw error; 
  }
};
