import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost"; 
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    isLoading = false,
    className = "",
    disabled,
    ...props
}) => {
    
    const baseStyles = "w-full py-3 flex justify-center items-center rounded-lg text-sm font-medium transition-colors duration-200 font-inter";
    let variantStyles = "";
    
    if (variant === "primary") {
        variantStyles = disabled || isLoading
            ? "bg-[#ECEDEE] text-gray-400 cursor-not-allowed"
            : "bg-[#0F62FE] text-[#FFFFFF] cursor-pointer";
    }

    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {isLoading ? "Loading..." : children}
        </button>
    );
};
