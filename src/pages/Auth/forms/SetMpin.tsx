import { useState } from "react";
import badgeGreen from "../../../assets/badge-check-green.png";
import { Button } from "../../../shared/components/Button";
import { OtpInputBoxes } from "../../../shared/components/OtpInputBoxes";
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
                    <OtpInputBoxes
                        value={mpin}
                        onChange={setMpin}
                        idPrefix="mpin"
                        type="password"
                        onCompleteRow={() => document.getElementById('confirm-mpin-0')?.focus()}
                    />
                </div>

                {/* Re-enter MPIN */}
                <div className="flex flex-col gap-2">
                    <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                        Re-enter MPIN
                    </label>
                    <OtpInputBoxes
                        value={confirmMpin}
                        onChange={setConfirmMpin}
                        error={isConfirmMpinFilled && !doMpinsMatch}
                        idPrefix="confirm-mpin"
                        type="password"
                        onBackspaceFirst={() => document.getElementById('mpin-3')?.focus()}
                    />
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
            <Button
                type="submit"
                disabled={!doMpinsMatch || isSuccess}
                className="mt-2"
            >
                Set MPIN
            </Button>
            
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
