import axiosInstance from "../utils/axiosInstance";
import { VaccineIntro } from "../types/Vaccine";

export const getVaccineIntro = async (): Promise<VaccineIntro[]> => {
    try{
        const response = await axiosInstance.get("Vaccine/VaccineIntro.json");
        console.log(response)
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}
