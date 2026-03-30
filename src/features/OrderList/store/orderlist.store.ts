import { create } from "zustand";
import type { Order } from "../types/orderList.types";
interface OrderListState {
    orders: Order[];
    loading: boolean;
    error: string | null;
    setOrders: (orders: Order[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const initialState = {
    orders: [],
    loading: false,
    error: null,
};

export const useOrderListStore = create<OrderListState>((set) => ({
    ...initialState,
    setOrders: (orders) => set({ orders }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
