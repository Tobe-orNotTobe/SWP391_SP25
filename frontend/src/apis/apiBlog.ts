import axiosInstance from "../utils/axiosInstance.ts";
import {BlogRequest, UpdateBlogRequest} from "../interfaces/Blog.ts";
import axios from "axios";


export const apiGetAll = async (onlyActive: boolean) => {
    try {
        const response = await axiosInstance.get(`/api/Blog?onlyActive=${onlyActive}`);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }

};

export const apiGetAllBlog = async (onlyActive: boolean) => {
    try {
        const response = await axiosInstance.get(`/api/Blog/type/blog?onlyActive=${onlyActive}`);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
};

export const apiGetAllNews = async (onlyActive: boolean) => {
    try {
        const response = await axiosInstance.get(`/api/Blog/type/news?onlyActive=${onlyActive}`);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
};

export const apiGetNewsById = async (onlyActive: boolean) => {
    try {
        const response = await axiosInstance.get(`/api/News?onlyActive=${onlyActive}`);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }

};

export const apiGetBlogById = async (blogId: number) => {
    try {
        const response = await axiosInstance.get(`/api/Blog/${blogId}`);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
};

export const apiCreateBlog = async (data: BlogRequest) => {
    try {
        const response = await axiosInstance.post(`/api/Blog`, data);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

export const apiUpdateBlog = async (blogId: number, data: UpdateBlogRequest) => {
    try {
        const response = await axiosInstance.put(`/api/Blog/${blogId}`, data);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }

}

export const apiDeleteBlog = async (blogId: number) => {
    try {
        const response = await axiosInstance.delete(`/api/Blog/${blogId}`);
        return response.data;
    }catch (err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

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

export const apiGetBlogBasic = async () => {
    try{
        const response = await axiosInstance.get("/api/Blog/basic");
        return response.data;
    }catch (err){
        console.log(err);
        throw err;
    }
}

export const apiGetVaccineServiceIntro = async () => {
    const response = await axios.get("Vaccine/VaccineService.json");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};