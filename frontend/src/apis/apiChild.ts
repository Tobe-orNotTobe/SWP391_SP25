import axiosInstance from "../utils/axiosInstance";
import { decodeToken } from "../utils/decodeToken.ts";
import { ChildDetailRequest } from "../interfaces/Child.ts";
import axios, { AxiosError } from "axios";

export const apiGetMyChilds = async (userId?: string) => {
  try {
    // Nếu không truyền userId, lấy từ token trong localStorage
    const finalUserId = userId || decodeToken(localStorage.getItem("token"))?.sub;
    if (!finalUserId) {
      throw new Error("User ID not found");
    }

    const response = await axiosInstance.get(`/api/Children/user/${finalUserId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      // Lấy danh sách lỗi từ response
      throw error.response.data.errorMessages || ["Unknown error occurred"];
    } else {
      throw ["An unexpected error occurred"];
    }
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
