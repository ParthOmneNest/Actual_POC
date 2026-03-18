import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../store/useAuthStore";
import { setPasswordSchema, type SetPasswordData } from "../schema/login.otpSchema";

import eyeClose from "../../../assets/Eyeclosed.png";
import eyeOpen from "../../../assets/Eyeopen.png";
import badgeGreen from "../../../assets/badge-check-green.png";
import badgeGray from "../../../assets/badge-check.png";

export const SetPassword = () => {

    const { error } = useAuthStore();
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SetPasswordData>({
        resolver: zodResolver(setPasswordSchema),
        mode: "onChange",
    });

    const passwordValue = watch("password", "");
    const confirmPasswordValue = watch("confirmPassword", "");

    // Validation rules checks
    const hasMinLength = passwordValue.length >= 10;
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue);
    const passwordsMatch = passwordValue === confirmPasswordValue && passwordValue.length > 0;

    // The form is valid if all rules pass and passwords match
    const isValid = hasMinLength && hasNumber && hasSpecialChar && passwordsMatch;

    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = async (data: SetPasswordData) => {
        // TODO: Call actual API from store here
        console.log("Setting password data:", data);
        
        // Simulating API response delay
        setTimeout(() => setIsSuccess(true), 1000);
        
        // Simulating success, move to next step or home page
        // setStep("success"); // or whatever logic you have to transition to the homepage
    };

    return (
        <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit(onSubmit)}>

            <div className="flex flex-col gap-4">
                {/* New Password */}
                <div className="flex flex-col gap-1">
                    <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
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

                {/* Re-enter Password */}
                <div className="flex flex-col gap-1">
                    <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                        Re-enter Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter new password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0F62FE] transition-colors pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            <img
                                src={showConfirmPassword ? eyeOpen : eyeClose}
                                alt={showConfirmPassword ? "hide password" : "show password"}
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-[#CA3521] font-inter font-medium text-[12px] mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Password Rules Indicators */}
            <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                    <img src={hasMinLength ? badgeGreen : badgeGray} alt="badge" className="w-4 h-4" />
                    <span className={`text-sm font-inter ${hasMinLength ? "text-gray-800" : "text-gray-500"}`}>
                        Minimum 10 characters
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <img src={hasNumber ? badgeGreen : badgeGray} alt="badge" className="w-4 h-4" />
                    <span className={`text-sm font-inter ${hasNumber ? "text-gray-800" : "text-gray-500"}`}>
                        Minimum 1 digit
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <img src={hasSpecialChar ? badgeGreen : badgeGray} alt="badge" className="w-4 h-4" />
                    <span className={`text-sm font-inter ${hasSpecialChar ? "text-gray-800" : "text-gray-500"}`}>
                        Minimum 1 special character
                    </span>
                </div>
            </div>

            {error && (
                <p className="text-[#CA3521] font-inter font-medium text-[14px]">
                    {error}
                </p>
            )}

            {/* Set Password Button */}
            <button
                type="submit"
                disabled={!isValid || isSuccess}
                className={`w-full py-3 rounded-lg text-sm font-medium transition-colors duration-200 mt-4 text-[#FFFFFF] ${
                    isValid && !isSuccess
                        ? "bg-[#0F62FE] cursor-pointer"
                        : "bg-[#ECEDEE] cursor-not-allowed text-gray-400"
                }`}
            >
                Set password
            </button>
            
            {/* Success Message UI */}
            {isSuccess && (
                <div className="flex items-center gap-2 w-full p-4 rounded-lg bg-[#E8F2EE]">
                    <img src={badgeGreen} alt="success" className="w-5 h-5" />
                    <span className="font-inter text-[14px] font-medium text-[#198055]">
                        New password has been successfully created
                    </span>
                </div>
            )}
        </form>
    );
};
