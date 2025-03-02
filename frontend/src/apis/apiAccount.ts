import AxiosInstance from "../utils/axiosInstance.ts";
import {AccountRequest, UpdateAccountRequest} from "../interfaces/Account.ts";

export const apiGetAllUser = async () => {
    try {
        const response = await AxiosInstance.get("/api/Admin/getAllUsers");
        return response.data;
    }catch(err) {
        console.log("An unexpected error occurred "+err);
        throw err;
    }
}

export const apiGetUserById = async (id: string) => {
    try {
        const response = await AxiosInstance.get(`/api/Admin/admin/GetUserById/${id}`);
        return response.data;
    }catch(err) {
        console.log("An unexpected error occurred "+err);
        throw err;
    }
}

export const apiCreateAccount = async (data: AccountRequest) => {
    try {
        const response = await AxiosInstance.post("/api/Admin/create-account", data);
        return response.data;
    }catch(err) {
        console.log("An unexpected error occurred "+err);
        throw err;
    }
}

export const apiUpdateAccount = async (data: UpdateAccountRequest) => {
    try {
        const response = await AxiosInstance.put("/api/Admin/UpdateUser", data);
        return response.data;
    }catch(err) {
        console.log("An unexpected error occurred "+err);
        throw err;
    }
}

export const apiDeleteAccount = async (id: string) => {
    try {
        const response = await AxiosInstance.delete(`/api/Admin/DeleteUser/${id}`);
        return response.data;
    }catch(err) {
        console.log("An unexpected error occurred "+err);
        throw err;
    }
}

export const apiActiveAccount = async (id: string) => {
    try {
        const response = await AxiosInstance.get(`/api/Admin/activate/${id}`);
        return response.data;
    }catch(err) {
        console.log("An unexpected error occurred "+err);
        throw err;
    }
}

export const apiDeactivateAccount = async (id: string) => {
    try {
        const response = await AxiosInstance.delete(`/api/Admin/deactivate/${id}`);
        return response.data;
    }catch(err) {
        console.log("An unexpected error occurred "+err);
        throw err;
    }
}