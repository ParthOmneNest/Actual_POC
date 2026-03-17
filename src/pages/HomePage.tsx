import { useAuthStore } from "../store/useAuthStore"
import logo from '../assets/OmneNest_icon.png'

export const HomePage = () => {
    const { logout } = useAuthStore();
    return (
        <div className="flex items-center justify-center min-h-screen bg-white font-inter gap-3">
            <div className="flex flex-col items-center gap-6">
                
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="w-20 h-10 object-contain -mr-10" />
                    <span className="text-2xl font-bold text-[#464646]">NT Web</span>
                </div>

                <h1 className="text-medium font-semibold text-[#2A2A2B]">Dashboard</h1>

                <button
                    onClick={() => logout()}
                    className="px-6 py-2 bg-[#FAEBE9] text-[#CA3521] font-semibold rounded-lg hover:bg-[#f4d6d3] transition-colors cursor-pointer"
                >
                    Logout
                </button>
                
            </div>
        </div>
    );
}