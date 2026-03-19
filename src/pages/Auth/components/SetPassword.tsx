import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/components/Button";
import { PasswordInput } from "../../../shared/components/PasswordInput";

import { setPasswordSchema, type SetPasswordData } from "../schema/auth.schema";

import badgeGreen from "../../../assets/badge-check-green.png";
import badgeGray from "../../../assets/badge-check.png";

export const SetPassword = () => {

    const error: string | null = null;

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
                <PasswordInput
                    {...register("password")}
                    label="New Password"
                    placeholder="Enter new password"
                />

                {/* Re-enter Password */}
                <PasswordInput
                    {...register("confirmPassword")}
                    label="Re-enter Password"
                    placeholder="Re-enter new password"
                    error={errors.confirmPassword?.message}
                />
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
            <Button
                type="submit"
                disabled={!isValid || isSuccess}
                className="mt-4"
            >
                Set password
            </Button>
            
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
