import { useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { CredentialsForm } from "./CredentialsForm";
import { OtpVerificationForm } from "./OtpVerificationForm";

export const AuthContainer = () => {
    const { loginStep, runPreHandshake } = useAuthStore();

    // Initialize the handshake when the container mounts
    useEffect(() => {
        if (loginStep === 'idle') {
            console.log("Calling prehandshake...");
            runPreHandshake();
        }
    }, [loginStep, runPreHandshake]);

    // Render logic based on current authentication step
    if (loginStep === 'idle') {
        return (
            <div className="flex items-center justify-center w-full py-10">
                <p className="text-sm text-gray-400 font-inter animate-pulse">Initializing Secure Session...</p>
            </div>
        );
    }

    if (loginStep === "credentials") {
        return <CredentialsForm />;
    }

    if (loginStep === "otp") {
        return <OtpVerificationForm />;
    }

    // Fallback if an unknown state is reached (e.g., 'forgot-credentials' stub)
    return (
        <div className="flex flex-col items-center justify-center w-full py-10 gap-4">
            <h3 className="font-inter font-semibold">Handling Step: {loginStep}</h3>
            <p className="text-sm text-gray-500 text-center">
                This view is not yet implemented in the AuthContainer.
            </p>
        </div>
    );
};
