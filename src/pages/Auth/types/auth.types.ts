export interface LoginPayload {
  username: string;
  password: string;
}

export interface OtpPayload {
  username: string;
  otp: number;         
}

export interface PreAuthResponse {
  message: string;
  bffPublicKey: string;
}

export type LoginResponse = void;

export type LoginStep = 'idle' | 'credentials' | 'otp' | 'forgot-credentials' | 'set-mpin' | 'unblock-user' | 'set-password' | 'success';

export type AuthFlowMode = 'login' | 'forgot-password' | 'forgot-id' | 'unblock-user' | 'idle';
