import { comparePassword, hashPassword } from "../../utils/bcryt";
import type { ForgotPassword, LoginDto, RegisterDto, ResetPasswordDto } from "./auth.dto";
import { authrepo } from "./auth.repository";
import { OtpClient } from "../../utils/otp";
import { generateToken } from "../../utils/jwt";

class AuthService {
    // 1. REGISTER WORKFLOW
    async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await authrepo.findByEmail(dto.email); 
    if (existingUser) { 
        throw new Error("User already exists with this email");
    }

    // Password validations
    if (dto.password !== dto.confirmPassword) {
        throw new Error("Passwords do not match");
    }

    if (
        dto.password.length < 6 ||
        !/[A-Za-z]/.test(dto.password) ||
        !/[0-9]/.test(dto.password) 
    ) {
        throw new Error("Password must be at least 6 characters and contain letters and numbers");
    }

    // Hash password (must await!)
    const hashedPassword = await hashPassword(dto.password);

    // Save user to DB (unverified)
    const user = await authrepo.createUser({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        age:dto.age,
        verified: false,
    });

    // Send OTP via external microservice
    try {
        await OtpClient.sendOtp(dto.email);
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        // Even if email fails, user record is created; they can click 'Resend OTP'
    }

    return {
        message: "Registration successful! Please check your email for the OTP.",
        userId: user.id,
    };
    }

    // 2. VERIFY OTP WORKFLOW
    async verifyUserEmail(email: string, code: string) {
    const user = await authrepo.findByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    if (user.verified) {
        return { message: "Account is already verified" };
    }

    // Call external microservice to verify OTP code
    await OtpClient.verifyOtp(email, code);

    // Update verified status in PostgreSQL
    await authrepo.verifyUser(email);

    return { message: "Account successfully verified! You can now log in." };
    }

    // 3. RESEND OTP WORKFLOW
    async resendOtp(email: string) {
    const user = await authrepo.findByEmail(email);
    if (!user) { 
        throw new Error("User not found");
    } 

    if (user.verified) { 
        throw new Error("Account is already verified");
    }

    await OtpClient.sendOtp(email);
    return { message: "A new OTP has been sent to your email." };
    }

    // 4. LOGIN WORKFLOW 
    async login(dto: LoginDto) {
    // Find user 
    const user = await authrepo.findByEmail(dto.email);
    if (!user) { 
        throw new Error("Invalid email or password");
    } 

    // Check password 
    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) { 
        throw new Error("Invalid email or password");
    }

    // Check if email was verified via OTP
    if (!user.verified) {
        throw new Error("Please verify your email with OTP before logging in");
    }

    // Generate JWT token
    const token = generateToken(user.id);

    return {
        message: "Login successful",
        token,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        },
    };
    }
    async resetPassword(dto: ResetPasswordDto) {
      // 1. Check user exists
      const user = await authrepo.findByEmail(dto.email);
      if (!user) {
        throw new Error("User not found");
      }
  
      // 2. Validate passwords match & complexity
      if (dto.newPassword !== dto.confirmNewPassword) {
        throw new Error("Passwords do not match");
      }
  
      if (
        dto.newPassword.length < 6 ||
        !/[A-Za-z]/.test(dto.newPassword) ||
        !/[0-9]/.test(dto.newPassword)
      ) { 
        throw new Error("Password must be at least 6 characters and contain letters and numbers");
      }
  
      // 3. Verify OTP with external microservice 
      await OtpClient.verifyOtp(dto.email, dto.code); 
  
      // 4. Hash the new password
      const hashedPassword = await hashPassword(dto.newPassword); 
  
      // 5. Update password in PostgreSQL 
      await authrepo.updatePassword(dto.email, hashedPassword); 
  
      return {
        message: "Password reset successful! You can now log in with your new password.",
      };
    }
    // 5. FORGOT PASSWORD WORKFLOW
    async forgotPassword(dto: ForgotPassword) {
        // 1. Verify user exists in the database
        const user = await authrepo.findByEmail(dto.email);
        if (!user) {
        throw new Error("User not found with this email");
        }

        // 2. Call external microservice to send OTP to user's email
        await OtpClient.sendOtp(dto.email);

        return {
        message: "Password reset OTP has been sent to your email.",
        };
    }
}

export const authService=new AuthService();