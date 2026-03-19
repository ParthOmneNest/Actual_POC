import { useForm } from "react-hook-form";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { useUnblockUser } from "../hooks/useUnblockUser";
import { useAuthFlowStore } from "../store/useAuthFlowStore";

export const UnblockUser = () => {
    const { unblockUser } = useUnblockUser();
    const setStep = useAuthFlowStore(state => state.setStep);
    
    const { register, handleSubmit, watch } = useForm({
        defaultValues: { username: "", pan: "" }
    });

    // Ensure both fields are filled before enabling the button
    const isFilled = watch("username") && watch("pan");

    const onSubmit = async (data: { username: string, pan: string }) => {
        // Calls the unblock API logic defined in your store
        await unblockUser(data.pan, data.username);
    };

    return (
        <div className="flex flex-col w-full">
            {/* Header / Title Area (Optional but recommended for clarity) */}
            <div className="mb-6">
                <h2 className="text-[20px] font-bold text-[#111111]">Unblock Account</h2>
                <p className="text-sm text-[#555555] mt-1">Enter your details to receive an OTP and unblock your access.</p>
            </div>

            <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <Input
                        {...register("username")}
                        label="Mobile no. / Email / Client ID"
                        placeholder="Enter User ID"
                    />
                    <Input
                        {...register("pan")}
                        label="PAN"
                        placeholder="Enter PAN"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!isFilled}
                >
                    Unblock
                </Button>

                <button
                    type="button"
                    onClick={() => {
                        setStep('otp');
                    }} 
                    className="flex items-center justify-center gap-2 text-[#0F62FE] text-sm font-medium cursor-pointer"
                >
                    ← Go back
                </button>
            </form>
        </div>
    );
};