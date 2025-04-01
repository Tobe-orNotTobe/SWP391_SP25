// src/hooks/useNotificationHook.ts
import { useState, useCallback, useEffect } from 'react';
import { NotificationType } from '../interfaces/Notification';
import { message } from 'antd';
import { 
  apiGetAllNotifications, 
  apiGetUnreadCount, 
  apiMarkAsRead, 
  apiDeleteNotification 
} from '../apis/apiNotification';
import notificationService from '../services/NotificationService';
import { useNavigate } from 'react-router-dom';

export const useNotificationHook = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [reminderNotifications, setReminderNotifications] = useState<NotificationType[]>([]);
  const [otherNotifications, setOtherNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiGetAllNotifications();
      if (response.isSuccess && response.result) {
        const allNotifications = response.result;
        setNotifications(allNotifications);
        
        // Separate reminders from other notifications
        const reminders = allNotifications.filter(
          n => n.type === 'Reminder' && n.relatedEntityType === 'Booking'
        );
        setReminderNotifications(reminders);
        
        // Other notifications
        const others = allNotifications.filter(
          n => n.type !== 'Reminder' || n.relatedEntityType !== 'Booking'
        );
        setOtherNotifications(others);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await apiGetUnreadCount();
      if (response.isSuccess && response.result) {
        setUnreadCount(response.result.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const success = await apiMarkAsRead(notificationId);
      if (success) {
        // Update notifications state
        setNotifications(prevState =>
          prevState.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        
        // Update reminder notifications state
        setReminderNotifications(prevState =>
          prevState.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        
        // Update other notifications state
        setOtherNotifications(prevState =>
          prevState.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const success = await apiDeleteNotification(notificationId);
      if (success) {
        // Find the notification to check if it's unread
        const notificationToDelete = notifications.find(n => n.notificationId === notificationId);
        
        // Update notifications state
        setNotifications(prevState =>
          prevState.filter(notification => notification.notificationId !== notificationId)
        );
        
        // Update reminder notifications state
        setReminderNotifications(prevState =>
          prevState.filter(notification => notification.notificationId !== notificationId)
        );
        
        // Update other notifications state
        setOtherNotifications(prevState =>
          prevState.filter(notification => notification.notificationId !== notificationId)
        );
        
        // Update unread count if the deleted notification was unread
        if (notificationToDelete && !notificationToDelete.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Handle a notification click based on its type
  const handleNotificationClick = useCallback(async (notification: NotificationType) => {
    // If notification is unread, mark it as read
    if (!notification.isRead) {
      await markAsRead(notification.notificationId);
    }
    
    // Handle different notification types
    if (notification.type === 'Reminder' && notification.relatedEntityType === 'Booking' && notification.relatedEntityId) {
      // Navigate to booking details
      navigate(`/booking-detail/${notification.relatedEntityId}`);
    } else if (notification.relatedEntityType && notification.relatedEntityId) {
      // Handle other entity types if needed
      navigate(`/${notification.relatedEntityType.toLowerCase()}/${notification.relatedEntityId}`);
    }
  }, [markAsRead, navigate]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  // Set up real-time notifications with SignalR
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const startConnection = async () => {
      try {
        await notificationService.startConnection();
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Failed to connect to notification hub:', error);
        setConnectionStatus('failed');
      }
    };

    startConnection();

    const unsubscribe = notificationService.addListener((notification) => {
      setNotifications(prev => [notification, ...prev]);

      if (notification.type === 'Reminder' && notification.relatedEntityType === 'Booking') {
        setReminderNotifications(prev => [notification, ...prev]);
      } else {
        setOtherNotifications(prev => [notification, ...prev]);
      }

      setUnreadCount(prev => prev + 1);

      message.info({
        content: notification.type === 'Reminder'
            ? `Nhắc lịch hẹn tiêm chủng: ${notification.message}`
            : notification.message,
        duration: notification.type === 'Reminder' ? 10 : 5,
        style: { marginTop: '50px' },
        onClick: () => handleNotificationClick(notification)
      });
    });

    refreshNotifications();

    const connectionCheckInterval = setInterval(() => {
      const state = notificationService.getConnectionState();
      setConnectionStatus(state?.toString() || 'disconnected');
    }, 10000);

    return () => {
      unsubscribe();
      notificationService.stopConnection();
      clearInterval(connectionCheckInterval);
    };
  }, [handleNotificationClick, refreshNotifications]);

  // Make sure to return all the needed values
  return {
    notifications,
    reminderNotifications,
    otherNotifications,
    unreadCount,
    loading,
    connectionStatus,
    markAsRead,
    deleteNotification,
    handleNotificationClick,
    refreshNotifications
  };
};