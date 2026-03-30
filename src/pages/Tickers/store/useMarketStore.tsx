import { create } from "zustand";

export interface TickerData {
    price: number;
    amount: number;
    lastDirection: "up" | "down" | "none";
}

interface MarketStore {
    tickers: TickerData[];
    setTickers: (data: TickerData[]) => void;
    updatePrices: () => void;
}

export const useMarketStore = create<MarketStore>((set) => ({
    // Initial Seed
    tickers: [
        { price: 65120, amount: -0.45, lastDirection: "none" },
        { price: 65080, amount: -0.12, lastDirection: "none" },
        { price: 65040, amount: -0.055, lastDirection: "none" },
        { price: 64995, amount: 0.082, lastDirection: "none" },
        { price: 64950, amount: 0.15, lastDirection: "none" },
        { price: 64915, amount: 0.32, lastDirection: "none" },
        { price: 64215, amount: 0.67, lastDirection: "none" },
        { price: 62935, amount: 0.12, lastDirection: "none" },
    ],

    setTickers: (newTickers) => set({ tickers: newTickers }),

    updatePrices: () =>
        set((state) => ({
            tickers: state.tickers.map((t) => {
                // Random fluctuation (0.02% max)
                const change = (Math.random() - 0.5) * (t.price * 0.0002);
                const newPrice = t.price + change;

                return {
                    ...t,
                    lastDirection: change > 0 ? "up" : "down",
                    price: newPrice,
                    total: newPrice * t.amount, // Amount is static, Price fluctuates
                };
            }),
        })),
}));
