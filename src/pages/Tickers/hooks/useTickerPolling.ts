import { useEffect } from "react";
import { useMarketStore } from "../store/useMarketStore";

export const useTickerPolling = () => {
    const updatePrices = useMarketStore((state) => state.updatePrices);

    useEffect(() => {
        // 1. Instant trigger (No waiting for the first interval)
        updatePrices();

        // 2. High-frequency polling
        const interval = setInterval(() => {
            updatePrices();
        }, 500000000);

        return () => clearInterval(interval);
    }, [updatePrices]);

    return { updatePrices };
};
