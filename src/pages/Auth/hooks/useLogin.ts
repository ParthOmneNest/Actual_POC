import { useState } from 'react';
import { useAuthFlowStore } from '../store/useAuthFlowStore';
import type { LoginPayload } from '../types/auth.types';
import api from '../../../api/axios';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const setStep = useAuthFlowStore((state) => state.setStep);
    const setLoginUsername = useAuthFlowStore((state) => state.setLoginUsername);
    const setFlowMode = useAuthFlowStore((state) => state.setFlowMode);

    const login = async (payload: LoginPayload) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        setFlowMode('login');

        try {
            await api.post("/v1/api/auth/login", { 
                username: payload.username, 
                password: payload.password 
            });
            setLoginUsername(payload.username);
            setStep('otp');
        } catch (err: any) {
            if (err.response?.status === 423) {
                setError("LOCKED: " + (err.response?.data?.message || "Account locked."));
            } else {
                setError(err.response?.data?.message || "Invalid user ID or password");
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
        setSuccess(null);
    };

    return { login, isLoading, error, success, clearError, setError, setSuccess };
};
