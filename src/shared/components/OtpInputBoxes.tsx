import React from "react";

export interface OtpInputBoxesProps {
    value: string[];
    onChange: (value: string[]) => void;
    error?: boolean;
    idPrefix?: string;
    type?: "text" | "password";
    onCompleteRow?: () => void;
    onBackspaceFirst?: () => void;
}

export const OtpInputBoxes: React.FC<OtpInputBoxesProps> = ({
    value,
    onChange,
    error,
    idPrefix = "otp",
    type = "text",
    onCompleteRow,
    onBackspaceFirst,
}) => {
    
    const handleChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return; // Only allow digits
        
        const newArray = [...value];
        newArray[index] = val.slice(-1);
        onChange(newArray);
        
        // Auto-focus next input
        if (val && index < value.length - 1) {
            document.getElementById(`${idPrefix}-${index + 1}`)?.focus();
        } else if (val && index === value.length - 1) {
            if (onCompleteRow) onCompleteRow();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !value[index]) {
            if (index > 0) {
                document.getElementById(`${idPrefix}-${index - 1}`)?.focus();
            } else {
                if (onBackspaceFirst) onBackspaceFirst();
            }
        }
    };

    return (
        <div className="flex flex-row justify-between gap-3">
            {value.map((val, index) => (
                <input
                    key={`${idPrefix}-${index}`}
                    id={`${idPrefix}-${index}`}
                    type={type}
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`
                        w-full h-12 flex text-center rounded-lg
                        text-xl font-medium font-inter
                        outline-none transition-colors
                        ${error
                            ? "border border-[#CA3521] focus:border-[#CA3521]"
                            : "border border-gray-200 focus:border-[#0F62FE]"
                        }
                    `}
                />
            ))}
        </div>
    );
};
