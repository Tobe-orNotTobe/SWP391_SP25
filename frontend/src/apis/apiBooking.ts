import axios from "axios";
import { Booking } from "../types/VaccineRegistration";

export const apiBooking = async (userId: string, booking: Booking): Promise<number | void> => {
  try {
    const response = await axios.post(
      `https://localhost:7134/api/Booking?userId=${userId}`,
      booking
    );

    if (response.status === 201) {
      const data = response.data;
      if (data.isSuccess) {
        alert("Đặt lịch thành công!");
        return response.status; // Trả về status code nếu thành công
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