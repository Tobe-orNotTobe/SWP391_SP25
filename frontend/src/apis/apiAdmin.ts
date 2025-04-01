import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import dayjs from "dayjs";

export const apiGetAllDoctors = async () => {
  try {
    const response = await axiosInstance.get("/api/Admin/getAllDoctors");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.errorMessages || ["Unknown error occurred"];
    } else {
      throw ["An unexpected error occurred"];
    }
  }
};

export const apiDashBoardTotalRevenue = async  () => {
  try {
    const response = await axiosInstance.get("/api/Dashboard/total-revenue");
    return response.data;
  }catch(error){
    console.error("API Dashboard Error:", error);
    throw error;
  }
}

export const apiDashBoardRevenueLast10days = async  () => {
  try {
    const response = await  axiosInstance.get("/api/Dashboard/revenue/last-10-days");
    return response.data;
  }catch (err){
    console.error("API Dashboard Error:", err);
    throw err;
  }
}

export const apiDashBoardFeedBack = async  () => {
  try{
    const response = await axiosInstance.get("/api/Dashboard/feedbacks");
    // const response = await axios.get("/Dashboard/Feedback.json");
    return response.data;
  }catch (error){
    console.error("API Dashboard Error:", error);
  }
}

export const apiGetRefundList = async () => {
  // Cái này dùng cho admin nhe
  try {
    const response = await axiosInstance.get(`/api/Refund/requests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching refund list:", error);
    throw error;
  }
};

export const apiGetRefundRequestById= async (refundRequestId : number) => {
  //Cái này dùng cho admin nè, lấy thông tin dựa trên Id của request
  try{
    const response = await axiosInstance.get(`/api/Refund/requests/${refundRequestId}`);
    return response.data;
  }catch (err){
    console.error("API Refund Error:", err);
    throw err;
  }
}


export const apiAdminAddFund  = async (amount : number) => {
  try {
    const response = await axiosInstance.post(`/api/Wallet/admin/add-funds/`, { amount });
    return response.data;
  }catch (err){
    console.error("API Admin Error:", err);
    throw err;
  }
}

export const apiAdminExportedVaccine = async () => {
  try {
    const response = await axiosInstance.get("/api/Dashboard/exported-vaccines");
    return response.data;
  }catch (err){
    console.log(err);
    throw err;
  }
}

export const apiTopUseVaccine = async () => {
  try {
    const response = await axiosInstance.get("/api/Dashboard/top-used-vaccines");
    return response.data;
  }catch (err){
    console.error("API Top Used Error:", err);
    throw err;
  }
}


export const apiAdminGetRevenuePerDay = async (date: string) => {

  const formattedDate = dayjs(date).format("YYYY-MM-DDT00:00:00[Z]");

  try {
    const response = await axiosInstance.get(`api/Dashboard/revenue/${formattedDate}`);
    return response.data;
  }catch (err){
    throw err
  }
}
