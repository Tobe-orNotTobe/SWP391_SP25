

export interface AccountRequest {
    fullName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    password: string;
    role: string;
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
}

export interface AccountDetailResponse {
    fullName: string;
    address: string;
    dateOfBirth: Date;
    isActive: boolean;
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
}


