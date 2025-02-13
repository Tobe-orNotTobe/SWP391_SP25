import axios from "axios";
import { ConfirmPassWord, ForgotPasswordRequest, LoginRequest, OTPRequest, RegisterRequest, ResetPasswordRequest } from "../types/Auth";
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


export const apiConfirmPassword = async (data : ConfirmPassWord) => {
    try{
        const response = await axios.post("", data);
        return response.data
    }catch(error){
        if (axios.isAxiosError(error)) {
            console.error("Error fetching data", error.response?.data || error.message);
            return error.response?.data ;
        }
        console.error("Unexpected error:", error);
        return { message: "An unexpected error occurred" };
    }
}



export const apiForgotPassword = async (data : ForgotPasswordRequest) => {
    try{
        const response = await axiosInstance.post("", data);
        return response.data;
    }catch(err){
        console.log(err);
        return[];
    }
}

export const apiVerifyOTP = async (data : OTPRequest) => {
    try{
        const response = await axiosInstance.post("", data);
        return response.data;
    }catch(err){
        console.log(err);
        return[];
    }
}

export const apiResetPassword = async (data : ResetPasswordRequest) => {
    try{
        const response = await axios.post("", data);
        return response.data;
    }catch(err){
        console.log(err);
        return[];
    }
}