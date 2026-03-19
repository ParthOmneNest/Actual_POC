import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  preAuthHandshake,
  loginApi,
  validateOtpApi,
  forgotUserIdApi,
  forgotPasswordApi,
  authenticateOtpApi,
  unblockUserApi,
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
  success: string | null;
  flowMode: 'login' | 'forgot-password' | 'forgot-id' | 'unblock-user' | 'idle'

  // actions
  setStep: (step: LoginStep) => void;
  runPreHandshake: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  validateOtp: (payload: OtpPayload) => Promise<void>;
  forgotUserId: (pan: string, email: string) => Promise<void>;
  forgotPassword: (pan: string, username: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  unblockUser: (pan: string, username: string) => Promise<void>;

}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      loginStep: "idle",
      loginUsername: null,
      isLoading: false,
      error: null,
      success: null,
      flowMode: 'idle',

      setStep: (step: LoginStep) => set({ loginStep: step, error: null }),

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

      login: async (payload: LoginPayload) => {
        set({ flowMode: "login", isLoading: true, success: null, error: null });
        try {
          await loginApi(payload.username, payload.password);
          set({ loginStep: "otp", loginUsername: payload.username });
        } catch (error: any) {
          // Check if it's a 423 status code
          if (error.response?.status === 423) {
            set({ error: "LOCKED: " + (error.response?.data?.message || "Account locked.") });
          } else {
            set({ error: error.response?.data?.message || "Invalid user ID or password" });
          };
        } finally {
          set({ isLoading: false });
        }
      },
     
      forgotUserId: async (pan: string, email: string) => {
        set({ flowMode: 'forgot-id', isLoading: true, error: null });
        try {
          await forgotUserIdApi(pan, email);
          set({ loginStep: "otp" });
        } catch (error: any) {
          const backendError = error.response?.data?.errors?.[0]?.errorMessage;
          set({ error: backendError || "Failed to retrieve User ID" });
        } finally {
          set({ isLoading: false });
        }
      },

      forgotPassword: async (pan: string, username: string) => {
        set({ flowMode: "forgot-password", isLoading: true, error: null });
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

      validateOtp: async (payload: OtpPayload) => {
        set({ isLoading: true, error: null });
        try {

          const { flowMode } = useAuthStore.getState();
          let response;
          if (flowMode === 'unblock-user') {
            response = await authenticateOtpApi(payload.username, payload.otp.toString());
            // If authenticateOtpApi returns { isUserBlocked: false }
            if (!response.isUserBlocked) {
              set({
                loginStep: 'credentials',
                success: 'User has been un-blocked successfully',
                flowMode: 'idle'
              });
              return;
            }
          } else {
            response = await validateOtpApi(payload.username, payload.otp.toString());
          }
          if (flowMode == 'login' && response.jwtTokens?.accessToken) {

            set({
              accessToken: response.jwtTokens?.accessToken,
              refreshToken: response.jwtTokens?.refreshToken,
              user: response,
              loginUsername: null,
              loginStep: "success",
            });
          } else if (flowMode === 'forgot-password') {
            set({
              loginStep: "set-password"
            });
          } else if (flowMode === 'forgot-id') {
            set({
              loginStep: 'credentials',
              success: 'UserId has been sent to you register email',
              error: null
            })
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

      clearError: () => set({ error: null, success: null }),

      unblockUser: async (pan: string, username: string) => {
        set({ flowMode: 'unblock-user', isLoading: true, error: null });

        try {
          await unblockUserApi(pan, username);
          set({ loginStep: 'otp', loginUsername: username });
        } catch (error: any) {
          set({ error: error.response?.data?.message || "Unblock request failed" });
        } finally {
          set({ isLoading: false });
        }
      }
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


