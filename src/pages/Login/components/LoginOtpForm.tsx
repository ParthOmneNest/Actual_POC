import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../store/useAuthStore";
import { useForm } from "react-hook-form"
import { loginSchema, otpSchema, type LoginFormData, type OtpFormData } from "../schema/login.otpSchema";
loginSchema

interface AuthProps {
    onSuccess: () => void;
}

export const LoginOtpForm = () => {

    const { login, validateOtp, loginStep, isLoading, error } = useAuthStore()

    const {
        register: registerLogin,
        handleSubmit: handleLogin,
        formState: { errors: loginErrors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const {
        register: registerOtp,
        handleSubmit: handleOtp,
        formState: { errors: otpErrors },
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema)
    })

    const onLoginSubmit = async (data: LoginFormData) => {
        await login(data);
    }

    const onOtpSubmit = async (data: OtpFormData) => {
        await validateOtp({
            username: useAuthStore.getState().user?.username || "",
            otp: parseInt(data.otp, 10),
        });
    }

    if(loginStep==='credentials'){
        // login form
        return(
            <form>

            </form>
        )
    }
    if(loginStep==='otp'){
        // otp form
        return(
            <form>

            </form>
        )
    }
    

}