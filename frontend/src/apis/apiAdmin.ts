import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

export const apiGetAllDoctors = async () => {
  try {
    const response = await axiosInstance.get("/api/Admin/getAllDoctors");
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
