import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../store/useAuthStore";
import { otpSchema, type OtpFormData } from "../schema/login.otpSchema";

export const OtpVerificationForm = () => {
    const { validateOtp, error } = useAuthStore();
    const phoneNumber = useAuthStore.getState().user?.phoneNumber;
    const storedUsername = useAuthStore.getState().loginUsername;

    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const isOtpFilled = otp.every((val) => val !== "");

    const {
        formState: { errors: otpErrors },
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    // Handle Countdown Timer
    useEffect(() => {
        if (timer === 0) {
            setCanResend(true);
            return;
        }
        const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(countdown);
    }, [timer]);

    // Handle Individual OTP Input Changes
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits
        
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only the last typed character
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    // Handle Backspace for Auto-focus Previous
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleResend = () => {
        setTimer(30);
        setCanResend(false);
        setOtp(["", "", "", ""]);
    };

    const onOtpSubmit = async (e: React.ChangeEvent) => {
        e.preventDefault();

        if (!storedUsername) {
            console.error("We have lost the username.");
            return;
        }

        const finalOtpString = otp.join("");
        console.log(`Sending OTP: ${finalOtpString} for User: ${storedUsername}`);
        
        await validateOtp({
            username: storedUsername,
            otp: parseInt(finalOtpString, 10),
        });
    };

    return (
        <form
            className="flex flex-col w-full gap-6"
            onSubmit={onOtpSubmit}
        >
            {/* Header / Info */}
            <div className="flex flex-col gap-1">
                <h4 className="font-inter font-semibold text-lg">
                    Enter OTP
                </h4>
                <p className="font-inter text-sm text-gray-500">
                    OTP Sent on +91 {phoneNumber}
                </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between gap-3">
                    {otp.map((val, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className={`
                                w-full h-12 text-center rounded-lg
                                text-base font-medium font-inter
                                outline-none transition-colors
                                ${error || otpErrors.otp
                                    ? "border border-[#CA3521] focus:border-[#CA3521]"
                                    : "border border-gray-200 focus:border-[#0F62FE]"
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Validation Error Message */}
                {(otpErrors.otp || error) && (
                    <p className="text-[#CA3521] font-inter font-medium text-[14px] leading-5 tracking-normal text-right">
                        {error || otpErrors.otp?.message}
                    </p>
                )}
            </div>

            {/* Resend Action */}
            <div className="flex justify-end mt-2">
                {canResend ? (
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-sm text-[#0F62FE] font-medium font-inter hover:underline cursor-pointer"
                    >
                        Resend OTP
                    </button>
                ) : (
                    <p className="text-sm text-gray-400 font-inter">
                        Resend in 00:{String(timer).padStart(2, "0")}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isOtpFilled}
                className={`
                    w-full py-3 rounded-lg text-sm font-medium font-inter
                    transition-colors duration-200 mt-2
                    ${isOtpFilled
                        ? "bg-[#0F62FE] text-[#FFFFFF] cursor-pointer"
                        : "bg-[#ECEDEE] text-gray-400 cursor-not-allowed"
                    }
                `}
            >
                Verify
            </button>
        </form>
    );
};
