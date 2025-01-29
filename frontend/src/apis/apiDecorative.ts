import axios from "axios"
import { BriefContent, ImgCarousel } from "../types/Decorative"

export const apiGetImgCarousel = async() : Promise<ImgCarousel[]> =>{
    try{
        const response = await axios.get("Decorative/ImageCarousel.json");
        return response.data;
    }catch (err){
        console.error("Error fetching data", err);
        return [];
    }

}

export const apiGetBrieftContent = async() : Promise<BriefContent[]> => {
    try{
        const response = await axios.get("Decorative/BrieftContent.json");
        return response.data;
    }catch (err){
        console.error("Error fetching data", err);
        return [];
    }
}