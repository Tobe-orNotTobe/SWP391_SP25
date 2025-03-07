import axiosInstance from "../utils/axiosInstance.ts";

export const apiGetUserWallet = async () =>{
    try{
        const  response = await axiosInstance.get("/api/Wallet/user");
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}

