// src/api/apiNotification.ts
import axiosInstance from '../utils/axiosInstance';
import {NotificationResponse, NotificationCountResponse, SendNotificationRequest} from '../interfaces/Notification';

export const apiGetAllNotifications = async (): Promise<NotificationResponse> => {
  try {
    const response = await axiosInstance.get<NotificationResponse>('/api/Notification/user');
    return response.data;
  } catch (err: any) {
    return {
      statusCode: err.response?.data?.statusCode || 500,
      isSuccess: false,
      errorMessages: err.response?.data?.errorMessages || ['Failed to fetch notifications'],
      result: []
    };
  }
};

export const apiGetUnreadCount = async (): Promise<NotificationCountResponse> => {
  try {
    const response = await axiosInstance.get<NotificationCountResponse>('/api/Notification/unread-count');
    return response.data;
  } catch (err: any) {
    return {
      statusCode: err.response?.data?.statusCode || 500,
      isSuccess: false,
      errorMessages: err.response?.data?.errorMessages || ['Failed to fetch unread count'],
      result: { unreadCount: 0 }
    };
  }
};

export const apiMarkAsRead = async (notificationId: number): Promise<boolean> => {
  try {
    const response = await axiosInstance.put(`/api/Notification/${notificationId}/read`);
    return response.data.isSuccess;
  } catch (err) {
    console.error('Error marking notification as read:', err);
    return false;
  }
};

export const apiDeleteNotification = async (notificationId: number): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/api/Notification/${notificationId}`);
    return response.data.isSuccess;
  } catch (err) {
    console.error('Error deleting notification:', err);
    return false;
  }
};

export const apiSendNotification = async (data: SendNotificationRequest) => {

  try {
    const response = await axiosInstance.post('/api/Notification/send', data);
    return response.data;
  } catch (err: any) {
    return {
      statusCode: err.response?.data?.statusCode || 500,
      isSuccess: false,
      errorMessages: err.response?.data?.errorMessages || ['Failed to send notification'],
      result: null,
    };
  }

}