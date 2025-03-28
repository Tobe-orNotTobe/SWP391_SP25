import React, {useEffect, useState} from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {Button, Form, Input, Select, Table, Tabs} from "antd";
import {
    useDeleteUser,
    useGetAllUser,
    useGetCurrentAdmin,
    useGetUserById,
    useUpdateUserIsActive
} from "../useAdminAccount.ts";
import {IoMdAdd} from "react-icons/io";
import "./AdminAccount.scss"
import {TbListDetails} from "react-icons/tb";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {AccountResponse, AccountDetailResponse} from "../../../../interfaces/Account.ts";
import {useNavigate} from "react-router-dom";
import {ColumnsType} from "antd/es/table";
import { IoMdNotificationsOutline } from "react-icons/io";
import {useSendNotification} from "../../../Customer/Notification/useNotification.ts";

const { TabPane } = Tabs;

const AdminAccountPage: React.FC = () => {

    const {handleDelete} = useDeleteUser();
    const {handleUpdateIsActive} = useUpdateUserIsActive();
    const {users, loading, error, fetchAllUser} = useGetAllUser();
    const {user, fetchUserById} = useGetUserById();
    const {handleSendNotification} = useSendNotification();
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const navigate = useNavigate();
    const {currentAdminId, getCurrentAdminId} = useGetCurrentAdmin();


    useEffect(() => {
        fetchAllUser().then(getCurrentAdminId);
    }, []);

    const [searchText, setSearchText] = useState("");

    // Lọc dữ liệu trước khi truyền vào Table
    const filteredUsers = users
        // .filter((user) => user.id !== currentAdminId)
        .filter((user) => Object.values(user).some(
            (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchText.trim().toLowerCase())
        )
    );

    const columns: ColumnsType<AccountResponse> = [
        {
            title: "",
            key: "action-column",
            width: 50, // Đặt độ rộng cố định
            render: (_: undefined, record: AccountResponse) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        transition: "opacity 0.1s ease-in-out",
                        opacity: hoveredRow === record.id ? 1 : 0
                    }}
                >
                    {record.id !== currentAdminId ? (
                        <Button
                            type="text"
                            danger
                            icon={<MdDeleteOutline style={{fontSize: "24px"}}/>}
                            onClick={() => handleDelete(record.id).then(() => fetchAllUser())}
                        />
                    ) : null}
                </div>
            ),
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: "Tên đầy đủ",
            dataIndex: "fullName",
            key: "fullName",
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
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
            dataIndex: "email",
            key: "email",
            render: (email) => (email.length > 20 ? `${email.slice(0, 20)}...` : email),
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
            render: (phoneNumber) => (phoneNumber.length > 20 ? `${phoneNumber.slice(0, 20)}...` : phoneNumber),
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            filters: [
                { text: "Đang hoạt động", value: true },
                { text: "Dừng hoạt động", value: false },
            ],
            onFilter: (value, record) => record.isActive === value,
            render: (status) => (
                <span className={`status-badge ${status ? "active" : "deactive"}`}>
          {status ? "Đang hoạt động" : "Dừng hoạt động"}
        </span>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: AccountResponse) => (
                <div className="account-action-buttons">
                    <Button onClick={() => openDetailPopup(record)} className="detail-button" style={{width: "138px"}}>
                        <TbListDetails/>Chi tiết
                    </Button>
                    <Button className="edit-button" onClick={() => navigate(`/admin/account/edit/${record.id}`)} style={{width: "138px"}}>
                        <FiEdit2/>Chỉnh sửa
                    </Button> <br/>
                    {record.roles[0] === "Customer" ? (
                        <Button className="send-notification-button"  onClick={() => openNotificationPopup(record)} style={{width: "138px"}}>
                            <IoMdNotificationsOutline/>Gửi thông báo
                        </Button>
                        ): null}
                    {record.id !== currentAdminId ? (
                        <Button className={record.isActive ? "deactive-button" : "active-button"} onClick={() => {handleUpdateIsActive(record.isActive, record.id).then(() => fetchAllUser())}} style={{width: "138px"}}>
                            <MdDeleteOutline/> {record.isActive ? "Deactive" : "Active"}
                        </Button>
                    ): null}
                </div>
            ),
        },
    ];

    const [detailUser, setDetailUser] = useState<AccountDetailResponse | null>(null);

    const [sendNotificationUser, setSendNotificationUser] = useState<AccountResponse | null>(null);

    const openDetailPopup = (selectedUser: AccountResponse) => {
        fetchUserById(selectedUser.id).then(() => {setDetailUser(user)})
    }

    const closeDetailPopup = () => {
        setDetailUser(null);
    }

    const openNotificationPopup = (selectedUser: AccountResponse) => {
        setSendNotificationUser(selectedUser);
    }

    const closeNotificationPopup = () => {
        setSendNotificationUser(null);
    }

    return (
        <>
            <AdminLayout>
                <div className="admin-account-page-container">
                    <div className="page-header">
                        <h1>Quản lý Account</h1>
                        <button className="addAccountButton" onClick={() => navigate("/admin/account/add")}>
                            <IoMdAdd/> Thêm tài khoản.
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
                            {FilterTable(columns, filteredUsers, setHoveredRow)}
                        </TabPane>
                        <TabPane tab="Người dùng" key="2">
                            {FilterTable(columns, filteredUsers.filter(user => user.roles[0] === "Customer"), setHoveredRow)}
                        </TabPane>
                        <TabPane tab="Nhân viên" key="3">
                            {FilterTable(columns, filteredUsers.filter(user => user.roles[0] === "Staff"), setHoveredRow)}
                        </TabPane>
                        <TabPane tab="Bác sĩ" key="4">
                            {FilterTable(columns, filteredUsers.filter(user => user.roles[0] === "Doctor"), setHoveredRow)}
                        </TabPane>
                        <TabPane tab="Quản lý" key="5">
                            {FilterTable(columns, filteredUsers.filter(user => user.roles[0] === "Manager"), setHoveredRow)}
                        </TabPane>
                        <TabPane tab="Admin" key="6">
                            {FilterTable(columns, filteredUsers.filter(user => user.roles[0] === "Admin"), setHoveredRow)}
                        </TabPane>
                    </Tabs>



                    {detailUser || sendNotificationUser ?  (
                        <div className="popupOverlay" onClick={detailUser ? closeDetailPopup : closeNotificationPopup}>
                            <div className="popup" style={{width: "800px"}} onClick={(e) => e.stopPropagation()}>
                                <button className="closeButton" onClick={detailUser ? closeDetailPopup : closeNotificationPopup}>×</button>
                                <h2 style={{fontWeight: "bold", fontSize: "18px", position: "absolute", top: "20px"}}>{detailUser ? "Chi tiết người dùng" : "Gửi thông báo"}</h2>

                                <Tabs defaultActiveKey="1">
                                    <TabPane tab={detailUser ? "Thông tin người dùng": "Tạo thông báo"} key="1">
                                        <div className="vaccine-detail-mananger-popups">
                                            {detailUser ? (
                                                <>
                                                    <div className="vaccine-detail-mananger-popups-left">
                                                        <h3>{detailUser.userName}</h3>
                                                        <p><strong
                                                            style={{paddingRight: "2px"}}>Id:</strong> {detailUser.id}
                                                        </p>
                                                        <p><strong style={{paddingRight: "2px"}}>Tên đầy
                                                            đủ:</strong> {detailUser.fullName}</p>
                                                        <p><strong
                                                            style={{paddingRight: "2px"}}>Email:</strong> {detailUser.email}
                                                        </p>
                                                        <p><strong style={{paddingRight: "4px"}}>Ngày sinh:</strong>
                                                            {new Date(detailUser.dateOfBirth).toLocaleDateString()}</p>
                                                        <p><strong style={{paddingRight: "2px"}}>Số điện
                                                            thoại:</strong> {detailUser.phoneNumber}</p>
                                                        <p><strong style={{paddingRight: "2px"}}>Trạng thái:</strong>
                                                            {detailUser.isActive ? "Đang hoạt động." : "Dừng hoạt động"}
                                                        </p>

                                                    </div>

                                                    <div className="vaccine-detail-mananger-popups-right">
                                                        <p><strong style={{paddingRight: "2px"}}>Xác thực
                                                            email:</strong>
                                                            {detailUser.emailConfirmed ? ("Dã xác thực") : ("Chưa xác thực")}
                                                        </p>
                                                        <p><strong style={{paddingRight: "2px"}}>Xác thực số điệm thoại:
                                                        </strong> {detailUser.phoneNumberConfirmed ? ("Dã xác thực") : ("Chưa xác thực")}
                                                        </p>
                                                        <p><strong style={{paddingRight: "2px"}}>Bảo mật hai yếu tố:
                                                        </strong> {detailUser.twoFactorEnabled ? ("Cho phép") : ("Không cho phép")}
                                                        </p>
                                                        <p><strong style={{paddingRight: "2px"}}>Khóa tài khoản:
                                                        </strong> {detailUser.lockoutEnabled ? ("Cho phép") : ("Không cho phép")}
                                                        </p>
                                                        <p><strong style={{paddingRight: "2px"}}>Số lần nhập
                                                            sai: </strong> {detailUser.accessFailedCount}
                                                        </p>

                                                    </div>
                                                </>
                                            ) : sendNotificationUser ? (
                                                <>
                                                    <Form
                                                        layout="vertical"
                                                        onFinish={(values) => handleSendNotification(sendNotificationUser.id, values.message, values.relatedEntityType).then(closeNotificationPopup)}

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
                                            ) : null}
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

export default AdminAccountPage;

const FilterTable = (columns: ColumnsType<AccountResponse>, filteredUsers: AccountResponse[], setHoveredRow: any) => {


    return (
        <>
            <Table
                columns={columns}
                dataSource={filteredUsers.map((user) => ({
                    ...user,
                    id: user.id || Math.random().toString(),
                    fullName: user.fullName || "Chưa có dữ liệu",
                    userName: user.userName || "Chưa có dữ liệu",
                    email: user.email || "Chưa có dữ liệu",
                    phoneNumber: user.phoneNumber || "Chưa có dữ liệu",
                    isActive: user.isActive ?? false,
                }))}
                rowKey="id"
                pagination={{ pageSize: 8, showSizeChanger: false }}
                className="account-table"
                onRow={(record) => ({
                    onMouseEnter: () => setHoveredRow(record.id),
                    onMouseLeave: () => setHoveredRow(null),
                })}
            />
        </>
    );

}