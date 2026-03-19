import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginStep, AuthFlowMode } from '../types/auth.types';

interface AuthFlowState {
  loginStep: LoginStep;
  flowMode: AuthFlowMode;
  loginUsername: string | null;
  // actions
  setStep: (step: LoginStep) => void;
  setFlowMode: (mode: AuthFlowMode) => void;
  setLoginUsername: (username: string | null) => void;
  resetFlow: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set) => ({
      loginStep: 'idle',
      flowMode: 'idle',
      loginUsername: null,

      setStep: (step) => set({ loginStep: step }),
      setFlowMode: (mode) => set({ flowMode: mode }),
      setLoginUsername: (username) => set({ loginUsername: username }),
      resetFlow: () => set({ loginStep: 'credentials', flowMode: 'login', loginUsername: null }),
    }),
    {
      name: 'auth-flow-storage',
      partialize: (state) => ({
        loginStep: state.loginStep,
        flowMode: state.flowMode,
        loginUsername: state.loginUsername,
      }),
    }
  )
);
