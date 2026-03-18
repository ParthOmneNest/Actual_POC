import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  preAuthHandshake,
  loginApi,
  validateOtpApi,
  forgotUserIdApi,
  forgotPasswordApi,
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
  loginUsername: string | null;
  loginStep: LoginStep;
  isLoading: boolean;
  error: string | null;
  flowMode:'login' | 'forgot-password' |'forgot-id'| 'idle'

  // actions
  setStep: (step: LoginStep) => void;
  runPreHandshake: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  validateOtp: (payload: OtpPayload) => Promise<void>;
  forgotUserId: (pan: string, email: string) => Promise<void>;
  forgotPassword: (pan: string, username: string) => Promise<void>;
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
      loginUsername: null,
      isLoading: false,
      error: null,
      flowMode:'idle',

      setStep: (step: LoginStep) => set({ loginStep: step, error: null }),

      // ── Step 1: Prehandshake ──
      runPreHandshake: async () => {
        set({ isLoading: true, error: null });
        try {
          await preAuthHandshake();
          set({ loginStep: "credentials" }); // move to login step
        } catch (error: any) {
          console.error("Prehandshake failed: ", error);

          set({ error: error.response?.data?.message || "Handshake failed" });
          // set({ loginStep: "credentials" }); // move to login step

        } finally {
          set({ isLoading: false });
        }
      },

      // ── Step 2: Login ──
      login: async (payload: LoginPayload) => {
        set({flowMode:"login", isLoading: true, error: null });
        try {
          await loginApi(payload.username, payload.password);
          set({ loginStep: "otp", loginUsername: payload.username });
        } catch (error: any) {
          console.log(" Login failed →", error.response?.data);
          set({ error: error.response?.data?.message || "Invalid user ID or password" });
        } finally {
          set({ isLoading: false });
        }
      },


      // 1. Forgot User ID (PAN + Email)
      forgotUserId: async (pan: string, email: string) => {
        set({ flowMode:'forgot-id', isLoading: true, error: null });
        try {
          await forgotUserIdApi(pan, email);
          set({ loginStep:"otp" });
        } catch (error: any) {
          const backendError = error.response?.data?.errors?.[0]?.errorMessage;
          set({ error: backendError || "Failed to retrieve User ID" });
        } finally {
          set({ isLoading: false });
        }
      },

      // 2. Forgot Password (PAN + Username)
      forgotPassword: async (pan: string, username: string) => {
        set({flowMode:"forgot-password", isLoading: true, error: null });
        try {
          await forgotPasswordApi(pan, username);

          set({
            loginStep: "otp",
            loginUsername: username
          });
        } catch (error: any) {
          const backendError = error.response?.data?.errors?.[0]?.errorMessage;
          set({ error: backendError || "Invalid Details" });
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Step 3: Validate OTP ──
      validateOtp: async (payload: OtpPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await validateOtpApi(
            payload.username,
            payload.otp.toString()
          );
          console.log("OTP response:", response);
          const {flowMode} = useAuthStore.getState();
          if (flowMode=='login'&& response.jwtTokens?.accessToken) {

            set({
              accessToken: response.jwtTokens?.accessToken,
              refreshToken: response.jwtTokens?.refreshToken,
              user: response,
              loginUsername: null,
              loginStep: "success",
            });
          } else if(flowMode === 'forgot-password') {
            set({
              loginStep: "set-password"
            });
          } else if(flowMode === 'forgot-id'){
            set({loginStep:'credentials',error:'UserId has been sent to you register email'})
          }
        } catch (error: any) {
          console.log(" OTP failed →", error.response?.data);
          set({
            error: error.response?.data?.message || "Incorrect OTP, You have 2 attempts remaining"
          });
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
          loginUsername: null,
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
        loginUsername: state.loginUsername,
        flowMode: state.flowMode
      }),
    }
  )
);


