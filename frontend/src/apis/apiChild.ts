import axiosInstance from "../utils/axiosInstance";
import { decodeToken } from "../utils/decodeToken.ts";
import {ChildDetailRequest, ChildDetailResponse} from "../interfaces/Child.ts";
import {ApiResponse} from "../interfaces/Layout.ts";


export const apiGetMyChilds = async (userId?: string): Promise<ApiResponse<ChildDetailResponse[]>> => {
  try {
    // Lấy userId từ token nếu không truyền vào
    const finalUserId = userId || decodeToken(localStorage.getItem("token"))?.sub;
    if (!finalUserId) {
      return {
        statusCode: "NotFound",
        isSuccess: false,
        errorMessages: ["User ID not found"],
        result: null
      };
    }

    // Gọi API
    const response = await axiosInstance.get<ApiResponse<ChildDetailResponse[]>>(`/api/Children/user/${finalUserId}`);
    return response.data; // Trả về dữ liệu từ API nếu thành công
  } catch (error: any) {
    return {
      statusCode: error.response?.data?.statusCode,
      isSuccess: false,
      errorMessages: error.response?.data?.errorMessages || ["Có lỗi xảy ra!"],
      result: null
    };
  }
};



export const apiChildRegister = async (data: ChildDetailRequest) => {
  const userId = decodeToken(localStorage.getItem("token"))?.sub;
  if (!userId) {
    return { message: "User ID not found" };
  }

  const response = await axiosInstance.post(
    `/api/Children?userId=${encodeURIComponent(userId)}`,
    data
  );
  return response.data
    ? response.data
    : { message: "An unexpected error occurred" };
};

export const apiChildUpdate = async (
  data: ChildDetailRequest,
  childId: number
) => {
  const response = await axiosInstance.put(
    `/api/Children/${encodeURIComponent(childId)}`,
    data
  );
  return response.data
    ? response.data
    : { message: "An unexpected error occurred" };
};

export const apiChildDelete = async (childId: number) => {
  const response = await axiosInstance.delete(
    `/api/Children/${encodeURIComponent(childId)}`
  );
  return response.data
    ? response.data
    : { message: "An unexpected error occurred" };
};

export const apiGetChildById = async (childId: number) => {
  const response = await axiosInstance.get(
    `/api/Children/${encodeURIComponent(childId)}`
  );
  return response.data
    ? response.data
    : { message: "An unexpected error occurred" };
};
