import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  preAuthHandshake,
  loginApi,
  validateOtpApi,
} from "../api/auth.api";
import type {
  LoginPayload,
  OtpPayload,
  ValidateOtpResponse,
  LoginStep,
} from "../types/userAuthType";

interface AuthState {
  // data
  accessToken: string | null;
  refreshToken: string | null;
  user: Omit<ValidateOtpResponse, "jwtTokens"> | null;
  loginStep: LoginStep;
  isLoading: boolean;
  error: string | null;

  // actions
  runPreHandshake: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  validateOtp: (payload: OtpPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ── initial state ──
      accessToken: null,
      refreshToken: null,
      user: null,
      loginStep: "idle",
      isLoading: false,
      error: null,

      // ── Step 1: Prehandshake ──
      runPreHandshake: async () => {
        set({ isLoading: true, error: null });
        try {
          await preAuthHandshake();
          set({ loginStep: "credentials" }); // move to login step
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Handshake failed" });
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Step 2: Login ──
      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          await loginApi(payload);
          set({ loginStep: "otp" }); 
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Login failed" });
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Step 3: Validate OTP ──
      validateOtp: async (payload: OtpPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response: ValidateOtpResponse = await validateOtpApi(payload);

          const { jwtTokens, ...userInfo } = response; 

          set({
            accessToken: jwtTokens.accessToken,
            refreshToken: jwtTokens.refreshToken,
            user: userInfo,
            loginStep: "success",
          });
        } catch (error: any) {
          set({ error: error.response?.data?.message || "OTP validation failed" });
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Logout ──
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          loginStep: "idle",
          error: null,
        });
      },

      // ── Clear Error ──
      clearError: () => set({ error: null }),
    }),

    {
      name: "auth-storage",           
      partialize: (state) => ({     
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);


