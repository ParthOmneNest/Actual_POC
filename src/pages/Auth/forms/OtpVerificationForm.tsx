import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../shared/components/Button";
import { OtpInputBoxes } from "../../../shared/components/OtpInputBoxes";
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
          
            <div className="flex flex-col gap-1">
                <h4 className="font-inter font-semibold text-lg">
                    Enter OTP
                </h4>
                <p className="font-inter text-sm text-gray-500">
                    OTP Sent on +91 {phoneNumber}
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <OtpInputBoxes
                    value={otp}
                    onChange={setOtp}
                    error={!!(error || otpErrors.otp)}
                    idPrefix="otp"
                    type="text"
                />

                {(otpErrors.otp || error) && (
                    <p className="text-[#CA3521] font-inter font-medium text-[14px] leading-5 tracking-normal text-right">
                        {error || otpErrors.otp?.message}
                    </p>
                )}
            </div>

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

            <Button
                type="submit"
                disabled={!isOtpFilled}
                className="mt-2"
            >
                Verify
            </Button>
        </form>
    );
};
