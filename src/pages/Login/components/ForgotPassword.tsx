import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../store/useAuthStore";

export const ForgotPassword = () => {
    const { forgotPassword, setStep } = useAuthStore();
    const { register, handleSubmit, watch } = useForm({
        defaultValues: { clientId: "", pan: "" }
    });

    const isFilled = watch("clientId") && watch("pan");

    const onSubmit = async (data: { clientId: string, pan: string }) => {
        await forgotPassword(data.pan, data.clientId);
    };

    return (
        <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Client ID</label>
                    <input 
                        {...register("clientId")} 
                        placeholder="Enter user ID" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0F62FE]"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">PAN</label>
                    <input 
                        {...register("pan")} 
                        placeholder="Enter PAN" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0F62FE]"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!isFilled}
                className={`w-full py-3 rounded-lg text-sm font-medium text-white transition-colors ${
                    isFilled ? "bg-[#0F62FE] cursor-pointer" : "bg-[#ECEDEE] text-gray-400 cursor-not-allowed"
                }`}
            >
                Proceed
            </button>

            <button 
                type="button" 
                onClick={() => setStep('credentials')}
                className="flex items-center justify-center gap-2 text-[#0F62FE] text-sm font-medium cursor-pointer"
            >
                ← Go back
            </button>
        </form>
    );
};