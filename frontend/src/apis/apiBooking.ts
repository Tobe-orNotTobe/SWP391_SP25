import axios from "axios";
import { Booking } from "../interfaces/VaccineRegistration.ts";
import axiosInstance from "../utils/axiosInstance.ts";

export const apiBooking = async (userId: string, booking: Booking) => {
  try {
    const response = await axiosInstance.post(
      `api/Booking?userId=${userId}`,
      booking
    );

    console.log(response)

    if (response.status === 201) {
      const data = response.data;
      if (data.isSuccess) {
        alert("Đặt lịch thành công!");
        return response.data; // Trả về status code nếu thành công
      } else {
        // Hiển thị thông báo lỗi từ API (nếu có)
        return data.error?.errorMessages?.join(", ") || "Có lỗi xảy ra khi đặt lịch.";
      }
    } else {
      alert("Có lỗi xảy ra khi đặt lịch.");
    }
  } catch (error) {
    console.error("Error submitting booking:", error);

    // Xử lý lỗi từ axios hoặc server
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error?.errorMessages?.join(", ");
      alert(serverError || "Có lỗi xảy ra khi gửi dữ liệu.");
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
      `api/Booking/doctor/${doctorId}/bookings`
    );

    console.log(response);

    if (response.status === 200) {
      const data = response.data;
      // Giả sử API trả về dữ liệu có isSuccess
      if (data.isSuccess) {
        return data;
      } else {
        alert(data.error?.errorMessages?.join(", ") || "Có lỗi xảy ra khi lấy dữ liệu đặt lịch.");
        return null;
      }
    } else {
      alert("Có lỗi xảy ra khi lấy dữ liệu đặt lịch.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching doctor bookings:", error);
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.error?.errorMessages?.join(", ");
      alert(serverError || "Có lỗi xảy ra khi gửi yêu cầu.");
    } else {
      alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
    return null;
  } finally {
    console.log(`Đã gửi yêu cầu lấy danh sách đặt lịch của bác sĩ có ID: ${doctorId}`);
  }
};