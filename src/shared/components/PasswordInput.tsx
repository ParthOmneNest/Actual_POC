import React, { useState } from "react";
import eyeClose from "../../../assets/Eyeclosed.png";
import eyeOpen from "../../../assets/Eyeopen.png";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="flex flex-col gap-1 w-full">
                <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                    {label}
                </label>
                <div className="relative">
                    <input
                        {...props}
                        ref={ref}
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 flex py-3 rounded-lg border outline-none font-inter transition-colors pr-10 focus:border-[#0F62FE] ${
                            error ? "border-[#CA3521] focus:border-[#CA3521]" : "border-gray-200 focus:border-[#0F62FE]"
                        } ${className}`}
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
                {error && (
                    <p className="text-[#CA3521] font-inter font-medium text-[12px] mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";
