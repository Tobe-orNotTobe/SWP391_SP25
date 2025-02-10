import axios from "axios";
import { ForgotPasswordRequest, LoginRequest, RegisterRequest } from "../types/Auth";
import axiosInstance from "../utils/axiosInstance";

export const apiRegister = async(data : RegisterRequest) => {
    try{
        const response = await axiosInstance.post("/api/Auth/register", data);
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}

export const apiLogIn= async(data : LoginRequest) => {
    try{
        const response = await axiosInstance.post("/api/Auth/login", data);
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