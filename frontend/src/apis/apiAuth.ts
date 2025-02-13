import axios from "axios";
import { ConfirmEmailRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from "../types/Auth";
import axiosInstance from "../utils/axiosInstance";

export const apiRegister = async(data : RegisterRequest) => {
    try{
        const response = await axiosInstance.post("/api/Auth/register", data);
        return response.data;
    }catch(error : unknown){
        if (axios.isAxiosError(error)) {
            console.error("Error fetching data", error.response?.data || error.message);
            return error.response?.data;
        }
        console.error("Unexpected error:", error);
        return { message: "An unexpected error occurred" };
    }
}

export const apiLogIn= async(data : LoginRequest) => {
    try{
        const response = await axiosInstance.post("/api/Auth/login", data);
        return response.data;
    }catch(error){
        if (axios.isAxiosError(error)) {
            console.error("Error fetching data", error.response?.data || error.message);
            return error.response?.data ;
        }
        console.error("Unexpected error:", error);
        return { message: "An unexpected error occurred" };
    }
}


export const apiConfirmEmail = async (data : ConfirmEmailRequest) => {
    try{
        const response = await axiosInstance.post("/api/Auth/confirm-email", data);
        return response.data;
    }catch(error){
        if (axios.isAxiosError(error)) {
            console.error("Error fetching data", error.response?.data || error.message);
            return error.response?.data ;
        }
        console.error("Unexpected error:", error);
        return { message: "An unexpected error occurred" };
    }
};


export const apiForgotPassword = async (data : ForgotPasswordRequest) => {
    try{
        const response = await axiosInstance.post("/api/Auth/forget-password", data);
        return response.data;
    }catch(error){
        if (axios.isAxiosError(error)) {
            console.error("Error fetching data", error.response?.data || error.message);
            return error.response?.data ;
        }
        console.error("Unexpected error:", error);
        return { message: "An unexpected error occurred" };
    }
}



export const apiResetPassword = async (data : ResetPasswordRequest) => {
    try{
        const response = await axiosInstance.post("/api/Auth/reset-password", data);
        return response.data;
    }catch(err){
        console.log(err);
        return[];
    }
}