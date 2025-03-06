import axiosInstance from "../utils/axiosInstance";

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
    const response = await axiosInstance.post(`/api/payment/wallet/process`, {
      bookingId: bookingId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
