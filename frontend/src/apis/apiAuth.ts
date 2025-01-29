import axios from "axios";
import { SignIn, SignUp } from "../types/Auth";

export const apiSignUp = async(user : SignUp) : Promise<SignUp[]> => {
    try{
        const response = await axios.post("", user);
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}

export const apiSignIn = async(user : SignIn) : Promise<SignIn[]> =>{
    try{
        const response = await axios.post("", user);
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}