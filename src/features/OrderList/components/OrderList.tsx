import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useOrderList } from "../hooks/useOrderList";
import type { Order } from "../types/orderList.types";
import { ordersColumns } from "../types/ordersColumns";

export const OrderList = () => {
    const { orders, loading, error } = useOrderList();
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const table = useReactTable<Order>({
        data: orders,
        columns: ordersColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    if (loading) return <p>The market is waking up...</p>;
    if (error) return <p>Connection error: {error}</p>;

    return (
        <div className="p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">
                {loading ? "Loading..." : `Orders: ${orders.length}`}
            </h2>

            <div className="overflow-auto ">
                <table className="min-w-full border rounded-2xl border-gray-300">
                    <thead className="bg-gray-100 border-b-2">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border border-gray-300 px-4 py-2 text-left"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => {
                                const isSelected = selectedRowId === row.id;
                                return (
                                    <tr
                                        key={row.id}
                                        onClick={() => setSelectedRowId(row.id)}
                                        className="hover:bg-blue-50 cursor-pointer"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={`px-4 py-2 text-sm border-x border-gray-300 transition-all ${isSelected
                                                        ? "border-y-2 border-y-blue-600 bg-blue-50"
                                                        : "border-y border-y-gray-300"
                                                    }`}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={ordersColumns.length} className=" text-gray-500">
                                    No trades found in the ledger.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
