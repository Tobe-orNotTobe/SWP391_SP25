
import axios from "axios";

export const apiGetVaccineIntro = async () => {
    try{
        const response = await axios.get("Vaccine/VaccineIntro.json");
        console.log(response)
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}

export const apiGetVaccineServiceIntro = async () => {
    try{
        const response = await axios.get("Vaccine/VaccineService.json");
        console.log(response)
        return response.data;
    }catch(error){
        console.error(error);
        return [];
    }
}