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

