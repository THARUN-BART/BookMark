export interface RegisterDto{
    name:string;
    email:string;
    password:string;
    confirmPassword:string;
    age:number;
}

export interface LoginDto {
    email:string;
    password:string;
}

export interface ForgotPassword {
    email: string;
}

export interface ResetPasswordDto {
      email: string;
      code: string;        
      newPassword: string;
      confirmNewPassword: string;
}        