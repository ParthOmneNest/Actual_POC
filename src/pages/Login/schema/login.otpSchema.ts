import {z} from "zod"

// Login schema
export const loginSchema=z.object({
    username:z.string().min(1,"Invalid username or password"),
    password:z.string().min(1,"Invalid username or password"),
})

// otp schema
export const otpSchema=z.object({
    otp:z.string()
    .min(1,"OTP is required")
    .length(4,"OTP must be exactly 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
})

export const forgotPasswordSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    pan: z.string()
        .min(10, "PAN must be 10 characters")
        .max(10, "PAN must be 10 characters")
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type LoginFormData=z.infer<typeof loginSchema>;
export type OtpFormData=z.infer<typeof otpSchema>;