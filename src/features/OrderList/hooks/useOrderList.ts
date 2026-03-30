import { useEffect, useCallback } from "react";
import { fetchOrderList } from "../api/orderlist.api";
import { useOrderListStore } from "../store/orderlist.store";
import type { OrderListPayload } from "../types/orderList.types";
interface UseOrderListOptions {
    payload?: OrderListPayload;
    skip?: number;
    top?: number;
}

const DEFAULT_PAYLOAD: OrderListPayload = { filterOn: [], sortOn: [] };
export const useOrderList = ({
    payload = DEFAULT_PAYLOAD,
    skip = 0,
    top = 10,
}: UseOrderListOptions = {}) => {
    // const [orders, setOrders] = useState<Order[]>([]);
    // const [isLoadingList, setIsLoadingList] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    const { orders, setOrders, loading, setLoading, error, setError } =
        useOrderListStore();

    const loadOrderList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchOrderList(payload, skip, top);
            setOrders(data.orders);
            console.log("API whole data: ", data);
            console.log("API order data: ", data.orders);
        } catch (err) {
            setError("Failed to fetch orders");
            console.error("No data found", err);
        } finally {
            setLoading(false);
        }
    }, [setOrders, setError, setLoading, skip, top, payload]);

    useEffect(() => {
        loadOrderList();
    }, [loadOrderList]);

    return {
        orders,
        loading,
        error,
        loadOrderList,
    };
};
