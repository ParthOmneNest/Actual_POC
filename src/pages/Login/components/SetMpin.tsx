import { useState } from "react";
import badgeGreen from "../../../assets/badge-check-green.png";
import { useAuthStore } from "../../../store/useAuthStore";

export const SetMpin = () => {
    // Note: Assuming there is a `setMpin` or similar action in useAuthStore for submitting this form.
    const { error } = useAuthStore();
    
    // State for the two 4-digit MPIN arrays
    const [mpin, setMpin] = useState<string[]>(["", "", "", ""]);
    const [confirmMpin, setConfirmMpin] = useState<string[]>(["", "", "", ""]);
    
    // UI states
    const [isSuccess, setIsSuccess] = useState(false);

    // Validation checks
    const isMpinFilled = mpin.every((val) => val !== "");
    const isConfirmMpinFilled = confirmMpin.every((val) => val !== "");
    const doMpinsMatch = isMpinFilled && isConfirmMpinFilled && mpin.join("") === confirmMpin.join("");

    // Handle Individual MPIN Input Changes (for the first row)
    const handleMpinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits
        
        const newMpin = [...mpin];
        newMpin[index] = value.slice(-1); // Take only the last typed character
        setMpin(newMpin);
        
        // Auto-focus next input in the first row
        if (value && index < 3) {
            document.getElementById(`mpin-${index + 1}`)?.focus();
        } else if (value && index === 3) {
            // Move to the first box of confirm row after finishing the first row
             document.getElementById(`confirm-mpin-0`)?.focus();
        }
    };

    // Handle Backspace for Auto-focus Previous (first row)
    const handleMpinKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !mpin[index] && index > 0) {
            document.getElementById(`mpin-${index - 1}`)?.focus();
        }
    };

    // Handle Individual Confirm MPIN Input Changes (for the second row)
    const handleConfirmMpinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits
        
        const newConfirmMpin = [...confirmMpin];
        newConfirmMpin[index] = value.slice(-1);
        setConfirmMpin(newConfirmMpin);
        
        // Auto-focus next input in the second row
        if (value && index < 3) {
            document.getElementById(`confirm-mpin-${index + 1}`)?.focus();
        }
    };

    // Handle Backspace for Auto-focus Previous (second row)
    const handleConfirmMpinKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !confirmMpin[index] && index > 0) {
            document.getElementById(`confirm-mpin-${index - 1}`)?.focus();
        } else if (e.key === "Backspace" && !confirmMpin[index] && index === 0) {
            // Move back to the last box of the first row
            document.getElementById(`mpin-3`)?.focus();
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!doMpinsMatch) return;

        const finalMpin = mpin.join("");
        console.log("Setting MPIN:", finalMpin);
        
        // Simulating API response delay
        setTimeout(() => setIsSuccess(true), 1000);
        
        // Simulating success, move to next step or home page
        // setStep("success"); // or whatever logic you have to transition to the homepage
    };

    return (
        <form className="flex flex-col w-full gap-6" onSubmit={onSubmit}>
            
            <div className="flex flex-col gap-1">
                <h4 className="font-inter text-sm text-gray-500">
                    Set a new MPIN for quick access.
                </h4>
            </div>

            <div className="flex flex-col gap-6">
                
                {/* Enter MPIN */}
                <div className="flex flex-col gap-2">
                    <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                        Enter MPIN
                    </label>
                    <div className="flex flex-row justify-between gap-3">
                        {mpin.map((val, index) => (
                            <input
                                key={`mpin-${index}`}
                                id={`mpin-${index}`}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={val}
                                onChange={(e) => handleMpinChange(index, e.target.value)}
                                onKeyDown={(e) => handleMpinKeyDown(index, e)}
                                className="w-full h-12 text-center rounded-lg text-xl font-medium font-inter outline-none transition-colors border border-gray-200 focus:border-[#0F62FE]"
                            />
                        ))}
                    </div>
                </div>

                {/* Re-enter MPIN */}
                <div className="flex flex-col gap-2">
                    <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                        Re-enter MPIN
                    </label>
                    <div className="flex flex-row justify-between gap-3">
                        {confirmMpin.map((val, index) => (
                            <input
                                key={`confirm-mpin-${index}`}
                                id={`confirm-mpin-${index}`}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={val}
                                onChange={(e) => handleConfirmMpinChange(index, e.target.value)}
                                onKeyDown={(e) => handleConfirmMpinKeyDown(index, e)}
                                className={`w-full h-12 text-center rounded-lg text-xl font-medium font-inter outline-none transition-colors ${
                                    isConfirmMpinFilled && !doMpinsMatch
                                        ? "border border-[#CA3521] focus:border-[#CA3521]"
                                        : "border border-gray-200 focus:border-[#0F62FE]"
                                }`}
                            />
                        ))}
                    </div>
                    {/* Validation Error Message */}
                    {isConfirmMpinFilled && !doMpinsMatch && (
                        <p className="text-[#CA3521] font-inter font-medium text-[12px] mt-1">
                            MPINs do not match
                        </p>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-[#CA3521] font-inter font-medium text-[14px]">
                    {error}
                </p>
            )}

            {/* Set MPIN Button */}
            <button
                type="submit"
                disabled={!doMpinsMatch || isSuccess}
                className={`w-full py-3 rounded-lg text-sm font-medium transition-colors duration-200 mt-2 text-[#FFFFFF] ${
                    doMpinsMatch && !isSuccess
                        ? "bg-[#0F62FE] cursor-pointer"
                        : "bg-[#ECEDEE] cursor-not-allowed text-gray-400"
                }`}
            >
                Set MPIN
            </button>
            
            {/* Success Message UI */}
            {isSuccess && (
                <div className="flex items-center gap-2 w-full p-4 rounded-lg bg-[#E8F2EE]">
                    <img src={badgeGreen} alt="success" className="w-5 h-5" />
                    <span className="font-inter text-[14px] font-medium text-[#198055]">
                        New MPIN has been successfully created
                    </span>
                </div>
            )}
        </form>
    );
};
