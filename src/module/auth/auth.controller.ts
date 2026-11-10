import type { Request, Response } from "express";
import { authService } from "./auth.service";

class AuthController { 
      async register(req: Request, res: Response) { 
        try {
          const result = await authService.register(req.body);
          return res.status(201).json({ success: true, ...result }); 
        } catch (error: any) { 
          return res.status(400).json({ success: false, message: error.message });
        }
      }
  
    async verifyOtp(req: Request, res: Response) {
    try { 
        const { email, code } = req.body;
        const result = await authService.verifyUserEmail(email, code); 
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
    }

    async resendOtp(req: Request, res: Response) {
    try {
        const { email } = req.body;
        const result = await authService.resendOtp(email); 
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    } 
    }

    async login(req: Request, res: Response) {
    try {
        const result = await authService.login(req.body);
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(401).json({ success: false, message: error.message }); 
    }
    } 

    async forgotPassword(req: Request, res: Response) {
    try {
        const result = await authService.forgotPassword(req.body);
        return res.status(200).json({ success: true, ...result }); 
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message }); 
    }
    }

    async resetPassword(req: Request, res: Response) {
    try {
        const result = await authService.resetPassword(req.body);
        return res.status(200).json({ success: true, ...result }); 
    } catch (error: any) { 
        return res.status(400).json({ success: false, message: error.message });
    }
    }
}
export const authController = new AuthController();