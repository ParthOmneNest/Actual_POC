import { useAuthFlowStore } from '../store/useAuthFlowStore';
import api from '../../../api/axios';
import { useState } from 'react';

export const useSetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setStep = useAuthFlowStore((state) => state.setStep);
    const setFlowMode = useAuthFlowStore((state) => state.setFlowMode);

    // const setPassword=async()

}