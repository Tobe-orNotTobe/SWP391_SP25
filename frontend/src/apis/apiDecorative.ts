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

export const apiGetBlogIntro = async () => {
    const response = await axios.get("Decorative/NewsIntro.json");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};
