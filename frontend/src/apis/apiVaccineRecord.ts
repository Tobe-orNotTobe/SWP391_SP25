import { UpdateVaccineRecordRequest } from "../interfaces/VaccineRecord";
import axiosInstance from "../utils/axiosInstance";

export const apiCreateVaccineRecord = async (id: number) => {
  try {
    const response = await axiosInstance.post(`api/VaccineRecord/${id}/create`);
    return response.data || {};
  } catch (error) {
    console.error("API Create Vaccine Record Error:", error);
    throw error;
  }
};

export const apiGetVaccineRecord = async (id: number) => {
  try {
    const response = await axiosInstance.get(`api/VaccineRecord/${id}`);
    return response.data || {};
  } catch (error) {
    console.error("API Get Vaccine Record Error:", error);
    throw error;
  }
};

export const apiGetVaccineRecordByBookingId = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/api/VaccineRecord/booking/${id}`);
    return response.data || {};
  } catch (error) {
    console.error("API Get Vaccine Record By Booking Id Error:", error);
    throw error;
  }
};

export const apiGetVaccineRecordByBookingDetailId = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/api/VaccineRecord/bookingDetail/${id}`);
    return response.data || {};
  } catch (error) {
    console.error("API Get Vaccine Record By Booking Detail Id Error:", error);
    throw error;
  }
};

export const apiUpdateVaccineRecord = async (id: number, data: UpdateVaccineRecordRequest) => {
    try {
      const response = await axiosInstance.put(`api/VaccineRecord/${id}/update`, data);
      return response.data || {};
    } catch (error) {
      console.error("API Update Vaccine Record Error:", error);
      throw error;
    }
  };


export const apiVaccineRecordByBookingId =  async  ( bookingId: number) => {
  try{
    const response = await axiosInstance.get(`/api/VaccineRecord/booking/${bookingId}`);
    return response.data ;
  }catch (err){
    throw err;
  }
}
