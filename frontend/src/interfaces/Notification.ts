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

  export interface NotificationContextType {
      notifications: NotificationType[];
      reminderNotifications: NotificationType[];
      otherNotifications: NotificationType[];
      unreadCount: number;
      loading: boolean;
      connectionStatus: string | null;
      markAsRead: (notificationId: number) => Promise<void>;
      deleteNotification: (notificationId: number) => Promise<void>;
      handleNotificationClick: (notification: NotificationType) => Promise<void>;
      refreshNotifications: () => Promise<void>;
  }

  export interface SendNotificationRequest {
      userId: string;
      message: string;
      type: string; //Admin - System
      relatedEntityType: string; //Booking - Reminder
      relatedEntityId: 0
  }