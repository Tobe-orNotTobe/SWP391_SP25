// src/components/notification/SystemNotification.tsx
import React from 'react';
import { Card, Typography, Space, Avatar, Button, Tooltip } from 'antd';
import { 
  BellOutlined, 
  InfoCircleOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  DeleteOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { NotificationType } from '../../interfaces/Notification';
import dayjs from 'dayjs';
import './SystemNotification.scss';

const { Text, Paragraph } = Typography;

interface SystemNotificationProps {
  notification: NotificationType;
  onMarkAsRead: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const SystemNotification: React.FC<SystemNotificationProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const getNotificationIcon = () => {
    switch (notification.type.toLowerCase()) {
      case 'warning':
        return <WarningOutlined />;
      case 'system':
        return <InfoCircleOutlined />;
      default:
        return <BellOutlined />;
    }
  };
  
  const getIconBackground = () => {
    switch (notification.type.toLowerCase()) {
      case 'warning':
        return '#ff4d4f';
      case 'system':
        return '#faad14';
      default:
        return '#1890ff';
    }
  };
  
  return (
    <Card 
      className={`system-notification ${!notification.isRead ? 'unread' : ''}`}
      bordered={true}
    >
      <div className="notification-content">
        <div className="notification-icon">
          <Avatar
            icon={getNotificationIcon()}
            style={{ backgroundColor: getIconBackground() }}
            size="large"
          />
        </div>
        
        <div className="notification-body">
          <div className="notification-message">
            <Paragraph>{notification.message}</Paragraph>
          </div>
          
          <div className="notification-meta">
            <Space size="small">
              <ClockCircleOutlined />
              <Text type="secondary">
                {dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </Space>
            
            <div className="notification-type">
              {notification.type === 'Warning' ? 'Cảnh báo' : 
               notification.type === 'System' ? 'Thông báo hệ thống' : 'Thông báo'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="notification-actions">
        {!notification.isRead && (
          <Tooltip title="Đánh dấu đã đọc">
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              onClick={() => onMarkAsRead(notification.notificationId)}
            >
              Đánh dấu đã đọc
            </Button>
          </Tooltip>
        )}
        
        <Tooltip title="Xóa thông báo">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(notification.notificationId)}
          >
            Xóa
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default SystemNotification;