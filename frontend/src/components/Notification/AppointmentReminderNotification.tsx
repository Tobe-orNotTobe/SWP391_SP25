// src/components/notification/AppointmentReminderNotification.tsx
import React from 'react';
import { Button, Card, Typography, Space, Avatar, Tooltip } from 'antd';
import { NotificationType } from '../../interfaces/Notification';
import { CalendarOutlined, ClockCircleOutlined, MedicineBoxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './AppointmentReminderNotification.scss';

const { Title, Text } = Typography;

interface AppointmentReminderProps {
  notification: NotificationType;
  onMarkAsRead: (id: number) => Promise<void>;
}

const AppointmentReminderNotification: React.FC<AppointmentReminderProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const navigate = useNavigate();
  
  // Extract date from notification message (if available)
  // This is based on the assumption that your reminder messages include the date
  const extractDate = () => {
    const dateRegex = /ngày (\d{2}\/\d{2}\/\d{4})/;
    const timeRegex = /lúc (\d{2}:\d{2})/;
    
    const dateMatch = notification.message.match(dateRegex);
    const timeMatch = notification.message.match(timeRegex);
    
    const date = dateMatch ? dateMatch[1] : null;
    const time = timeMatch ? timeMatch[1] : null;
    
    return { date, time };
  };
  
  const { date, time } = extractDate();
  
  const handleViewDetails = () => {
    if (notification.relatedEntityId) {
      // Mark as read first
      onMarkAsRead(notification.notificationId);
      
      // Navigate to booking details
      navigate(`/booking-detail/${notification.relatedEntityId}`);
    }
  };
  
  // const handleConfirm = async () => {
  //   // Mark notification as read
  //   await onMarkAsRead(notification.notificationId);
  //
  //   // You could also call an API to confirm the appointment if needed
  //   // For now, we'll just mark it as read
  // };
  
  return (
    <Card 
      className={`appointment-reminder ${!notification.isRead ? 'unread' : ''}`}
      bordered={true}
    >
      <div className="reminder-header">
        <Avatar 
          icon={<CalendarOutlined />} 
          style={{ backgroundColor: '#2A388F' }} 
          size="large"
        />
        <Title level={5} className="reminder-title">
          Nhắc lịch hẹn tiêm chủng
        </Title>
      </div>
      
      <div className="reminder-content">
        <p>{notification.message}</p>
        
        {(date || time) && (
          <div className="reminder-details">
            {date && (
              <Space>
                <CalendarOutlined />
                <Text strong>{date}</Text>
              </Space>
            )}
            {time && (
              <Space>
                <ClockCircleOutlined />
                <Text strong>{time}</Text>
              </Space>
            )}
          </div>
        )}
        
        <div className="reminder-time">
          <ClockCircleOutlined /> Thông báo lúc: {dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm')}
        </div>
      </div>
      
      <div className="reminder-actions">
        <Button 
          type="primary" 
          onClick={handleViewDetails}
        >
          <MedicineBoxOutlined /> Xem chi tiết
        </Button>
        {!notification.isRead && (
          <Tooltip title="Đánh dấu đã đọc">
            <Button 
              onClick={() => onMarkAsRead(notification.notificationId)}
            >
              <CheckCircleOutlined /> Đã đọc
            </Button>
          </Tooltip>
        )}
      </div>
    </Card>
  );
};

export default AppointmentReminderNotification;