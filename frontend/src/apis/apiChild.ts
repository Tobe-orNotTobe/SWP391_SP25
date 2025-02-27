import axiosInstance from "../utils/axiosInstance";
// import {MyChildResponse} from "../interfaces/Child.ts";
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

