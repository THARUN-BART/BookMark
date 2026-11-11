const APP_NAME=process.env.APP_NAME || "BookMark";
const BaseUrl=process.env.OTP_SERVICE_URL;

interface OtpResponse{
    success:boolean;
    message:string;
    app_name?:string
}

export class OtpClient {
    /**
     * Calls external microservice to send OTP to user's email
     */
    static async sendOtp(email: string): Promise<OtpResponse> {
    const response = await fetch(`${BaseUrl}/api/send-otp`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        email,
        app_name: APP_NAME,
        }),
    });

    const data = (await response.json()) as OtpResponse;

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");                                                                                                                                   
    }                                                                                                                                                                                          

    return data;
    }

    /**
     * Calls external microservice to verify the user's OTP code                                                                                                                                 
     */                                                                                                                                                                                          
    static async verifyOtp(email: string, code: string): Promise<OtpResponse> {
    const response = await fetch(`${BaseUrl}/api/verify-otp`, {
        method: "POST",
        headers: {                                                                                                                                                                               
        "Content-Type": "application/json",
        },
        body: JSON.stringify({                                                                                                                                                                   
        email,
        code,
        app_name: APP_NAME,
        }),
    });

    const data = (await response.json()) as OtpResponse;

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid or expired OTP");
    }

    return data;
    }
}