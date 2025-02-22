import axios from "axios";

export const apiGetImgCarousel = async () => {
    const response = await axios.get("Decorative/ImageCarousel.json");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};

export const apiGetBrieftContent = async () => {
    const response = await axios.get("Decorative/BrieftContent.json");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};

export const apiGetNewsIntro = async () => {
    const response = await axios.get("Decorative/NewsIntro.json");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};

export const apiGetVaccineServiceIntro = async () => {
    const response = await axios.get("Vaccine/VaccineService.json");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};
