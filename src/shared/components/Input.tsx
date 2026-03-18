import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                {label && (
                    <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                        {label}
                    </label>
                )}
                <input
                    {...props}
                    ref={ref}
                    className={`w-full px-4 py-3 flex rounded-lg border outline-none font-inter transition-colors focus:border-[#0F62FE] ${
                        error ? "border-[#CA3521] focus:border-[#CA3521]" : "border-gray-200 focus:border-[#0F62FE]"
                    } ${className}`}
                />
                {error && (
                    <p className="text-[#CA3521] font-inter font-medium text-[12px] mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
