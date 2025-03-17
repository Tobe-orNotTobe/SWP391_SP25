// src/interfaces/Notification.ts
export interface NotificationType {
    notificationId: number;
    userId: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    type: string;
    relatedEntityType: string | null;
    relatedEntityId: number | null;
  }
  
  export interface NotificationResponse {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: NotificationType[] | null;
  }
  
  export interface NotificationCountResponse {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: { unreadCount: number } | null;
  }