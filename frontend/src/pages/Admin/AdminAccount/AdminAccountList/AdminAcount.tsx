import React, {useEffect, useState} from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {Button, Input, Table, Tabs} from "antd";
import {useDeleteUser, useGetAllUser, useUpdateUserIsActive} from "../useAdminAccount.ts";
import {IoMdAdd} from "react-icons/io";
import "./AdminAccount.scss"
import {TbListDetails} from "react-icons/tb";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {AccountDetailResponse} from "../../../../interfaces/Account.ts";
import {useNavigate} from "react-router-dom";
import {ColumnsType} from "antd/es/table";

const { TabPane } = Tabs;

const AdminAccountPage: React.FC = () => {

    const {handleDelete} = useDeleteUser();
    const {handleUpdateIsActive} = useUpdateUserIsActive();
    const {users, loading, error, fetchAllUser} = useGetAllUser();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllUser()
    }, []);

    const [searchText, setSearchText] = useState("");
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    // Lọc dữ liệu trước khi truyền vào Table
    const filteredUsers = users.filter((user) =>
        Object.values(user).some(
            (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchText.trim().toLowerCase())
        )
    );

    const columns: ColumnsType<AccountDetailResponse> = [
        {
            title: "",
            key: "action-column",
            width: 50, // Đặt độ rộng cố định
            render: (_: undefined, record: AccountDetailResponse) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        transition: "opacity 0.1s ease-in-out",
                        opacity: hoveredRow === record.id ? 1 : 0
                    }}
                >
                    <Button
                        type="text"
                        danger
                        icon={<MdDeleteOutline style={{fontSize: "24px"}}/>}
                        onClick={() => handleDelete(record.id).then(() => fetchAllUser())}
                    />
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
            render: (_: undefined, record: AccountDetailResponse) => (
                <div className="account-action-buttons">
                    <Button onClick={() => openDetailPopup(record)} className="detail-button">
                        <TbListDetails/>Chi tiết
                    </Button>
                    <Button className="edit-button" onClick={() => navigate(`/admin/account/edit/${record.id}`)}>
                        <FiEdit2/>Chỉnh sửa
                    </Button>
                    <Button className={record.isActive ? "deactive-button" : "active-button"} onClick={() => {handleUpdateIsActive(record.isActive, record.id).then(() => fetchAllUser())}}>
                        <MdDeleteOutline/> {record.isActive ? "Deactive" : "Active"}
                    </Button>
                </div>
            ),
        },
    ];

    const [detailUser, setDetailUser] = useState<AccountDetailResponse | null>(null);

    const openDetailPopup = (user: AccountDetailResponse) => {
        setDetailUser(user);
    }

    const closeDetailPopup = () => {
        setDetailUser(null);
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

                    {detailUser && (
                        <div className="popupOverlay" onClick={closeDetailPopup}>
                            <div className="popup" style={{width: "800px"}} onClick={(e) => e.stopPropagation()}>
                                <button className="closeButton" onClick={closeDetailPopup}>×</button>
                                <h2 style={{fontWeight: "bold", fontSize: "18px", position: "absolute", top: "20px"}}>Chi tiết người dùng</h2>

                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Thông tin người dùng" key="1">
                                        <div className="vaccine-detail-mananger-popups">
                                            <div className="vaccine-detail-mananger-popups-left">
                                                <h3>{detailUser.userName}</h3>
                                                <p><strong style={{paddingRight: "2px"}} >Id:</strong> {detailUser.id}</p>
                                                <p><strong style={{paddingRight: "2px"}}>Tên đầy đủ:</strong> {detailUser.fullName}</p>
                                                <p><strong style={{paddingRight: "2px"}}>Email:</strong> {detailUser.email}</p>
                                                <p><strong style={{paddingRight: "4px"}}>Ngày sinh:</strong>
                                                    {new Date(detailUser.dateOfBirth).toLocaleDateString()}</p>
                                                <p><strong style={{paddingRight: "2px"}}>Số điện thoại:</strong> {detailUser.phoneNumber}</p>
                                                <p><strong style={{paddingRight: "2px"}}>Trạng thái:</strong>
                                                    {detailUser.isActive ? "Đang hoạt động." : "Dừng hoạt động"}</p>
                                            </div>

                                            <div className="vaccine-detail-mananger-popups-right">

                                                <p><strong style={{paddingRight: "2px"}}>Xác thực email:</strong>
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
                                                <p><strong style={{paddingRight: "2px"}}>Số lần nhập sai: </strong> {detailUser.accessFailedCount}
                                                </p>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Lịch Tiêm Chủng" key="2">
                                        <div className="vaccination-schedule-section">

                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    )}

                </div>
            </AdminLayout>
        </>
    );
};

export default AdminAccountPage;