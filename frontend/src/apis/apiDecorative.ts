import axios from "axios"

export const apiGetImgCarousel = async() =>{
    try{
        const response = await axios.get("Decorative/ImageCarousel.json");
        return response.data;
    }catch (err){
        console.error("Error fetching data", err);
        return [];
    }

}

export const apiGetBrieftContent = async() => {
    try{
        const response = await axios.get("Decorative/BrieftContent.json");
        return response.data;
    }catch (err){
        console.error("Error fetching data", err);
        return [];
    }
}

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