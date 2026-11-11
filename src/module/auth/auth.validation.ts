import {z} from "zod";


export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    age: z.number().min(18, "You must be at least 18 years old"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
    email: z.string().email("Invalid email format"),
    code: z.string().length(6, "OTP code must be exactly 6 digits"),
});

export const resendOtpSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export const forgotPasswordSchema = z.object({ 
    email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
    code: z.string().length(6, "OTP code must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string(),
});