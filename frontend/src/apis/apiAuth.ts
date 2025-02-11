import axios from "axios";
import { ForgotPasswordRequest, LoginRequest, OTPRequest, RegisterRequest, ResetPasswordRequest } from "../types/Auth";

export const apiRegister = async(data : RegisterRequest) => {
    try{
        const response = await axios.post("", data);
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}

export const apiLogIn= async(data : LoginRequest) => {
    try{
        const response = await axios.post("", data);
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}

export const apiForgotPassword = async (data : ForgotPasswordRequest) => {
    try{
        const response = await axios.post("", data);
        return response.data;
    }catch(err){
        console.log(err);
        return[];
    }
}

export const apiVerifyOTP = async (data : OTPRequest) => {
    try{
        const response = await axios.post("", data);
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