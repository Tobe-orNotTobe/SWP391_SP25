
import { ConfirmEmailRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from "../interfaces/Auth";
import axiosInstance from "../utils/axiosInstance";

export const apiRegister = async (data: RegisterRequest) => {
    const response = await axiosInstance.post("/api/Auth/register", data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiLogIn = async (data: LoginRequest) => {
    const response = await axiosInstance.post("/api/Auth/login", data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiConfirmEmail = async (data: ConfirmEmailRequest) => {
    const response = await axiosInstance.post("/api/Auth/confirm-email", data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiForgotPassword = async (data: ForgotPasswordRequest) => {
    const response = await axiosInstance.post("/api/Auth/forget-password", data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiResetPassword = async (data: ResetPasswordRequest) => {
    const response = await axiosInstance.post("/api/Auth/reset-password", data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};
