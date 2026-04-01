import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import logo from "../assets/OmneNest_icon.png";
import { WatchlistPanel } from "./WatchlistPanel";
import { Modal } from "../shared/components/Modal";
import { OrderList } from "@/features/OrderList/components/OrderList";

export const HomePage = () => {
    const { logout } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-row w-full h-screen bg-[#F5F6F8] font-inter overflow-hidden">
            {/* Left Watchlist Sidebar */}
            {/* <WatchlistPanel /> */}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-stretch bg-white m-2 rounded-lg shadow-sm border border-[#ECEDEE] overflow-hidden">
                <div className="flex flex-col items-center gap-4 py-6 shrink-0 border-b border-gray-50">
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-10 object-contain -mr-10"
                        />
                        <span className="text-2xl font-bold text-[#464646]">
                            NT Web Dashboard
                        </span>
                    </div>

                    <div className="flex flex-row gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 bg-[#0F62FE] text-white font-semibold rounded-lg hover:bg-[#0353e9] transition-colors cursor-pointer shadow-sm"
                        >
                            Open Test Modal
                        </button>
                        <button
                            onClick={() => logout()}
                            className="px-6 py-2 bg-[#FAEBE9] text-[#CA3521] font-semibold rounded-lg hover:bg-[#f4d6d3] transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <OrderList />
                </div>
            </div>

            {/* Reusable Modal Injection */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="System Alert"
            >
                <div className="flex flex-col gap-4 text-[#464646]">
                    <p>This is your reusable modal content!</p>
                    <p className="text-sm text-gray-500">
                        Notice how the background is beautifully blurred behind this window.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="mt-4 px-4 py-2 w-full bg-[#ECEDEE] text-[#464646] font-semibold rounded-lg hover:bg-[#e0e0e0] cursor-pointer transition-colors"
                    >
                        Close Modal
                    </button>
                </div>
            </Modal>
        </div>
    );
};
