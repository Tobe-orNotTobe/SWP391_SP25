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



