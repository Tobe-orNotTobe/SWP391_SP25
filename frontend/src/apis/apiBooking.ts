import axios from "axios";
import {Feedback} from "../interfaces/VaccineRegistration.ts";
import axiosInstance from "../utils/axiosInstance.ts";

import {decodeToken} from "../utils/decodeToken.ts";
import {UpdateFeedback} from "../interfaces/Feedback.ts";
import { Booking } from "../interfaces/Booking.ts";


export const apiBooking = async (userId: string, booking: Booking) => {
  try {
    const response = await axiosInstance.post(
      `api/Booking?userId=${userId}`,
      booking
    );

    console.log(response);

    if (response.status === 201) {
      const data = response.data;
      if (data.isSuccess) {
        console.log("Đặt lịch thành công!");
        return response.data; // Trả về status code nếu thành công
      } else {
        // Hiển thị thông báo lỗi từ API (nếu có)
        return (
          data.error?.errorMessages?.join(", ") || "Có lỗi xảy ra khi đặt lịch."
        );
      }
    } else {
      alert("Có lỗi xảy ra khi đặt lịch.");
    }
  } catch (error) {
    console.error("Error submitting booking:", error);

    // Xử lý lỗi từ axios hoặc server
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data.errorMessages.join(", ");
      throw serverError;
    } else {
      alert("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  } finally {
    console.log("Dữ liệu đặt lịch:", booking); // Log dữ liệu đặt lịch
  }
};

export const apiGetDoctorBookings = async (doctorId: string) => {
  try {
    const response = await axiosInstance.get(
      `api/Booking/doctor/${doctorId}/booking-details`
    );

    if (response.status === 200) {
      const data = response.data;
      if (data) {
        return data;
      } else {
        // alert(
        //   data.error?.errorMessages?.join(", ") ||
        //     "Có lỗi xảy ra khi lấy dữ liệu đặt lịch."
        // );
        return null;
      }
    } else {
      // alert("Có lỗi xảy ra khi lấy dữ liệu đặt lịch.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching doctor bookings:", error);
    if (axios.isAxiosError(error)) {
      // const serverError =
      //   error.response?.data?.error?.errorMessages?.join(", ");
      // // alert(serverError || "Có lỗi xảy ra khi gửi yêu cầu.");
    } else {
      // alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
    return null;
  } finally {
    console.log(
      `Đã gửi yêu cầu lấy danh sách đặt lịch của bác sĩ có ID: ${doctorId}`
    );
  }
};

export const apiGetBookingById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/api/Booking/${id}`);
    return response.data || {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // const serverError =
      //   error.response?.data?.error?.errorMessages?.join(", ");
      // alert(serverError || "Có lỗi xảy ra khi gửi yêu cầu.");
    } else {
      // alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
    return null;
    // console.error("API Get Booking Detail By ID Error:", error);
    // throw error;
  }
};

export const apiGetAllBookings = async () => {
  try {
    const response = await axiosInstance.get(`/api/Booking/all-bookings`);
    return response.data || {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
    //   const serverError =
    //     error.response?.data?.error?.errorMessages?.join(", ");
    //   alert(serverError || "Có lỗi xảy ra khi gửi yêu cầu.");
    // } else {
    //   alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
    return null;
    // console.error("API Get Booking Detail By ID Error:", error);
    // throw error;
  }
};

export const apiPutBookingComplete = async (id: number) => {
  try {
    const response = await axiosInstance.put(`/api/Booking/${id}/complete`);
    return response.data || {};
  } catch (error) {
    console.error("API Put Booking Complete By ID Error:", error);
    throw error;
  }
};

export const apiGetBookingUser = async () => {
  const finalUserId = decodeToken(localStorage.getItem("token"))?.sub;
  if (!finalUserId) {
    throw new Error("User ID not found");
  }
  try{
    const response = await axiosInstance.get(`/api/Booking/user/${finalUserId}`);
    return response.data;
  }catch(error) {
    console.error("API Get Booking User Error:", error);
    throw error;
  }
}

export const apiAssignDoctor = async (doctorId: string, bookingId: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/Booking/assign-doctor?bookingId=${bookingId}&userId=${doctorId}`
    );
    return response.data || {};
  } catch (error) {
    console.error("API Assign doctor Error:", error);
    throw error;
  }
};

export const apiUnAssignDoctor = async (bookingId: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/Booking/${bookingId}/unassign-doctor`
    );
    return response.data || {};
  } catch (error) {
    console.error("API Unassign doctor Error:", error);
    throw error;
  }
};

export const apiCancelBooking = async (bookingId : number) => {
  const finalUserId =  decodeToken(localStorage.getItem("token"))?.sub;

  try {
    const response = await axiosInstance.delete(`/api/Booking/${bookingId}/cancel`, {
      params: { userId: finalUserId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }

}

export const apiPostFeedBack = async (data : Feedback)=> {
  try {
    const response = await axiosInstance.post(`/api/Feedback`, data);
    return response.data;
  }catch (err){
    console.error("API Feedback Error:", err);
    throw err;
  }
}


export const apiGetFeebBackUserByBookingId = async (bookingId : number) => {
  try {
    const response = await axiosInstance.get(`/api/Feedback/${bookingId}`);
    return response.data;
  }catch (err){
    console.error("API Feedback Error:", err);
    throw err;
  }
}


export const apiDeleteFeedBack = async (feedbackId : number) => {
  try{
    const response = await  axiosInstance.delete(`/api/Feedback/${feedbackId}`);
    return response.data;
  }catch (err){
    console.log(err);
    throw err;
  }
}

export const apiUpdateFeedback = async ( bookingId : number, data : UpdateFeedback) => {
  try{
    const response = await axiosInstance.put(`/api/Feedback/${bookingId}`, data);
    return response.data;
  }catch (err){
    console.error(err)
    throw err;
  }
}

export const apiGetUnassignedBooking = async () => {
  try {
    const response = await axiosInstance.get("/api/Booking/unassigned");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.errorMessages || ["Unknown error occurred"];
    } else {
      throw ["An unexpected error occurred"];
    }
  }
};

export const apiCheckParentVaccine = async (vaccineIds: number[]) => {
  try {
    const formData = new FormData();

    // Thêm vaccineIds vào formData
    vaccineIds.forEach(id => {
      formData.append("VaccineIds", id.toString());
    });

    const response = await axiosInstance.post("/api/Booking/check-parent-vaccine", formData, {
      headers: {
        "Accept": "*/*",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.errorMessages || ["Unknown error occurred"];
    } else {
      throw ["An unexpected error occurred"];
    }
  }
};


export const apiGetVaccineRecordByBookingId = async (bookingDetailId : number)=> {
  try{
    const response = await axiosInstance.get(`/api/VaccineRecord/bookingDetail/${bookingDetailId}`);
    return response.data
  }catch (err){
    // console.log(err);
    throw err;
  }
}

export const apiGetVaccineRecordByBookingDetailId = async (bookingDetailId : number) => {
  try {
    const response = await  axiosInstance.get(`/api/VaccineRecord/bookingDetail/${bookingDetailId}`);
    return response.data;
  }catch (err){
    throw  err;
  }
}