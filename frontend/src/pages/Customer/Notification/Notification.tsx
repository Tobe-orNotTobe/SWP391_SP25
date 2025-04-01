import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Tabs, List, Spin, Input, Avatar, Tooltip, Button} from "antd";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import {useDeleteNotification, useGetAllNotification, useMarkAsRead} from "./useNotification.ts";
import "./Notification.scss";
import {NotificationType} from "../../../interfaces/Notification.ts";
import {
    BellOutlined,
    CalendarOutlined, CheckOutlined,
    ClockCircleOutlined, DeleteOutlined,
    InfoCircleOutlined,
    WarningOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {useNotificationHook} from "../../../hooks/useNotificationHook.ts";

const { TabPane } = Tabs;
const { Search } = Input;

const NotificationPage: React.FC = () => {
    const { notifications, loading, error, fetchAllNotification } = useGetAllNotification();
    const [filtering, setFiltering] = useState<string>("");
    const {
        handleNotificationClick,
    } = useNotificationHook();

    const {handleMarkAsRead} = useMarkAsRead();
    const {handleDeleteNotification} = useDeleteNotification()

    useEffect(() => {
        fetchAllNotification();
    }, []);

    // Lọc thông báo theo tab
    const filteredNotifications = notifications.filter(n => n.message.toLowerCase().includes(filtering.toLowerCase()));
    const reminderNotifications = filteredNotifications.filter(n => n.type !== "System");
    const otherNotifications = filteredNotifications.filter(n => n.type === "System");

    const notificationList = (notifications: NotificationType[]) => {
        return (
            <List
                bordered
                dataSource={notifications}
                renderItem={item =>
                    <List.Item
                        onClick={() => handleNotificationClick(item).then(fetchAllNotification)}
                        actions={[
                            <div style={{display: "grid"}}>
                                {!item.isRead ? (
                                    <Tooltip title="Đánh dấu đã đọc">
                                        <Button
                                            type="text"
                                            icon={<CheckOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(item.notificationId).then(fetchAllNotification);
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
                                            handleDeleteNotification(item.notificationId).then(fetchAllNotification);
                                        }}
                                        className="notification-action-btn"
                                    />
                                </Tooltip>
                            </div>
                        ]}

                        className={item.isRead ? "read-row" : "unread-row"}>{notificationItem(item)}</List.Item>}
            />
        );
    }

    return (
        <>
            <CustomerNavbar />
            <div className="notificationContainer">
                <span>
                    <Link to="/homepage" style={{ textDecoration: "none", color: "#2A388F" }}>Trang chủ</Link>
                    <span className="separator"> » </span>
                    <span className="last">Thông báo</span>
                </span>

                <div className="introductionTitle">
                    <h1 className="gt-title">Thông báo</h1>
                </div>

                {loading && <Spin size="large" />}
                {error && <p style={{ color: "red" }}>Đã xảy ra lỗi tải thông báo</p>}

                {/* Ô tìm kiếm */}
                <Search
                    placeholder="Tìm kiếm thông báo..."
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                    style={{ width: 300, marginBottom: "20px" }}
                />

                {/* Tabs hiển thị danh sách */}
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Tất cả" key="1">
                        {notificationList(filteredNotifications)}
                    </TabPane>
                    <TabPane tab="Nhắc lịch" key="2">
                        {notificationList(reminderNotifications)}
                    </TabPane>
                    <TabPane tab="Khác" key="3">
                        {notificationList(otherNotifications)}
                    </TabPane>
                </Tabs>
            </div>
            <FloatingButtons />
            <Footer />
        </>
    );
};

const notificationItem = (notification: NotificationType) => {

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

    return (
        <>
            <div style={{display: "flex"}}>
                <List.Item.Meta
                    avatar={
                        <Avatar
                            icon={getNotificationIcon(notification.type)}
                            style={{ backgroundColor: notification.type.toLowerCase() === 'reminder' ? '#2A388F' : '#1890ff' }}
                        />
                    }

                    title={
                        <div className="notification-title">
                            {notification.message}
                            {!notification.isRead && <span className="unread-dot"></span>}
                        </div>
                    }

                    description={
                        <div className="notification-time">
                            <ClockCircleOutlined /> {formatTime(notification.createdAt)}
                        </div>
                    }
                />



            </div>

        </>
    );
}

export default NotificationPage;