import { useAuthStore } from "../store/useAuthStore"

export const HomePage = () => {
    const { logout } = useAuthStore();
    const handleLogout = () => {
        console.log("logging out..")
        logout();
    }
    return (
        <div>
            <h1>HomePage</h1>
            <button
                onClick={handleLogout}
                className="px-6 py-2 mt-4 bg-[#FAEBE9] text-[#CA3521] font-medium rounded-lg transition-colors hover:bg-[#f4d6d3] cursor-pointer"
            >
                Logout
            </button>
        </div>
    )
}