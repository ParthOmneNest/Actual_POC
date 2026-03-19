import { create } from "zustand";
import { persist } from "zustand/middleware";
import { preAuthHandshake } from "../api/auth.api";
import type { ValidateOtpResponse } from "../types/userAuthType";

interface AuthState {
  // data
  accessToken: string | null;
  refreshToken: string | null;
  user: Omit<ValidateOtpResponse, "jwtTokens"> | null;
  isLoading: boolean;
  error: string | null;

  // actions
  runPreHandshake: () => Promise<void>;
  setAuthData: (data: { accessToken: string; refreshToken: string; user: Omit<ValidateOtpResponse, "jwtTokens"> }) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoading: false,
      error: null,

      runPreHandshake: async () => {
        set({ isLoading: true, error: null });
        try {
          await preAuthHandshake();
        } catch (error: any) {
          console.error("Prehandshake failed: ", error);
          set({ error: error.response?.data?.message || "Handshake failed" });
        } finally {
          set({ isLoading: false });
        }
      },

      setAuthData: (data) => {
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          error: null,
        });
      },

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
