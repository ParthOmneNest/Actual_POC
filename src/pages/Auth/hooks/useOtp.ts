import { useState } from 'react';
import { useAuthFlowStore } from '../store/useAuthFlowStore';
import { useAuthStore } from '../../../store/useAuthStore';
import type { OtpPayload } from '../types/auth.types';
import api from '../../../api/axios';

export const useOtp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const flowMode = useAuthFlowStore((state) => state.flowMode);
    const setStep = useAuthFlowStore((state) => state.setStep);
    const setGlobalAuth = useAuthStore((state) => state.setAuthData);

    const validateOtp = async (payload: OtpPayload) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let response;
            if (flowMode === 'unblock-user') {
                response = await api.post("/v1/api/auth/authenticate-otp", { 
                    username: payload.username, 
                    otp: payload.otp, 
                    isUserBlocked: false 
                });
                if (!response.data.isUserBlocked) {
                    setStep('credentials');
                    setSuccess('User has been un-blocked successfully');
                    useAuthFlowStore.setState({ flowMode: 'idle' });
                    return;
                }
            } else {
                response = await api.post("/v1/api/auth/validate-otp", { 
                    username: payload.username, 
                    otp: payload.otp 
                });
            }

            const data = response.data;

            if (flowMode === 'login' && data.jwtTokens?.accessToken) {
                setGlobalAuth({
                    accessToken: data.jwtTokens.accessToken,
                    refreshToken: data.jwtTokens.refreshToken,
                    user: data
                });
                useAuthFlowStore.setState({ loginUsername: null });
                setStep('success');
            } else if (flowMode === 'forgot-password') {
                setStep('set-password');
            } else if (flowMode === 'forgot-id') {
                setStep('credentials');
                setSuccess('UserId has been sent to you register email');
            }
        } catch (err: any) {
            console.log("OTP failed →", err.response?.data);
            setError(err.response?.data?.message || "Incorrect OTP, You have 2 attempts remaining");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
        setSuccess(null);
    };

    return { validateOtp, isLoading, error, success, clearError, setError, setSuccess };
};
