import {Button, Form, Input, Select, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {
    useDeleteAdminNotification,
    useGetAllAdminNotification,
    useSendNotificationToAllUser,
    useUpdateAdminNotification
} from "../../Customer/Notification/useNotification.ts";
import {ColumnsType} from "antd/es/table";
import {MdDeleteOutline} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import {FiEdit2} from "react-icons/fi";
import {IoMdAdd} from "react-icons/io";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {NotificationResponse} from "../../../interfaces/Notification.ts";

const { TabPane } = Tabs;

const AdminNotificationPage: React.FC = () => {

    const { handleDeleteNotifications } = useDeleteAdminNotification();
    const {handleUpdateNotifications } = useUpdateAdminNotification();
    const { notifications, loading, error, fetchAllNotifications } = useGetAllAdminNotification();
    const {handleSendNotificationToAllUser} = useSendNotificationToAllUser();
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    useEffect(() => {
        fetchAllNotifications().then();
    }, []);

    const [searchText, setSearchText] = useState("");

    const filteredNotifications: NotificationResponse[] = notifications
        .filter((notification) => Object.values(notification).some(
            (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchText.trim().toLowerCase())
        ));


    const columns: ColumnsType<NotificationResponse> = [
        {
            title: "",
            key: "action-column",
            width: 50, // Đặt độ rộng cố định
            render: (_: undefined, record: NotificationResponse) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        transition: "opacity 0.1s ease-in-out",
                        opacity: hoveredRow === record.notificationId ? 1 : 0
                    }}
                >
                    <Button
                        type="text"
                        danger
                        icon={<MdDeleteOutline style={{fontSize: "24px"}}/>}
                        onClick={() => handleDeleteNotifications(record.notificationId).then(() => fetchAllNotifications())}
                    />
                </div>
            ),
        },
        {
            title: "ID",
            dataIndex: "notificationId",
            key: "notificationId",
            sorter: (a, b) => a.notificationId.localeCompare(b.notificationId),
        },
        {
            title: "Id người dùng",
            dataIndex: "userId",
            key: "userId",
            sorter: (a, b) => a.userId.localeCompare(b.userId),
            render: (fullName) => (fullName.length > 10 ? `${fullName.slice(0, 15)}...` : fullName),
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "userName",
            key: "userName",
            sorter: (a, b) => a.userName.localeCompare(b.userName),
            render: (userName) => (userName.length > 20 ? `${userName.slice(0, 20)}...` : userName),
        },
        {
            title: "Email",
            dataIndex: "userEmail",
            key: "userEmail",
            render: (userEmail) => (userEmail.length > 20 ? `${userEmail.slice(0, 20)}...` : userEmail),
        },
        {
            title: "Nội dung",
            dataIndex: "message",
            key: "message",
            sorter: (a, b) => a.message.localeCompare(b.message),
            render: (phoneNumber) => (phoneNumber.length > 20 ? `${phoneNumber.slice(0, 20)}...` : phoneNumber),
        },
        {
            title: "Ngày gửi",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (phoneNumber) => (phoneNumber.length > 20 ? `${phoneNumber.slice(0, 20)}...` : phoneNumber),
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            sorter: (a, b) => a.type.localeCompare(b.type),
            render: (phoneNumber) => (phoneNumber.length > 20 ? `${phoneNumber.slice(0, 20)}...` : phoneNumber),
        },
        {
            title: "Trạng thái",
            dataIndex: "isRead",
            key: "isRead",
            filters: [
                { text: "Đã xem", value: true },
                { text: "Chưa xem", value: false },
            ],
            onFilter: (value, record) => record.isRead === value,
            render: (status) => (
                <span className={`status-badge ${status ? "active" : "deactive"}`}>
          {status ? "Đã xem" : "Chưa xem"}
        </span>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: NotificationResponse) => (
                <div className="account-action-buttons">
                    <Button onClick={() => openDetailPopup(record)} className="detail-button" style={{width: "138px"}}>
                        <TbListDetails/>Chi tiết
                    </Button>
                    <Button className="edit-button" onClick={() => openEditNotificationPopup(record)} style={{width: "138px"}}>
                        <FiEdit2/>Chỉnh sửa
                    </Button> <br/>
                </div>
            ),
        },
    ];

    const [detailNotification, setDetailNotification] = useState<NotificationResponse | null>(null);

    const [editNotificationUser, setEditNotificationUser] = useState<NotificationResponse | null>(null);

    const [sendNotificationAllUser, setSendNotificationAllUser] = useState<true | false>(false);


    const openDetailPopup = (notification: NotificationResponse) => {
        setDetailNotification(notification)
    }

    const closeDetailPopup = () => {
        setDetailNotification(null);
    }

    const openEditNotificationPopup = (notification: NotificationResponse) => {
        setEditNotificationUser(notification);
    }

    const closeEditNotificationPopup = () => {
        setEditNotificationUser(null);
    }


    return (
        <>
            <AdminLayout>
                <div className="admin-account-page-container">
                    <div className="page-header">
                        <h1>Quản lý Notification</h1>
                        <button className="addAccountButton" onClick={() => setSendNotificationAllUser(true)}>
                            <IoMdAdd/> Gửi thông báo tới tất cả.
                        </button>
                    </div>
                    {error && ("Lỗi tải danh sách user.")}
                    {loading && ("Loading...")}
                    <Input
                        placeholder="🔍 Tìm kiếm..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ marginBottom: 16, width: 300 }}
                    />

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Tất cả" key="1">
                            {FilterTable(columns, filteredNotifications, setHoveredRow)}
                        </TabPane>
                        <TabPane tab="Đã xem" key="2">
                            {FilterTable(columns, filteredNotifications.filter(notification => notification.isRead), setHoveredRow)}
                        </TabPane>
                        <TabPane tab="Chưa xem" key="3">
                            {FilterTable(columns, filteredNotifications.filter(notification => !notification.isRead), setHoveredRow)}
                        </TabPane>

                    </Tabs>

                    {detailNotification || editNotificationUser || sendNotificationAllUser ?  (
                        <div className="popupOverlay" onClick={detailNotification ? closeDetailPopup : closeEditNotificationPopup}>
                            <div className="popup" style={{width: "800px"}} onClick={(e) => e.stopPropagation()}>
                                <button className="closeButton" onClick={detailNotification ? closeDetailPopup : closeEditNotificationPopup}>×</button>
                                <h2 style={{fontWeight: "bold", fontSize: "18px", position: "absolute", top: "20px"}}>{detailNotification ? "Chi tiết thông báo" : "Chỉnh sửa thông báo"}</h2>

                                <Tabs defaultActiveKey="1">
                                    <TabPane tab={detailNotification ? "Thông tin chi tiết": "Sửa thông báo"} key="1">
                                        <div className="vaccine-detail-mananger-popups">
                                            {detailNotification ? (
                                                <>
                                                    <div className="vaccine-detail-mananger-popups-left">
                                                        <h3>{detailNotification.userName}</h3>
                                                        <p><strong
                                                            style={{paddingRight: "2px"}}>Id:</strong> {detailNotification.notificationId}
                                                        </p>
                                                        <p><strong style={{paddingRight: "2px"}}>Id người dùng:</strong> {detailNotification.userId}</p>
                                                        <p><strong
                                                            style={{paddingRight: "2px"}}>Email:</strong> {detailNotification.userEmail}
                                                        </p>
                                                        <p><strong style={{paddingRight: "4px"}}>Ngày gửi:</strong>
                                                            {new Date(detailNotification.createdAt).toLocaleDateString()}</p>
                                                        <p><strong style={{paddingRight: "2px"}}>Loại:
                                                        </strong> {detailNotification.type}</p>
                                                        <p><strong style={{paddingRight: "2px"}}>Trạng thái:</strong>
                                                            {detailNotification.isRead ? "Đã xem" : "Chưa xem"}
                                                        </p>

                                                    </div>

                                                    <div className="vaccine-detail-mananger-popups-right">
                                                        <p><strong style={{paddingRight: "2px"}}>Nội dung:</strong>
                                                            {detailNotification.message}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : editNotificationUser ? (
                                                <>
                                                    <Form
                                                        layout="vertical"
                                                        onFinish={(values) => handleUpdateNotifications(editNotificationUser?.notificationId, values.message, values.relatedEntityType).then(() => {
                                                            closeEditNotificationPopup()
                                                            fetchAllNotifications()
                                                        })}

                                                    >
                                                        <Form.Item
                                                            name="message"
                                                            label="Thông báo:"
                                                            rules={[{ required: true, message: "Vui lòng nhập thông báo." }]}
                                                        >
                                                            <Input.TextArea placeholder="Nhập nội dung thông báo..." rows={4} />
                                                        </Form.Item>

                                                        <Form.Item
                                                            name="relatedEntityType"
                                                            label="Loại thông báo:"
                                                            initialValue="Booking" // Thêm dòng này để form luôn có giá trị mặc định
                                                        >
                                                            <Select placeholder="Chọn loại thông báo">
                                                                <Select.Option value="Booking">Nhắc lịch</Select.Option>
                                                                <Select.Option value="Reminder">Nhắc nhở</Select.Option>
                                                            </Select>
                                                        </Form.Item>

                                                        {/* Nút gửi thông báo */}
                                                        <Form.Item>
                                                            <Button type="primary" htmlType="submit">
                                                                Gửi thông báo
                                                            </Button>
                                                        </Form.Item>
                                                    </Form>

                                                </>
                                            ) : sendNotificationAllUser ? (
                                                <>
                                                    <Form
                                                        layout="vertical"
                                                        onFinish={(values) => handleSendNotificationToAllUser(values.message).then(() => {
                                                            setSendNotificationAllUser(false);
                                                            fetchAllNotifications();
                                                        })}

                                                    >
                                                        <Form.Item
                                                            name="message"
                                                            label="Thông báo:"
                                                            rules={[{ required: true, message: "Vui lòng nhập thông báo." }]}
                                                        >
                                                            <Input.TextArea placeholder="Nhập nội dung thông báo..." rows={4} />
                                                        </Form.Item>

                                                        <Form.Item>
                                                            <Button type="primary" htmlType="submit">
                                                                Gửi thông báo
                                                            </Button>
                                                        </Form.Item>
                                                    </Form>
                                                </>
                                            ) :null}
                                        </div>
                                    </TabPane>
                                    {/*<TabPane tab="Lịch Tiêm Chủng" key="2">*/}
                                    {/*    <div className="vaccination-schedule-section">*/}

                                    {/*    </div>*/}
                                    {/*</TabPane>*/}
                                </Tabs>
                            </div>
                        </div>
                    ) : null}

                </div>
            </AdminLayout>
        </>
    );
};

export default AdminNotificationPage;

const FilterTable = (columns: ColumnsType<NotificationResponse>, filteredNotifications: NotificationResponse[], setHoveredRow: any) => {


    return (
        <>
            <Table
                columns={columns}
                dataSource={filteredNotifications.map((notification) => ({
                    ...notification,
                    id: notification.notificationId || Math.random().toString(),
                    userId: notification.userId || "Chưa có dữ liệu",
                    userName: notification.userName || "Chưa có dữ liệu",
                    userEmail: notification.userEmail || "Chưa có dữ liệu",
                    message: notification.message || "Chưa có dữ liệu",
                    createdAt: notification.createdAt || "Chưa có dữ liệu",
                    type: notification.type || "Chưa có dữ liệu",
                    isRead: notification.isRead ?? false,
                }))}
                rowKey="id"
                pagination={{ pageSize: 8, showSizeChanger: false }}
                className="account-table"
                onRow={(record) => ({
                    onMouseEnter: () => setHoveredRow(record.notificationId),
                    onMouseLeave: () => setHoveredRow(null),
                })}
            />
        </>
    );

}