import {Button, Descriptions, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {TbListDetails} from "react-icons/tb";
// import {FiEdit2} from "react-icons/fi";
// import {useNavigate} from "react-router-dom";
import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";
// import {IoMdAdd} from "react-icons/io";
import {useGetAllBooking, useGetVaccineRecordByBookingId} from "../useAdminBooking.ts";
import {BookingResponse} from "../../../../interfaces/Booking.ts";
import dayjs from "dayjs";
import "../AdminBooking.scss"

const { TabPane } = Tabs;

const AdminBookingPage: React.FC = () => {

    const { bookings, loading, error, fetchAllBookings } = useGetAllBooking();
    const { vaccineRecord, fetchVaccineRecordByBookingId } = useGetVaccineRecordByBookingId();

    useEffect(() => {
        fetchAllBookings().then();
    }, []);

    const columns = [
        { title: "ID", dataIndex: "bookingId", key: "bookingId" },
        {
            title: "Id người dùng",
            dataIndex: "userId",
            key: "userId",
            render: (userId: string) => userId.length > 10 ? `${userId.slice(0, 15)}...` : userId
        },
        {
            title: "Tên trẻ",
            dataIndex: "childName",
            key: "childName",
            render: (userName: string) => userName.length > 20 ? `${userName.slice(0, 20)}...` : userName
        },
        {
            title: "Loại booking",
            dataIndex: "bookingType",
            key: "bookingType",
            render: (email: string) => email.length > 20 ? `${email.slice(0, 20)}...` : email
        },
        {
            title: "Ngày đặt",
            dataIndex: "bookingDate",
            key: "bookingDate",
            render: (date: any) => date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Chưa có dữ liệu"
        },
        {
            title: "Tổng chi phí",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice: string) => totalPrice.length > 20 ? `${totalPrice.slice(0, 20)}...` : totalPrice
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let backgroundColor = "";
                switch (status) {
                    case "Pending":
                        backgroundColor = "#faad14";
                        break;
                    case "Confirmed":
                        backgroundColor = "#2a388f";
                        break;
                    case "InProgress":
                        backgroundColor = "#42A5F5";
                        break;
                    case "Completed":
                        backgroundColor = "#52c41a";
                        break;
                    case "Cancelled":
                        backgroundColor = "#ff4d4f";
                        break;
                    default:
                        backgroundColor = "#FD7E14";
                }
                return <button style={{ backgroundColor, fontWeight: "bold", border: "none", color: "white", padding: "4px", borderRadius: "5px" }}>{status}</button>;
            }
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: BookingResponse) => (
                <div className="account-action-buttons">
                    <Button onClick={() => openDetailPopup(record)} className="detail-button">
                        <TbListDetails/>Chi tiết
                    </Button>
                </div>
            ),
        },
    ];

    const [detailBooking, setDetailBooking] = useState<BookingResponse | null>(null);
    // const navigate = useNavigate();
    useEffect(() => {
        if (detailBooking) {
            fetchVaccineRecordByBookingId(detailBooking?.bookingId).then();
        }
    }, [detailBooking]);

    const openDetailPopup = (booking: BookingResponse) => {
        setDetailBooking(booking);
    }

    const closeDetailPopup = () => {
        setDetailBooking(null);
    }

    return (
        <>
            <AdminLayout>
                <div className="admin-account-page-container">
                    <div className="page-header">
                        <h1>Quản lý Lịch tiêm</h1>
                        {/*<button className="addAccountButton" onClick={() => navigate("/admin/booking/add")}>*/}
                        {/*    <IoMdAdd/> Thêm lịch tiêm*/}
                        {/*</button>*/}
                    </div>
                    {error && ("Lỗi tải danh sách user.")}
                    {loading && ("Loading...")}
                    <Table
                        columns={columns}
                        dataSource={Array.isArray(bookings) ? bookings.map(booking => ({
                            ...booking,
                            id: booking.bookingId || Math.random(),
                            userId: booking.userId || "Chưa có dữ liệu",
                            childName: booking.childName || "Chưa có dữ liệu",
                            bookingType: booking.bookingType || "Chưa có dữ liệu",
                            bookingDate: booking.bookingDate || "Chưa có dữ liệu",
                            totalPrice: booking.totalPrice || Math.random(),
                            status: booking.status || "Chưa có dữ liệu"
                        })) : []}
                        rowKey="id"
                        pagination={{pageSize: 8, showSizeChanger: false}}
                        className="account-table"
                    />

                    {detailBooking && (
                        <div className="popup-overlay" onClick={closeDetailPopup}>
                            <div className="popup" style={{width: "fit-content"}} onClick={(e) => e.stopPropagation()}>
                                <button className="closeButton" onClick={closeDetailPopup}>×</button>
                                <h2 style={{fontWeight: "bold", fontSize: "18px", position: "absolute", top: "20px"}}>Chi tiết người dùng</h2>

                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Thông tin người dùng" key="1">
                                        <div className="vaccine-detail-mananger-popups">
                                            <div className="vaccine-detail-mananger-popups-left">
                                                <p><strong
                                                    style={{paddingRight: "2px"}}>Id:</strong> {detailBooking.bookingId}
                                                </p>
                                                <p><strong style={{paddingRight: "2px"}}>Id người dùng:
                                                </strong> {detailBooking.userId}</p>
                                                <p><strong style={{paddingRight: "2px"}}>Id trẻ:
                                                </strong> {detailBooking.childId}</p>
                                                <p><strong style={{paddingRight: "2px"}}>Loại booking:
                                                </strong> {detailBooking.bookingType}</p>

                                            </div>

                                            <div className="vaccine-detail-mananger-popups-right">
                                                <p><strong style={{paddingRight: "4px"}}>Ngày đặt:</strong>
                                                    {new Date(detailBooking.bookingDate).toLocaleDateString()}</p>
                                                <p><strong style={{paddingRight: "2px"}}>Tổng chi phí:
                                                </strong> {detailBooking.totalPrice}</p>

                                                <p><strong style={{paddingRight: "2px"}}>Trạng thái:
                                                </strong>{detailBooking.status}</p>
                                            </div>
                                        </div>
                                    </TabPane>
                                    {detailBooking.status === "Completed" && (
                                        <TabPane tab="Lịch sử tiêm chủng" key="2">
                                            <div className="vaccination-schedule-section">
                                                {vaccineRecord ? (
                                                    <>
                                                        <Descriptions title="Thông Tin Cá Nhân" bordered column={2}>
                                                            <Descriptions.Item label="Mã Đặt Lịch">{vaccineRecord.bookingId}</Descriptions.Item>
                                                            <Descriptions.Item label="Họ Tên">{vaccineRecord.fullName}</Descriptions.Item>
                                                            <Descriptions.Item label="Ngày Sinh">{vaccineRecord.dateOfBirth}</Descriptions.Item>
                                                            <Descriptions.Item label="Chiều Cao">{vaccineRecord.height} cm</Descriptions.Item>
                                                            <Descriptions.Item label="Cân Nặng">{vaccineRecord.weight} kg</Descriptions.Item>
                                                        </Descriptions>

                                                        <h3 style={{ marginTop: 16 }}>Lịch Sử Tiêm Chủng</h3>
                                                        <Table
                                                            dataSource={vaccineRecord.vaccineRecords}
                                                            rowKey="vaccinationRecordId"
                                                            pagination={false}
                                                            bordered
                                                        >
                                                            <Table.Column title="Mã booking" dataIndex="vaccinationRecordId" key="id" />
                                                            <Table.Column title="Tên Vaccine" dataIndex="vaccineName" key="vaccineName" />
                                                            <Table.Column title="Liều Lượng (ml)" dataIndex="doseAmount" key="doseAmount" />
                                                            <Table.Column
                                                                title="Giá (VNĐ)"
                                                                dataIndex="price"
                                                                key="price"
                                                                render={(price) => new Intl.NumberFormat("vi-VN").format(price) + " VND"}
                                                            />
                                                            <Table.Column title="Ngày Tiêm Kế Tiếp" dataIndex="nextDoseDate" key="nextDoseDate" />
                                                            <Table.Column title="Lô Vaccine" dataIndex="batchNumber" key="batchNumber" />
                                                            <Table.Column title="Trạng Thái" dataIndex="status" key="status" />
                                                            <Table.Column title="Ghi Chú" dataIndex="notes" key="notes" />
                                                        </Table>
                                                    </>
                                                ) : (
                                                    <p>Không có dữ liệu</p>
                                                )}
                                            </div>
                                        </TabPane>
                                    )}

                                </Tabs>
                            </div>
                        </div>
                    )}

                </div>
            </AdminLayout>
        </>
    );
};

export default AdminBookingPage;