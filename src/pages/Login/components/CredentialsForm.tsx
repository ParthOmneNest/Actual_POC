import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../store/useAuthStore";
import { loginSchema, type LoginFormData } from "../schema/login.otpSchema";

import badgeGreen from "../../../assets/badge-check-green.png";
import cautionIcon from "../../../assets/Error.png";
import eyeClose from "../../../assets/Eyeclosed.png";
import eyeOpen from "../../../assets/Eyeopen.png";
import qrcode from "../../../assets/scan-qr-code.png";

export const CredentialsForm = () => {
    const { login, error, setStep } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

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

    return (
        <form
            className="flex flex-col w-full gap-6"
            onSubmit={handleSubmit(onLoginSubmit)}
        >
            {/* Username + Password */}
            <div className="flex flex-col gap-4">

                {/* Username */}
                <div className="flex flex-col gap-1">
                    <label className="font-inter font-medium text-sm leading-none tracking-normal">
                        Mobile no. / Email / Client ID
                    </label>
                    <input
                        {...register("username")}
                        placeholder="Enter Mobile no. / Email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0F62FE] transition-colors"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <label className="font-inter font-medium text-sm leading-none tracking-normal">
                        Password / MPIN
                    </label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password / MPIN"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0F62FE] transition-colors pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            <img
                                src={showPassword ? eyeOpen : eyeClose}
                                alt={showPassword ? "hide password" : "show password"}
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>

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
                <button
                    type="submit"
                    disabled={!isValid}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-[#FFFFFF] ${isValid
                            ? "bg-[#0F62FE] cursor-pointer"
                            : "bg-[#ECEDEE] cursor-not-allowed"
                        }`}
                >
                    Login
                </button>

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

            {error && (
                <div className={`flex flex-row items-center gap-2 px-4 py-3 rounded-lg mt-4 
        ${error.includes("sent") || error.includes("successfully")
                        ? "bg-[#E8F2EE] text-[#198055]" 
                        : "bg-[#FAEBE9] text-[#CA3521]" 
                    }`}
                >
                    <img
                        src={error.includes("sent") ? badgeGreen : cautionIcon}
                        alt="status"
                        className="w-4 h-4 shrink-0"
                    />
                    <p className="font-inter font-medium text-[14px] leading-5 tracking-normal">
                        {error ? error : "Invalid username or password"}
                    </p>
                </div>
            )}

        </form>
    );
};
