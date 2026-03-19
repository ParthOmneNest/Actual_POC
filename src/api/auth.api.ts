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
