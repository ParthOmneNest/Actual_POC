import { useState } from 'react';
import { useAuthFlowStore } from '../store/useAuthFlowStore';
import api from '../../../api/axios';

export const useUnblockUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setStep = useAuthFlowStore((state) => state.setStep);
    const setFlowMode = useAuthFlowStore((state) => state.setFlowMode);
    const setLoginUsername = useAuthFlowStore((state) => state.setLoginUsername);

    const unblockUser = async (panNumber: string, username: string) => {
        setIsLoading(true);
        setError(null);
        setFlowMode('unblock-user');

        try {
            await api.post("/v1/api/auth/unblock-user", { panNumber, username });
            setLoginUsername(username);
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || "Unblock request failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return { unblockUser, isLoading, error, clearError, setError };
};
