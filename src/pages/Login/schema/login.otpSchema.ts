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
    .length(6,"OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
})

export type LoginFormData=z.infer<typeof loginSchema>;
export type OtpFormData=z.infer<typeof otpSchema>;