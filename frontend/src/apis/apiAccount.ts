import AxiosInstance from "../utils/axiosInstance.ts";
import {AccountDetailResponse, AccountRequest, UpdateAccountRequest} from "../interfaces/Account.ts";
import {ApiResponse} from "../interfaces/BeResponse.ts";

export const apiGetAllUser = async (): Promise<ApiResponse<AccountDetailResponse[]>> => {
    try {
        const response = await AxiosInstance.get<ApiResponse<AccountDetailResponse[]>>("/api/Admin/getAllUsers");
        return response.data;
    }catch(err: any) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

export const apiGetUserById = async (id: string): Promise<ApiResponse<AccountDetailResponse>> => {
    try {
        const response = await AxiosInstance.get<ApiResponse<AccountDetailResponse>>(`/api/Admin/admin/GetUserById/${id}`);
        return response.data;
    }catch(err: any) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

export const apiCreateAccount = async (data: AccountRequest) => {
    try {
        const response = await AxiosInstance.post("/api/Admin/create-account", data);
        return response.data;
    }catch(err: any) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

export const apiUpdateAccount = async (data: UpdateAccountRequest) => {
    try {
        const response = await AxiosInstance.put("/api/Admin/UpdateUser", data);
        return response.data;
    }catch(err: any) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

export const apiDeleteAccount = async (id: string) => {
    try {
        const response = await AxiosInstance.delete(`/api/Admin/DeleteUser/${id}`);
        return response.data;
    }catch(err: any) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

export const apiActiveAccount = async (id: string) => {
    try {
        const response = await AxiosInstance.put(`/api/Admin/activate/${id}`);
        return response.data;
    }catch(err: any) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}

export const apiDeactivateAccount = async (id: string) => {
    try {
        const response = await AxiosInstance.put(`/api/Admin/deactivate/${id}`);
        return response.data;
    }catch(err: any) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}