import axios from "axios";
import { LoginRequest, RegisterRequest } from "../types/Auth";

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