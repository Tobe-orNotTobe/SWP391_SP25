import axiosInstance from "../utils/axiosInstance.ts";
import {BlogRequest, UpdateBlogRequest} from "../interfaces/Blog.ts";

export const apiGetAllBlog = async (onlyActive: boolean) => {
    const response = await axiosInstance.get(`/api/Blog?onlyActive=${onlyActive}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiGetBlogById = async (blogId: string) => {
    const response = await axiosInstance.get(`/api/Blog/${blogId}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiCreateBlog = async (data: BlogRequest) => {
    const response = await axiosInstance.post(`/api/Blog`, data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}

export const apiUpdateBlog = async (blogId: string, data: UpdateBlogRequest) => {
    const response = await axiosInstance.put(`/api/Blog/${blogId}`, data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}

export const apiDeleteBlog = async (blogId: number) => {
    const response = await axiosInstance.delete(`/api/Blog/${blogId}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}