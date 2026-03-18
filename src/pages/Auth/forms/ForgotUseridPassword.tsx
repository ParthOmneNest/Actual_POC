import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { useAuthStore } from "../../../store/useAuthStore";

export const ForgotUseridPassword = () => {
    const [mode, setMode] = useState<'password' | 'userid'>('password');
    const { forgotPassword, forgotUserId, setStep,clearError } = useAuthStore();
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
                    <Input
                        {...register("identifier")}
                        label={mode === 'password' ? 'Client ID' : 'Mobile / Email'}
                        placeholder={mode === 'password' ? "Enter user ID" : "Enter mobile / user ID"}
                    />
                    <Input
                        {...register("pan")}
                        label="PAN"
                        placeholder="Enter PAN"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!isFilled}
                >
                    Proceed
                </Button>

                <button
                    type="button"
                    onClick={() =>{
                        setStep('credentials')
                        clearError();
                    }} 
                    className="flex items-center justify-center gap-2 text-[#0F62FE] text-sm font-medium cursor-pointer"
                >
                    ← Go back
                </button>
            </form>
        </div>

    );
};