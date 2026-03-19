import { z } from "zod";

export const loginSchema=z.object({
    username:z.string().min(1,"Invalid username or password"),
    password:z.string().min(1,"Invalid username or password"),
})

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

export const setPasswordSchema = z.object({
    password: z.string()
        .min(10, "Minimum 10 characters")
        .regex(/[0-9]/, "Minimum 1 digit")
        .regex(/[^A-Za-z0-9]/, "Minimum 1 special character"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type SetPasswordData = z.infer<typeof setPasswordSchema>;