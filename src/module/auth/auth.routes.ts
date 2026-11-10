import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), (req, res) => authController.register(req, res));
authRouter.post("/verify-otp", validate(verifyOtpSchema), (req, res) => authController.verifyOtp(req, res));
authRouter.post("/resend-otp", validate(resendOtpSchema), (req, res) => authController.resendOtp(req, res));
authRouter.post("/login", validate(loginSchema), (req, res) => authController.login(req, res));
authRouter.post("/logout", (req, res) => authController.logout(req, res));
authRouter.post("/forgot-password", validate(forgotPasswordSchema), (req, res) => authController.forgotPassword(req, res));
authRouter.post("/reset-password", validate(resetPasswordSchema), (req, res) => authController.resetPassword(req, res));

export default authRouter;
