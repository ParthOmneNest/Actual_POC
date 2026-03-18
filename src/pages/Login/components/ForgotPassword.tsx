import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";

export const ForgotPassword = () => {
    const [mode, setMode] = useState<'password' | 'userid'>('password');
    const { forgotPassword, forgotUserId, setStep } = useAuthStore();
    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: { identifier: "", pan: "" }
    });

    const isFilled = watch("identifier") && watch("pan");

    const onSubmit = async (data: { identifier: string, pan: string }) => {
        if (mode === 'password') {
            await forgotPassword(data.pan, data.identifier);
        } else {
            await forgotUserId(data.pan, data.identifier)
        }
    };

    const handleTabChange = (newMode: 'password' | 'userid') => {
        setMode(newMode);
        reset();
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row border-b border-[#ECEDEE] mb-8">
                <button type="button"
                onClick={()=>handleTabChange('password')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all
                    ${
                        mode==='password'?
                        'border-b-2 text-[#0F62FE] border-[#0F62FE]'
                        :'border-b-2 text-[#555555] border-[#ECEDEE] '
                        }
                    `}
                >
                    Forgot Password
                </button>
                <button type="button"
                onClick={()=>handleTabChange('userid')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all
                    ${
                        mode==='userid'?
                        'border-b-2 text-[#0F62FE] border-[#0F62FE]'
                        :'border-b-2 text-[#555555] border-[#ECEDEE]'
                        }
                    `}
                >
                    Forgot User ID
                </button>

            </div>
            <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#555555]">{mode === 'password' ? 'Client ID' : 'Mobile / Email'}</label>
                        <input
                            {...register("identifier")}
                            placeholder={mode === 'password' ? "Enter user ID" : "Enter mobile / user ID"}
                            className="w-full px-4 py-3 rounded-lg border border-[#555555] outline-none focus:border-[#0F62FE]
                            placeholder:text[#555555]"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#555555]">PAN</label>
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
                    className={`w-full py-3 rounded-lg text-sm font-medium text-white transition-colors ${isFilled ? "bg-[#0F62FE] cursor-pointer" : "bg-[#ECEDEE] text-gray-400 cursor-not-allowed"
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
        </div>

    );
};