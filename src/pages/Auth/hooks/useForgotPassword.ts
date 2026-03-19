import { useState } from 'react';
import { useAuthFlowStore } from '../store/useAuthFlowStore';
import api from '../../../api/axios';

export const useForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setStep = useAuthFlowStore((state) => state.setStep);
    const setFlowMode = useAuthFlowStore((state) => state.setFlowMode);
    const setLoginUsername = useAuthFlowStore((state) => state.setLoginUsername);

    const forgotPassword = async (pan: string, username: string) => {
        setIsLoading(true);
        setError(null);
        setFlowMode('forgot-password');

        try {
            await api.post("/v1/api/auth/forgot-password", { panNumber: pan, username });
            setLoginUsername(username);
            setStep('otp');
        } catch (err: any) {
            const backendError = err.response?.data?.errors?.[0]?.errorMessage;
            setError(backendError || "Invalid Details");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return { forgotPassword, isLoading, error, clearError, setError };
};
