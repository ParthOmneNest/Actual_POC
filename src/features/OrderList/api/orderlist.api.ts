import api from "@/api/axios";
import type { OrderResponse, OrderListPayload } from "../types/orderList.types";

// fetch all orders list
export const fetchOrderList = async (
    payload: OrderListPayload,
    skip: number,
    top: number,
) => {
    const res = await api.post<OrderResponse>("v3/api/orders/list", payload, {
        params: { skip, top },
    });
    return res.data;
};
