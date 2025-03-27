import AxiosInstance from "../utils/axiosInstance.ts";
import {
    AccountDetailResponse,
    AccountResponse,
    AccountRequest,
    LoginGoogleRequest,
    UpdateAccountRequest
} from "../interfaces/Account.ts";
import {
    ConfirmEmailRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest, ResetPasswordUserProfile, UserProfileUpdate
} from "../interfaces/Account.ts";
import axiosInstance from "../utils/axiosInstance";
import {ApiResponse} from "../interfaces/Layout.ts";

export const apiGetAllUser = async (): Promise<ApiResponse<AccountResponse[]>> => {
    try {
        const response = await AxiosInstance.get<ApiResponse<AccountResponse[]>>("/api/Admin/getAllUsers");
        return response.data;
    }catch(err: any | undefined) {
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
    }catch(err: any | undefined) {
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
    }catch(err: any | undefined) {
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
    }catch(err: any | undefined) {
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
    }catch(err: any | undefined) {
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
    }catch(err: any | undefined) {
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
    }catch(err: any | undefined) {
        return {
            statusCode: err.response?.data?.statusCode,
            isSuccess: false,
            errorMessages: err.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
            result: null
        };
    }
}


export const apiRegister = async (data: RegisterRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/register", data);
        return response.data;
    } catch (error) {
        // console.error("API Register Error:", error);
        throw error;
    }
};

export const apiLogIn = async (data: LoginRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/login", data);
        return response.data;
    } catch (error) {
        // console.error("API Login Error:", error);
        throw error;
    }
};

export const apiLogInGoogle = async (idToken: LoginGoogleRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/login-google", idToken);
        return response.data;
    } catch (error) {
        // console.error("API Login Error:", error);
        throw error;
    }
};

export const apiConfirmEmail = async (data: ConfirmEmailRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/confirm-email", data);
        return response.data;
    } catch (error) {
        // console.error("API Confirm Email Error:", error);
        throw error;
    }
};

export const apiForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/forget-password", data);
        return response.data;
    } catch (error) {
        // console.error("API Forgot Password Error:", error);
        throw error;
    }
};

export const apiResetPassword = async (data: ResetPasswordRequest) => {
    try {
        const response = await axiosInstance.post("/api/Auth/reset-password", data);
        return response.data;
    } catch (error) {
        // console.error("API Reset Password Error:", error);
        throw error;
    }
};

export const apiRefreshToken = async (refreshToken: string | null) => {
    try {
        const response = await axiosInstance.post(
            "/api/Auth/refresh-token",
            { refreshToken }
        );
        return response.data;
    } catch (error) {
        // console.error("API Refresh Error:", error);
        throw error;
    }
};



export const apiGetProfileUser = async () => {
    try{
        const  response = await axiosInstance.get("/api/user/profile");
        return response.data;
    }catch (err){
        // console.error("API GetProfileUser Error:", err);
        throw err;
    }
}

export const apiFindUser = async (keyword: string) => {
    try{
        const  response = await axiosInstance.get(`/api/user/search?keyword=${keyword}`);
        return response.data;
    }catch (err){
        // console.error("API GetProfileUser Error:", err);
        throw err;
    }
}

export const apiUpdateProfileUser = async (data : UserProfileUpdate ) => {
    try {
        const response = await  axiosInstance.put("/api/user/profile", data);
        return response.data;
    }catch (err){
        // console.log(err);
        throw err;
    }
}

export const apiChangePassword = async (data : ResetPasswordUserProfile)=> {
    try {
        const response = await  axiosInstance.post("/api/user/change-password", data);
        return response.data;
    }catch (err){
        // console.log(err);
        throw err;
    }
}
export const apiGetUserWallet = async () => {
    try {
        const response = await axiosInstance.get("/api/Wallet/user");
        return response.data;
    } catch (err) {

        return { isSuccess: false, result: { balance: 0 } };
    }
};



