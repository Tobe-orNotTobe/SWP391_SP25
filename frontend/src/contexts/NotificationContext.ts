// src/contexts/NotificationContext.tsx
import React, { useContext, useEffect, useState } from 'react';
import { NotificationType, NotificationContextType } from '../interfaces/Notification';
import { apiGetAllNotifications, apiGetUnreadCount, apiMarkAsRead, apiDeleteNotification } from '../apis/apiNotification';
import notificationService from '../services/NotificationService';
import { message } from 'antd';
import { IsLoginSuccessFully } from '../validations/IsLogginSuccessfully';
import { useNavigate } from 'react-router-dom';
// import { PropsWithChildren } from 'react';

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [reminderNotifications, setReminderNotifications] = useState<NotificationType[]>([]);
  const [otherNotifications, setOtherNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const { sub } = IsLoginSuccessFully();
  const navigate = useNavigate();

  // Categorize notifications by type
  const categorizeNotifications = (allNotifications: NotificationType[]) => {
    const reminders = allNotifications.filter(
      n => n.type.toLowerCase() === 'reminder' && n.relatedEntityType === 'Booking'
    );
    
    const others = allNotifications.filter(
      n => n.type.toLowerCase() !== 'reminder' || n.relatedEntityType !== 'Booking'
    );
    
    return { reminders, others };
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    if (!sub) return;
    
    setLoading(true);
    try {
      const response = await apiGetAllNotifications();
      if (response.isSuccess && response.result) {
        const allNotifications = response.result;
        setNotifications(allNotifications);
        
        const { reminders, others } = categorizeNotifications(allNotifications);
        setReminderNotifications(reminders);
        setOtherNotifications(others);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!sub) return;
    
    try {
      const response = await apiGetUnreadCount();
      if (response.isSuccess && response.result) {
        setUnreadCount(response.result.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
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
        
        // Update reminder notifications
        setReminderNotifications(prevState =>
          prevState.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        
        // Update other notifications
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
  };

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      const success = await apiDeleteNotification(notificationId);
      if (success) {
        const notificationToDelete = notifications.find(n => n.notificationId === notificationId);
        
        // Remove from all notification lists
        setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        setReminderNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        setOtherNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        
        // If we're deleting an unread notification, decrement the unread count
        if (notificationToDelete && !notificationToDelete.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: NotificationType) => {
    // If notification is unread, mark it as read
    if (!notification.isRead) {
      await markAsRead(notification.notificationId);
    }
    
    // Handle different notification types
    if (notification.type.toLowerCase() === 'reminder' && notification.relatedEntityType === 'Booking' && notification.relatedEntityId) {
      // Navigate to booking details
      navigate(`/booking-detail/${notification.relatedEntityId}`);
    } else if (notification.relatedEntityType && notification.relatedEntityId) {
      // Handle other entity types if needed
      navigate(`/${notification.relatedEntityType.toLowerCase()}/${notification.relatedEntityId}`);
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  };

  // Set up real-time notifications with SignalR
  useEffect(() => {
    if (!sub) return;
    
    // Start the connection
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

    // Set up listener for new notifications
    const unsubscribe = notificationService.addListener((notification) => {
      // Add the new notification to the list
      setNotifications(prev => [notification, ...prev]);
      
      // Add to appropriate category
      if (notification.type.toLowerCase() === 'reminder' && notification.relatedEntityType === 'Booking') {
        setReminderNotifications(prev => [notification, ...prev]);
      } else {
        setOtherNotifications(prev => [notification, ...prev]);
      }
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
      
      // Show a notification toast
      message.info({
        content: notification.message,
        duration: 5,
        style: {
          marginTop: '50px'
        }
      });
    });

    // Check connection status periodically
    const connectionCheckInterval = setInterval(() => {
      const state = notificationService.getConnectionState();
      setConnectionStatus(state?.toString() || 'disconnected');
    }, 10000);

    // Initial fetch
    refreshNotifications();

    // Clean up on unmount
    return () => {
      unsubscribe();
      notificationService.stopConnection();
      clearInterval(connectionCheckInterval);
    };
  }, [sub, navigate]);

  const contextValue: NotificationContextType = {
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

  return React.createElement(NotificationContext.Provider, { value: contextValue }, children);

};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};