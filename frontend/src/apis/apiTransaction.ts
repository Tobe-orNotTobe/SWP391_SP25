import axiosInstance from "../utils/axiosInstance";
import {RefundRequest} from "../interfaces/Transaction.ts";

export const apiPostTransaction = async (bookingId: number) => {
  try {
    const response = await axiosInstance.get(
      `api/Transaction/booking/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const apiPostVNPayTransaction = async (bookingId: number) => {
  try {
    const response = await axiosInstance.post(
      `api/VnPayment/create-payment/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const apiPostWaletTransaction = async (bookingId: number) => {
  try {
    const response = await axiosInstance.post(`/api/Wallet/payment/process/${bookingId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const apiGetUserRefundList = async () => {
  // Cái này là lấy thông tin refund của user nè
  try{
    const response = await axiosInstance.get(`/api/Refund/requests/my`);
    return response.data;
  }catch (error) {
    console.log(error);
    throw error;
  }
}

export const apiPostRefundRequest = async (data : RefundRequest) => {
  // Cái này là của người dùng nè, kiểu đơn confirm thì yêu cầu hoàn tiền luôn
  try {
    const response = await axiosInstance.post(`/api/Refund/request`, data);
    return response.data;
  }catch (error) {
    console.error("API Refund Error:", error);
    throw error;
  }
}

export const apiRefundApprove = async (refundRequestId : number) => {

  //Này dùng cho admin nha, chấp nhận đơn refund
  try {
    const response = await axiosInstance.put(`/api/Refund/approve/${refundRequestId}`);
    return response.data;
  }catch (error) {
    console.error("API Refund Error:", error);
    throw error;
  }
}

export const apiRefundReject = async (refundRequestId: number, adminNote: string) => {
  // Dùng cho admin nè
  try {
    const response = await axiosInstance.put(`/api/Refund/reject/${refundRequestId}`, {
      adminNote: adminNote,
    });
    return response.data;
  } catch (error) {
    console.error("API Refund Error:", error);
    throw error;
  }
};

export const apiDepositeUserToWallet = async (amount: number) => {
  try {
    const response = await axiosInstance.post(`/api/Wallet/deposit/create/`, { amount }); // Gửi dưới dạng JSON
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

