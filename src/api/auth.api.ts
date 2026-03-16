import api from "./axios";
import { DEVICE_PUBLIC_KEY } from "../services/config";
import type { LoginPayload,OtpPayload } from "../types/userAuthType";

// ─── Pre Auth Handshake ───────────────────────────────────────
export const preAuthHandshake = async () => {
  try {
    const response = await api.post(
      "/v1/api/auth/pre-auth-handshake",
      { devicePublicKey: DEVICE_PUBLIC_KEY }
    );
    return response.data;
  } catch (error: any) {
    console.error("Pre-Auth Handshake error:", error.response?.data);
    throw error;
  }
};

// ─── Login ────────────────────────────────────────────────────
export const loginApi = async (payload: LoginPayload) => {
  try {
    const response = await api.post(
      "/v1/api/auth/login",
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data);
    throw error;
  }
};

// ─── Validate OTP ─────────────────────────────────────────────
export const validateOtpApi = async (payload: OtpPayload) => {
  try {
    const response = await api.post(
      "/v1/api/auth/validate-otp",
      { ...payload, otp: payload.otp }
    );
    return response.data;
  } catch (error: any) {
    console.error("OTP Validation error:", error.response?.data);
    throw error;
  }
};