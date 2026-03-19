import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { PasswordInput } from "../../../shared/components/PasswordInput";
import { useAuthStore } from "../../../store/useAuthStore";
import { loginSchema, type LoginFormData } from "../schema/login.otpSchema";

import badgeGreen from "../../../assets/badge-check-green.png";
import cautionIcon from "../../../assets/Error.png";
import qrcode from "../../../assets/scan-qr-code.png";

export const CredentialsForm = () => {
    const { login, error, success, setStep } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange", // Validates as the user types, making isValid reliable
    });

    const onLoginSubmit = async (data: LoginFormData) => {
        await login(data);
    };
    const isLocked = error?.startsWith("LOCKED");

    return (
        <form
            className="flex flex-col w-full gap-6"
            onSubmit={handleSubmit(onLoginSubmit)}
        >
            {/* Username + Password */}
            <div className="flex flex-col gap-4">

                {/* Username */}
                <Input
                    {...register("username")}
                    label="Mobile no. / Email / Client ID"
                    placeholder="Enter Mobile no. / Email"
                />

                {/* Password */}
                <PasswordInput
                    {...register("password")}
                    label="Password / MPIN"
                    placeholder="Enter password / MPIN"
                />

            </div>

            {/* Actions: QR, Login Button, Links */}
            <div className="flex flex-col gap-3">

                {/* QR Code */}
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 text-[#0F62FE] cursor-pointer"
                >
                    <img src={qrcode} className="w-4 h-4" />
                    Login with QR Code
                </button>

                {/* Login Button */}
                <Button
                    type="submit"
                    disabled={!isValid}
                >
                    Login
                </Button>

                {/* Links */}
                <div className="flex flex-row justify-between items-center mt-2">
                    <button
                        type="button"
                        className="text-sm text-[#0F62FE] cursor-pointer hover:underline"
                        onClick={() => setStep('forgot-credentials')}
                    >
                        Forgot user ID or password?
                    </button>
                    <button type="button" className="text-sm text-[#0F62FE] cursor-pointer hover:underline">
                        Guest login
                    </button>
                </div>

            </div>
            {(error || success || errors.username || errors.password) && (
                <div className={`flex flex-col gap-2 px-4 py-3 rounded-lg mt-4 transition-all duration-300
        ${success ? "bg-[#E8F2EE] text-[#198055]" : "bg-[#FAEBE9] text-[#CA3521]"} 
    `}>
                    
                    <div className="flex flex-row items-start gap-2">
                        <img
                            src={success ? badgeGreen : cautionIcon}
                            alt="status"
                            className="w-4 h-4 mt-0.5 shrink-0"
                        />
                        <p className="font-inter font-medium text-[14px] leading-5 tracking-normal">
                            {error || success || errors.username?.message || errors.password?.message}
                        </p>
                    </div>

                    {isLocked && !success && (
                        <button
                            type="button"
                            onClick={() => setStep('unblock-user')}
                            className="bg-[#faebe9] text-[rgb(202,53,33)] cursor-pointer text-left text-[13px] font-bold underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity ml-6"
                        >
                           Account locked? Click here to unblock
                        </button>
                    )}
                </div>
            )}

        </form>
    );
};
