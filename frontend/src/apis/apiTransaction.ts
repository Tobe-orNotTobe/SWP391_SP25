import axiosInstance from "../utils/axiosInstance";
import {decodeToken} from "../utils/decodeToken.ts";

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


export const apiGetWalletUserByUserId = async () => {
  const userId = decodeToken(localStorage.getItem("token"))?.sub;
  try {
    const response = await axiosInstance.get(`/api/Wallet/user/${userId}`);
    console.log(response.data);
    return response.data;

  }catch (error) {
    console.error("API Get WalletUser Error:", error);
    throw error;
  }
}

