
export interface AccountRequest {
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    password: string;
    role: string;
    certificateImageUrl: string;
}

export interface UpdateAccountRequest {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    isActive: boolean;
    role: string;
}

export interface AccountDetailResponse {
    fullName: string;
    address: string;
    dateOfBirth: Date;
    isActive: boolean;
    imageUrl: string,
    id: string;
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnabled: boolean;
    accessFailedCount: number;
    roles: string[];
}

export interface AccountResponse {
    id: string;
    userName: string;
    fullName: string;
    email: string;
    address: string;
    dateOfBirth: string;
    isActive: boolean;
    phoneNumber: string;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginGoogleRequest {
    idToken: string;
}

export interface LoginGoogleResponse {
    statusCode: string;
    isSuccess: boolean;
    errorMessages: string[],
    result: {
        token: string;
    }
}


export interface RegisterRequest {
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    password: string;
}

export interface TokenDecode {
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
export  interface  ResetPasswordUserProfile{
    oldPassword: string;
    newPassword: string;
}

export interface UserProfile {
    id: string;
    fullName: string;
    userName: string;
    phoneNumber: string;
    email: string;
    address: string;
    dateOfBirth: string;
    imageUrl: string;
}

export interface UserProfileUpdate{
    id: string;
    fullName: string;
    userName: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    imageUrl: string;
}


export interface WalletUser {
    walletId: number;
    userId : string;
    balance : number;
    totalRefunded : number;
    isAdminWallet : false;
    createdAt: string;
    updatedAt: string;
    recentTransactions : WalletHistoryUserDetail[];
}

export interface WalletHistoryUserDetail {
    walletTransactionId : number;
    walletId: number;
    amount : number;
    transactionType : string;
    description : string;
    createdAt : string;
}

export interface RefundListUser {
    refundRequestId : number;
    bookingId : number;
    userId : string;
    amount : number;
    reason : string;
    status : string;
    adminNote : string;
    processedBy : string | null;
    createAt: string;
    processAt: string | null;
}





