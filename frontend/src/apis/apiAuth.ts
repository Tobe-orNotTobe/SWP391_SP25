import {
    ConfirmEmailRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest, ResetPasswordUserProfile, UserProfile
} from "../interfaces/Auth";
import axiosInstance from "../utils/axiosInstance";

export const apiRegister = async (data: RegisterRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/register", data);
        return response.data;
    } catch (error) {
        console.error("API Register Error:", error);
        throw error;
    }
};

export const apiLogIn = async (data: LoginRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/login", data);
        return response.data;
    } catch (error) {
        console.error("API Login Error:", error);
        throw error;
    }
};

export const apiConfirmEmail = async (data: ConfirmEmailRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/confirm-email", data);
        return response.data;
    } catch (error) {
        console.error("API Confirm Email Error:", error);
        throw error;
    }
};

export const apiForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/forget-password", data);
        return response.data;
    } catch (error) {
        console.error("API Forgot Password Error:", error);
        throw error;
    }
};

export const apiResetPassword = async (data: ResetPasswordRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/reset-password", data);
        return response.data;
    } catch (error) {
        console.error("API Reset Password Error:", error);
        throw error;
    }
};

export  const apiRefreshToken = async (refreshToken : string | null) => {
    try {
        const response = await axiosInstance.post("/api/Auth/refresh-token", refreshToken);
        return response.data;
    } catch (error) {
        console.error("API Refresh Error:", error);
        throw error;
    }
};


export const apiGetProfileUser = async () => {
    try{
        const  response = await axiosInstance.get("/api/user/profile");
        return response.data;
    }catch (err){
        console.error("API GetProfileUser Error:", err);
        throw err;
    }
}

export const apiUpdateProfileUser = async (data : UserProfile ) => {
    try {
        const response = await  axiosInstance.put("/api/user/profile", data);
        return response.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}

export const apiChangePassword = async (data : ResetPasswordUserProfile)=> {
    try {
        const response = await  axiosInstance.put("/api/user/change-password", data);
        return response.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}