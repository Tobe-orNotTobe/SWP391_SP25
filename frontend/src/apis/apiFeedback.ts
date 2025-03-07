import axiosInstance from "../utils/axiosInstance.ts";
import {FeedbackRequest, UpdateFeedbackRequest} from "../interfaces/Feedback.ts";

export const apiGetAllFeedback = async () => {
    const response = await axiosInstance.get(`/api/Dashboard/feedbacks`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiGetFeedbackById = async (feedbackId: string) => {
    const response = await axiosInstance.get(`/api/Feedback/${feedbackId}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
};

export const apiCreateFeedback = async (data: FeedbackRequest) => {
    const response = await axiosInstance.post(`/api/Feedback`, data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}

export const apiUpdateFeedback = async (feedbackId: number, data: UpdateFeedbackRequest) => {
    const response = await axiosInstance.put(`/api/Feedback/${feedbackId}`, data);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}

export const apiDeleteFeedback = async (feedbackId: number) => {
    const response = await axiosInstance.delete(`/api/Feedback/${feedbackId}`);
    return response.data ? response.data : { message: "An unexpected error occurred" };
}