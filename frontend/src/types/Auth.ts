export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;   
    dateOfBirth: string;
    password: string;   
    role : string;
}

export interface TokenResponse {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress" : string;
    sub: string;   
    exp: number;  
    iss: string;
    aud: string;
}

export interface ConfirmEmailRequest {
    email: string;
    token: string;
}


export interface ForgotPasswordRequest{
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
}