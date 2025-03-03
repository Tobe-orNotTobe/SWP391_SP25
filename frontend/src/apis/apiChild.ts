import axiosInstance from "../utils/axiosInstance";
import {decodeToken} from "../utils/decodeToken.ts";
import {ChildDetailRequest} from "../interfaces/Child.ts";

export const apiGetMyChilds = async () => {
    const userId = decodeToken(localStorage.getItem("token"))?.sub;
    if (!userId) {
        return { message: "User ID not found" };
    }

    const response = await axiosInstance.get(`/api/Children/user/${userId}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiChildRegister = async (data: ChildDetailRequest) => {
    const userId = decodeToken(localStorage.getItem("token"))?.sub;
    if (!userId) {
        return { message: "User ID not found" };
    }

    const response = await axiosInstance.post(`/api/Children?userId=${encodeURIComponent(userId)}`, data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiChildUpdate = async (data: ChildDetailRequest, childId: number) => {

    const response = await axiosInstance.put(`/api/Children/${encodeURIComponent(childId)}`, data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}

export const apiChildDelete = async (childId: number) => {

    const response = await axiosInstance.delete(`/api/Children/${encodeURIComponent(childId)}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}

export const apiGetChildById = async (childId: number) => {
    const response = await axiosInstance.get(`/api/Children/${encodeURIComponent(childId)}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}