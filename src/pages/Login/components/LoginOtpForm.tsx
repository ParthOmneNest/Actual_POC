import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
    loginSchema,
    otpSchema,
    type LoginFormData,
    type OtpFormData,
} from "../schema/login.otpSchema";

import eyeOpen from "../../../assets/Eyeopen.png";
import eyeClose from "../../../assets/Eyeclosed.png";
import qrcode from "../../../assets/scan-qr-code.png";
import cautionIcon from "../../../assets/Error.png";

export const LoginOtpForm = () => {
    const { login, validateOtp, loginStep, error, runPreHandshake } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (loginStep === 'idle') {
            console.log(" calling prehandshake...")
            runPreHandshake();
        }
    }, []);

    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const isOtpFilled = otp.every((val) => val !== "");


    useEffect(() => {
        if (loginStep !== "otp") return;
        if (timer === 0) { setCanResend(true); return; }
        const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(countdown);
    }, [timer, loginStep]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

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

    const {
        register: registerLogin,
        handleSubmit: handleLogin,
        watch,
        formState: { errors: loginErrors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const {
        formState: { errors: otpErrors },
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    const username = watch("username");
    const password = watch("password");
    const isFilled = username?.length > 0 && password?.length > 0;

    const onLoginSubmit = async (data: LoginFormData) => {
        await login(data);
    };

    const onOtpSubmit = async (e: React.ChangeEvent) => {
     e.preventDefault(); // Stop the page from reloading
        
        const finalOtpString = otp.join("");  
        
      
        const storedUsername = useAuthStore.getState().loginUsername;

        if (!storedUsername) {
            console.error("Amnesia! We have lost the username.");
            return;
        }

        console.log(`Sending OTP: ${finalOtpString} for User: ${storedUsername}`);
     await validateOtp({
            username: storedUsername,
            otp: parseInt(finalOtpString, 10), 
        });
    };
    if (loginStep === 'idle') {
        return (
            <div className="flex items-center justify-center w-full py-10">
                <p className="text-sm text-gray-400 font-inter">Loading...</p>
            </div>
        );
    }
    if (loginStep === "credentials") {
        return (
            <form
                className="flex flex-col w-full gap-6"
                onSubmit={handleLogin(onLoginSubmit)}
            >
                {/* Username + Password */}
                <div className="flex flex-col gap-4">

                    {/* Username */}
                    <div className="flex flex-col gap-1">
                        <label className="font-inter font-medium text-sm leading-none tracking-normal">
                            Mobile no. / Email / Client ID
                        </label>
                        <input
                            {...registerLogin("username")}
                            placeholder="Enter Mobile no. / Email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0F62FE] transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="font-inter font-medium text-sm leading-none tracking-normal">
                            Password / MPIN
                        </label>
                        <div className="relative">
                            <input
                                {...registerLogin("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password / MPIN"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0F62FE] transition-colors pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <img
                                    src={showPassword ? eyeOpen : eyeClose}
                                    alt={showPassword ? "hide password" : "show password"}
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                    </div>

                </div>

                {/* QRcode + Login + Links */}
                <div className="flex flex-col gap-3">

                    {/* QR Code */}
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 text-[#0F62FE] cursor-pointer"
                    >
                        <img src={qrcode} className="w-4 h-4" />
                        Login with QR Code
                    </button>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={!isFilled}
                        className={`
              w-full py-3 rounded-lg text-sm font-medium
              transition-colors duration-200
              text-[#FFFFFF] 
              ${isFilled
                                ? "bg-[#0F62FE]  cursor-pointer"
                                : "bg-[#ECEDEE] cursor-not-allowed"
                            }
            `}
                    >
                        Login
                    </button>

                    {/* ForgotuserID/password + Guest */}
                    <div className="flex flex-row justify-between items-center">
                        <button type="button" className="text-sm text-[#0F62FE] cursor-pointer">
                            Forgot user ID or password?
                        </button>
                        <button type="button" className="text-sm text-[#0F62FE] cursor-pointer">
                            Guest login
                        </button>
                    </div>

                </div>

                {/* Error */}
                {(loginErrors.username || loginErrors.password || error) && (
                    <div className="flex flex-row items-center gap-2 bg-[#FAEBE9] text-[#CA3521] px-4 py-3 rounded-lg">
                        <img src={cautionIcon} alt="caution" className="w-4 h-4 shrink-0" />
                        <p className="font-inter font-medium text-[14px] leading-5 tracking-normal">
                            Invalid username or password
                        </p>
                    </div>
                )}

            </form>
        );
    }

    if (loginStep === "otp") {
        return (
            <form
                className="flex flex-col w-full gap-6"
                onSubmit={(onOtpSubmit)}
            >

                {/* message send to number */}
                <div className="flex flex-col gap-1">
                    <h4 className="font-inter font-semibold text-lg">
                        Enter OTP
                    </h4>
                    <p className="font-inter text-sm text-gray-500">
                        OTP Sent on +91 {useAuthStore.getState().user?.phoneNumber}
                    </p>
                </div>

                {/* ── OTP Boxes with innline Error */}
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
                ${error
                                        ? "border border-[#CA3521] focus:border-[#CA3521]"
                                        : "border border-gray-200 focus:border-[#0F62FE]"
                                    }
              `}
                            />
                        ))}
                    </div>

                    {/* Inline error below boxes */}
                    {(otpErrors.otp || error) && (
                        <p className="text-[#CA3521] font-inter font-medium text-[14px] leading-5 tracking-normal text-right">
                            {error}
                        </p>
                    )}
                </div>

                {/* Resend button*/}
                <div className="flex justify-end">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-sm text-[#0F62FE] font-medium font-inter hover:underline"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <p className="text-sm text-gray-400 font-inter">
                            Resend in 00:{String(timer).padStart(2, "0")}
                        </p>
                    )}
                </div>

                {/* verifying button*/}
                <button
                    type="submit"
                    disabled={!isOtpFilled}
                    className={`
          w-full py-3 rounded-lg text-sm font-medium font-inter
          transition-colors duration-200
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
    }


};