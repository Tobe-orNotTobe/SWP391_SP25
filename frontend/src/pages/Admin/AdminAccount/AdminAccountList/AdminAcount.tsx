import React, {useState} from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {Button, Table, Tabs} from "antd";
import {useDeleteUser, useGetAllUser} from "../useAdminAccount.ts";
import {IoMdAdd} from "react-icons/io";
import "./AdminAccount.scss"
import {TbListDetails} from "react-icons/tb";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {AccountDetailResponse} from "../../../../interfaces/Account.ts";
import {useNavigate} from "react-router-dom";

const { TabPane } = Tabs;

const AdminAccountPage: React.FC = () => {

    const {handleDelete} = useDeleteUser();
    const {users, loading, error, fetchAllUser} = useGetAllUser();

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Tên đầy đủ",
            dataIndex: "fullName",
            key: "fullName",
            render: (fullName: string) => fullName.length > 10 ? `${fullName.slice(0, 15)}...` : fullName
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "userName",
            key: "userName",
            render: (userName: string) => userName.length > 20 ? `${userName.slice(0, 20)}...` : userName
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email: string) => email.length > 20 ? `${email.slice(0, 20)}...` : email
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render: (phoneNumber: string) => phoneNumber.length > 20 ? `${phoneNumber.slice(0, 20)}...` : phoneNumber
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            render: (status: boolean) => (
                <span className={`status-badge ${status ? 'active' : 'deactive'}`}>
                    {status ? "Đang hoạt động" : "Dừng hoạt động"}
                </span>
            )
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: AccountDetailResponse) => (
                <div className="vaccine-action-buttons">
                    <Button onClick={() => openDetailPopup(record)} className="detail-button">
                        <TbListDetails/>Chi tiết
                    </Button>
                    <Button className="edit-button" onClick={() => navigate(`/admin/account/edit/${record.id}`)}>
                        <FiEdit2/>Chỉnh sửa
                    </Button>
                    <Button className="delete-button" onClick={() => {handleDelete(record.id).then(() => fetchAllUser())}}>
                        <MdDeleteOutline/> Xóa
                    </Button>
                </div>
            ),
        },
    ];

    const [detailUser, setDetailUser] = useState<AccountDetailResponse | null>(null);
    const navigate = useNavigate();

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
                    <Table
                        columns={columns}
                        dataSource={Array.isArray(users) ? users.map(user => ({
                            ...user,
                            id: user.id || Math.random().toString(), // Đảm bảo có `id`
                            fullName: user.fullName || "Chưa có dữ liệu",
                            userName: user.userName || "Chưa có dữ liệu",
                            email: user.email || "Chưa có dữ liệu",
                            phoneNumber: user.phoneNumber || "Chưa có dữ liệu",
                            isActive: user.isActive ?? false // Mặc định là `false`
                        })) : []}
                        rowKey="id"
                        pagination={{pageSize: 8, showSizeChanger: false}}
                        className="account-table"
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