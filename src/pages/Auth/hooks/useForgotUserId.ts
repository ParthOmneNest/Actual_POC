import { useState } from 'react';
import { useAuthFlowStore } from '../store/useAuthFlowStore';
import api from '../../../api/axios';

export const useForgotUserId = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setStep = useAuthFlowStore((state) => state.setStep);
    const setFlowMode = useAuthFlowStore((state) => state.setFlowMode);

    const forgotUserId = async (pan: string, email: string) => {
        setIsLoading(true);
        setError(null);
        setFlowMode('forgot-id');

        try {
            await api.post("/v1/api/auth/forgot-user-id", { panNumber: pan, emailId: email });
            setStep('credentials');
        } catch (err: any) {
            const backendError = err.response?.data?.errors?.[0]?.errorMessage;
            setError(backendError || "Failed to retrieve User ID");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return { forgotUserId, isLoading, error, clearError, setError };
};
