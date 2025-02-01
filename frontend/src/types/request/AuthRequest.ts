export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string; 
}