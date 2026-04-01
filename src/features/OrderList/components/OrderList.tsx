import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    type ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useOrderList } from "../hooks/useOrderList";
import type { Order } from "../types/orderList.types";
import { useMemo, useState } from "react";
import { ordersColumns } from "../types/ordersColumns";

export const OrderList = () => {
    const { orders, loading, error } = useOrderList();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [multiplier, setMultiplier] = useState(1);
    const BothSortIcon = () => (
        <svg
            className={` text-[#555555] `}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"
            />
        </svg>
    );
    const DownSortIcon = () => (
        <svg
            className={` text-[#555555]  `}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19V5m0 14-4-4m4 4 4-4"
            />
        </svg>
    );

    const UpSortIcon = () => (
        <svg
            className={` text-[#555555]  `}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v13m0-13 4 4m-4-4-4 4"
            />
        </svg>
    );
    const SearchIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
        >
            <path
                d="M14 14L11.1067 11.1067M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                stroke="#555555"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );

    const multipliedData = useMemo(() => {
        if (!orders) return [];

        let result: Order[] = [];
        for (let i = 0; i < multiplier; i++) {
            const clones = orders.map((order) => {
                const clone = {
                    ...order,
                    nestOrderNumber: `${order.nestOrderNumber}_${i}`,
                    scripName:
                        i === 0 ? order.scripName : `${order.scripName} (Copy ${i})`,
                };

                return clone as unknown as Order;
            });

            result = [...result, ...clones];
        }
        return result;
    }, [orders, multiplier]);
    const table = useReactTable<Order>({
        data: multipliedData,
        columns: ordersColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        debugTable: true,
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    });

    if (loading) return <p>The market is waking up...</p>;
    if (error) return <p>Connection error: {error}</p>;

    // Place this outside your component
    const generatePaginationLinks = (currentPage: number, pageCount: number) => {
        // If there are 7 or fewer pages, just show them all. No need for dots.
        if (pageCount <= 7) {
            return Array.from({ length: pageCount }, (_, i) => i + 1);
        }

        // If we are near the beginning (e.g., pages 1, 2, 3)
        if (currentPage <= 3) {
            return [1, 2, 3, 4, 5, "...", pageCount];
        }

        // If we are near the end (e.g., pages 8, 9, 10)
        if (currentPage >= pageCount - 2) {
            return [
                1,
                "...",
                pageCount - 4,
                pageCount - 3,
                pageCount - 2,
                pageCount - 1,
                pageCount,
            ];
        }

        // If we are somewhere in the middle
        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            pageCount,
        ];
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">
                {loading ? "Loading..." : `Orders: ${orders.length}`}
            </h2>
            <div className="flex items-center gap-4 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="text-sm font-semibold text-gray-600">
                    Page Multiplier:
                </label>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded bg-white outline-none focus:border-blue-500"
                />
                <span className="text-xs text-gray-400 italic">
                    Total Rows: {multipliedData.length}
                </span>
            </div>
            <div className="relative flex-1 overflow-auto border rounded-t-2xl border-gray-300 shadow-sm no-scrollbar">
                <table className="min-w-full border-collapse">
                    <thead className="sticky top-0 z-20">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const isSorted = header.column.getIsSorted();
                                    const columnId = header.column.id;

                                    const showSearch =
                                        columnId === "scripName" || columnId === "nestOrderNumber";
                                    const notShowSearch = columnId === "nestOrderNumber";

                                    const filterValue = header.column.getFilterValue() as string;
                                    return (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="bg-[#ECEDEE] border-b border-[#E3E4E5] px-4 py-3 text-left text-[#2A2A2B] select-none cursor-pointer group whitespace-nowrap min-w-120px"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-inter font-medium text-[14px] first-letter-capital tracking-wider">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {showSearch && (
                                                        <div
                                                            className="flex items-center gap-1 bg-white/80 border border-gray-300 rounded px-1.5 py-0.5 focus-within:border-blue-500 transition-all"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <SearchIcon />
                                                            <input
                                                                type="text"
                                                                placeholder="Filter..."
                                                                value={filterValue ?? ""}
                                                                onChange={(e) =>
                                                                    header.column.setFilterValue(e.target.value)
                                                                }
                                                                className="w-full bg-transparent outline-none text-[11px] text-[#2A2A2B] placeholder:text-gray-400"
                                                            />
                                                        </div>
                                                    )}
                                                    <span className="flex justify-end">
                                                        {!notShowSearch &&
                                                            header.column.getCanSort() &&
                                                            ({
                                                                asc: <UpSortIcon />,
                                                                desc: <DownSortIcon />,
                                                            }[isSorted as string] ?? <BothSortIcon />)}
                                                    </span>
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => {
                                return (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-blue-50 cursor-pointer odd:bg-[#FFFFFF] even:bg-[#F9F9F9] border-none"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={`px-3 py-3 text-sm font-inter font-[400px] border-x border-gray-300 transition-all border-none text-[2A2A2B] text-left
                                                    `}
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

                <div className="flex items-center justify-between mt-4 bg-white p-3 border border-t-0 border-gray-300 rounded-b-2xl shadow-sm shrink-0">
                    <span className="text-sm font-inter text-gray-500">
                        Showing page{" "}
                        <strong className="text-[#2A2A2B]">
                            {table.getState().pagination.pageIndex + 1}
                        </strong>{" "}
                        of{" "}
                        <strong className="text-[#2A2A2B]">{table.getPageCount()}</strong>
                    </span>

                    <div className="flex items-center gap-1">
                        {/* Previous Button */}
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-colors"
                        >
                            Prev
                        </button>

                        {/* Dynamic Page Numbers */}
                        <div className="flex items-center gap-1 px-2">
                            {generatePaginationLinks(
                                table.getState().pagination.pageIndex + 1,
                                table.getPageCount(),
                            ).map((page, index) => {
                                if (page === "...") {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-2 py-1 text-gray-400 select-none"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                const isCurrentPage =
                                    table.getState().pagination.pageIndex + 1 === page;

                                return (
                                    <button
                                        key={`page-${page}`}
                                        onClick={() => table.setPageIndex((page as number) - 1)}
                                        className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-md transition-colors cursor-pointer ${isCurrentPage
                                                ? "bg-[#0F62FE] text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
