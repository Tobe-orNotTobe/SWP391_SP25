import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, List, Button, Empty, Spin, Avatar, Tooltip, Tabs } from 'antd';
import { IoIosNotifications } from 'react-icons/io';
import { 
  DeleteOutlined, 
  CheckOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  BellOutlined,
  RightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNotificationHook } from '../../hooks/useNotificationHook';
import './NotificationDropdown.scss';
import {useNavigate} from "react-router-dom";

dayjs.extend(relativeTime);

const { TabPane } = Tabs;

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  const {
    notifications,
    reminderNotifications,
    otherNotifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
    handleNotificationClick,
    refreshNotifications
  } = useNotificationHook();

  useEffect(() => {
    // Refresh notifications when dropdown is opened
    if (open) {
      refreshNotifications().then();
    }
  }, [open, refreshNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reminder':
        return <CalendarOutlined style={{ color: '#2A388F' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#f5222d' }} />;
      case 'system':
        return <InfoCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <BellOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const formatTime = (time: string) => {
    return dayjs(time).fromNow();
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const renderNotificationList = (notificationsList: any[]) => {
    if (loading) {
      return (
        <div className="notification-loading">
          <Spin />
        </div>
      );
    }
    
    if (notificationsList.length === 0) {
      return <Empty description="Không có thông báo" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    
    return (
      <List
        className="notification-list"
        itemLayout="horizontal"
        dataSource={notificationsList.slice(0, 5)}
        renderItem={(item) => (
          <List.Item
            className={`notification-item ${!item.isRead ? 'unread' : ''}`}
            onClick={() => handleNotificationClick(item)}
            actions={[
                <div style={{display: "grid"}}>
                  {!item.isRead ? (
                      <Tooltip title="Đánh dấu đã đọc">
                        <Button
                            type="text"
                            icon={<CheckOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.notificationId);
                            }}
                            className="notification-action-btn"
                        />
                      </Tooltip>
                  ) : null},
                  <Tooltip title="Xóa">
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item.notificationId);
                        }}
                        className="notification-action-btn"
                    />
                  </Tooltip>
                </div>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={getNotificationIcon(item.type)} 
                  style={{ backgroundColor: item.type.toLowerCase() === 'reminder' ? '#2A388F' : '#1890ff' }}
                />
              }

              title={
                <div className="notification-title">
                  {item.message}
                  {!item.isRead && <span className="unread-dot"></span>}
                </div>
              }

              description={
                <div className="notification-time">
                  <ClockCircleOutlined /> {formatTime(item.createdAt)}
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const content = (
    <div className="notification-dropdown-content">
      <div className="notification-header">
        <h3>Thông báo</h3>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        size="small"
        centered
      >
        <TabPane 
          tab={<span>Tất cả</span>} 
          key="all"
        >
          {renderNotificationList(notifications)}
        </TabPane>
        <TabPane 
          tab={<span>Nhắc lịch</span>} 
          key="reminders"
        >
          {renderNotificationList(reminderNotifications)}
        </TabPane>
        <TabPane 
          tab={<span>Khác</span>} 
          key="others"
        >
          {renderNotificationList(otherNotifications)}
        </TabPane>
      </Tabs>
      
      {notifications.length > 0 && (
        <div className="notification-footer">
          <Button 
            type="link" 
            className="view-all-btn"
            onClick={() => {
              setOpen(false);
              // Navigate to all notifications page if needed
              navigate('/notifications');
            }}
          >
            Xem tất cả <RightOutlined />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={content}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="notification-dropdown-overlay"
    >
      <Badge count={unreadCount} overflowCount={99} size="small">
        <Button 
          type="text" 
          icon={<IoIosNotifications size={24} />} 
          className="notification-btn"
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;