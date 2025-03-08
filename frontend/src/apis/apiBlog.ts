import axiosInstance from "../utils/axiosInstance.ts";
import {BlogRequest, BlogResponse, UpdateBlogRequest} from "../interfaces/Blog.ts";
import {ApiResponse} from "../interfaces/BeResponse.ts";

export const apiGetAllBlog = async (onlyActive: boolean): Promise<ApiResponse<BlogResponse[]>> => {
    try {
        const response = await axiosInstance.get<Promise<ApiResponse<BlogResponse[]>>>(`/api/Blog?onlyActive=${onlyActive}`);
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

export const apiGetBlogById = async (blogId: string): Promise<ApiResponse<BlogResponse>> => {
    try {
        const response = await axiosInstance.get<Promise<ApiResponse<BlogResponse>>>(`/api/Blog/${blogId}`);
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

export const apiUpdateBlog = async (blogId: string, data: UpdateBlogRequest) => {
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

export const apiDeleteBlog = async (blogId: string) => {
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