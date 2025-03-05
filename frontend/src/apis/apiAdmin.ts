import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

export const apiGetAllDoctors = async () => {
  try {
    const response = await axiosInstance.get("/api/Admin/getAllDoctors");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Lấy danh sách lỗi từ response
      throw error.response.data.errorMessages || ["Unknown error occurred"];
    } else {
      throw ["An unexpected error occurred"];
    }
  }
};

export const apiDashBoardRevenue = async  () => {
  try {
    // const  response = await axiosInstance.get("/api/Dashboard/revenue");
    const response = await axios.get("/Dashboard/Revenue.json");
    return response.data;
  }catch(error){
    console.error("API Dashboard Error:", error);
    throw error;
  }
}

export const apiDashBoardFeedBack = async  () => {
  try{
    // const response = await axiosInstance.get("/api/Dashboard/feedbacks");
    const response = await axios.get("/Dashboard/Feedback.json");
    return response.data;
  }catch (error){
    console.error("API Dashboard Error:", error);
  }
}

export const apiExportedVaccines = async  () => {
  try {
    // const response = await axiosInstance.get("/api/Dashboard/exported-vaccines");
    const response = await axios.get("/Dashboard/ExportedVaccine.json");
    return response.data;
  }catch(error){
    console.error("API Dashboard Error:", error);
    throw error;
  }
}