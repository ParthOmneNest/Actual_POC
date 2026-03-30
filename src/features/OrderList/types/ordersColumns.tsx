import { createColumnHelper } from "@tanstack/react-table";
import type { Order } from "./orderList.types";

const columnHelper = createColumnHelper<Order>();

export const ordersColumns = [
    columnHelper.accessor("tradingSymbol", {
        header: "Trading Symbol",
    }),
    columnHelper.accessor("transactionType", {
        header: "Buy/Sell",

        cell: (info) => {
            const type = info.getValue()?.toLowerCase();
            const isRejected = type === "buy";

            return (
                <span
                    className={`px-2 py-1 rounded-md font-semibold text-xs uppercase shadow-sm ${isRejected
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                >
                    {info.getValue()}
                </span>
            );
        },
    }),
    columnHelper.accessor("totalQuantity", {
        header: "Total Qty",
    }),
    columnHelper.accessor("price", {
        header: "Price",
    }),
    columnHelper.accessor("orderStatus", {
        header: "Order Status",
        cell: (info) => {
            const status = info.getValue()?.toLowerCase();
            let colorClasses = "bg-yellow-100 text-yellow-700 border-yellow-200"; // Default: Yellow
            if (status === "rejected") {
                colorClasses = "bg-red-100 text-red-700 border-red-200";
            } else if (status === "accepted" || status === "completed") {
                colorClasses = "bg-green-100 text-green-700 border-green-200";
            }

            return (
                <div className="max-w-30 w-full">
                    {" "}
                    <span
                        // title={info.getValue()}
                        className={`px-2 py-1 rounded-md font-semibold text-xs uppercase shadow-sm block truncate border ${colorClasses}`}
                    >
                        {info.getValue()}
                    </span>
                </div>
            );
        },
    }),

    columnHelper.accessor("rejectionReason", {
        header: "Rejection Reason",
        cell: (info) => {
            return (
                <div className="max-w-30 w-full">
                    {" "}
                    <span
                        // title={info.getValue()}
                        className={`px-2 py-1 rounded-md font-semibold text-xs uppercase shadow-sm block truncate border`}
                    >
                        {info.getValue()}
                    </span>
                </div>
            );
        },
    }),
    columnHelper.accessor("productCode", {
        header: "Product",
    }),
    columnHelper.accessor("orderPriceType", {
        header: "Order Type",
    }),
    columnHelper.accessor("averagePrice", {
        header: "Avg. Price",
    }),
    columnHelper.accessor("triggerPrice", {
        header: "Trigger Price",
    }),
    columnHelper.accessor("filledQuantity", {
        header: "Filled",
    }),
    columnHelper.accessor("pendingQuantity", {
        header: "Pending",
    }),

    columnHelper.accessor("exchange", {
        header: "Exchange",
    }),
    columnHelper.accessor("exchangeSegment", {
        header: "Segment",
    }),
    columnHelper.accessor("exchangeOrderNumber", {
        header: "Exchange Order #",
    }),
    columnHelper.accessor("nestOrderNumber", {
        header: "Nest Order #",
    }),
    columnHelper.accessor("orderedTime", {
        header: "Time",
    }),
];
