import {Button, Descriptions, Input, List, Modal, Table, Tabs, Tag} from "antd";
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
import {ColumnsType} from "antd/es/table";
import {
    STATUS_COLORS,
    useVaccineRecordByBookingDetailId,
    useVaccineRecordByBookingId
} from "../../../Customer/BookingHistory/useBookingHistoryPage.ts";

const { TabPane } = Tabs;

const AdminBookingPage: React.FC = () => {

    const { bookings, loading, error, fetchAllBookings } = useGetAllBooking();
    const [searchText, setSearchText] = useState("");

    const {fetchVaccineRecordByBookingId } = useGetVaccineRecordByBookingId();

    const [bkDetailid, setBkDetailid] = useState<number>(0);
    const [vaccineRecordModal,setVaccineRecordModal] = useState<boolean>(false);

    // const [vaccineRecord, setVaccineRecord] = useState<boolean>(false);

    const {vaccineRecord} =  useVaccineRecordByBookingId(0)
    const {vaccineRecordByBookingDetailId} = useVaccineRecordByBookingDetailId(bkDetailid)
    const selectedRecord = vaccineRecord || vaccineRecordByBookingDetailId;

    const filteredBooking = bookings.filter((booking) =>
        Object.values(booking).some(
            (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchText.trim().toLowerCase())
        )
    );

    useEffect(() => {
        fetchAllBookings().then();
    }, []);

    const columns: ColumnsType<BookingResponse> = [
        {
            title: "ID",
            dataIndex: "bookingId",
            key: "bookingId",
            sorter: (a, b) => a.bookingId.toString().localeCompare(b.bookingId.toString()),
        },
        {
            title: "Id người dùng",
            dataIndex: "userId",
            key: "userId",
            render: (userId: string) => userId.length > 10 ? `${userId.slice(0, 15)}...` : userId,
            sorter: (a, b) => a.userId.localeCompare(b.userId)
        },
        {
            title: "Tên trẻ",
            dataIndex: "childName",
            key: "childName",
            render: (userName: string) => userName.length > 20 ? `${userName.slice(0, 20)}...` : userName,
            sorter: (a, b) => (a.childName ?? "").localeCompare(b.childName ?? "")
        },
        {
            title: "Loại booking",
            dataIndex: "bookingType",
            key: "bookingType",
            render: (email: string) => email.length > 20 ? `${email.slice(0, 20)}...` : email,
            sorter: (a, b) => a.bookingType.toString().localeCompare(b.bookingType.toString())
        },
        {
            title: "Ngày đặt",
            dataIndex: "bookingDate",
            key: "bookingDate",
            render: (date: any) => date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Chưa có dữ liệu",
            sorter: (a, b) => dayjs(a.bookingDate).valueOf() - dayjs(b.bookingDate).valueOf(),
        },
        {
            title: "Tổng chi phí",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice: string) => totalPrice.length > 20 ? `${totalPrice.slice(0, 20)}...` : totalPrice,
            sorter: (a, b) => a.totalPrice.toString().localeCompare(b.totalPrice.toString())
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
                    <Button onClick={() => openDetailPopup(record)} className="detail-button" style={{width: "138px"}}>
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
                    <Input
                        placeholder="🔍 Tìm kiếm..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ marginBottom: 16, width: 300 }}
                    />

                    {error && ("Lỗi tải danh sách user.")}
                    {loading && ("Loading...")}

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Tất cả" key="1">
                            {FilterTable(columns, filteredBooking)}
                        </TabPane>
                        <TabPane tab="Chờ thanh toán" key="2">
                            {FilterTable(columns, filteredBooking.filter(booking => booking.status === "Pending"))}
                        </TabPane>
                        <TabPane tab="Đã thanh toán" key="3">
                            {FilterTable(columns, filteredBooking.filter(booking => booking.status === "Confirmed"))}
                        </TabPane>
                        <TabPane tab="Đang tiến hành" key="4">
                            {FilterTable(columns, filteredBooking.filter(booking => booking.status === "InProgress"))}
                        </TabPane>
                        <TabPane tab="Đã hoàn tất" key="5">
                            {FilterTable(columns, filteredBooking.filter(booking => booking.status === "Completed"))}
                        </TabPane>
                        <TabPane tab="Hủy" key="6">
                            {FilterTable(columns, filteredBooking.filter(booking => booking.status === "Cancelled"))}
                        </TabPane>
                    </Tabs>

                    {detailBooking && (
                        <div className="popup-overlay" onClick={closeDetailPopup}>
                            <div className="popup" onClick={(e) => e.stopPropagation()}>
                                <button className="closeButton" onClick={closeDetailPopup}>×</button>
                                <h2 style={{fontWeight: "bold", fontSize: "18px", position: "absolute", top: "10px"}}>Thông tin lịch đặt</h2>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Thông tin người dùng" key="1">
                                        <div className="vaccination-schedule-section">
                                                <p><strong
                                                    style={{paddingRight: "2px", color: "#2a388f"}}>Id:</strong> {detailBooking.bookingId}
                                                </p>
                                                <p><strong style={{paddingRight: "2px", color: "#2a388f"}}>Id người dùng:
                                                </strong> {detailBooking.userId}</p>
                                                <p><strong style={{paddingRight: "2px", color: "#2a388f"}}>Id trẻ:
                                                </strong> {detailBooking.childId}</p>
                                                <p><strong style={{paddingRight: "2px", color: "#2a388f"}}>Loại booking:
                                                </strong> {detailBooking.bookingType}</p>
                                                <p><strong style={{paddingRight: "4px", color: "#2a388f"}}>Ngày đặt:</strong>
                                                    {new Date(detailBooking.bookingDate).toLocaleDateString()}</p>
                                                <p><strong style={{paddingRight: "2px", color: "#2a388f"}}>Tổng chi phí:
                                                </strong> {detailBooking.totalPrice}</p>

                                                <p><strong style={{paddingRight: "2px", color: "#2a388f"}}>Trạng thái:
                                                </strong>{detailBooking.status}</p>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Thông tin lich tiêm chủng" key="2">
                                        <div className="vaccination-schedule-section">
                                            <List
                                                dataSource={detailBooking.bookingDetails}
                                                renderItem={(detail) => (
                                                    <List.Item key={detail.bookingDetailId} className="booking-list-item">
                                                        <div className="booking-details">
                                                            <div>
                                                                <p>
                                                                    <span className="label">Mã đặt lịch chi tiết:</span>
                                                                    <span className="value">{detail.bookingDetailId}</span>
                                                                </p>
                                                                <p>
                                                                    <span className="label">Tên trẻ:</span>
                                                                    <span className="value">{detail.childName}</span>
                                                                </p>
                                                                <p>
                                                                    <span className="label">Loại đặt lịch:</span>
                                                                    <span className="value">
                                                                {detail.comboVaccineId && detail.comboVaccineName
                                                                    ? `Đặt ${detail.comboVaccineName}`
                                                                    : "Đặt lẻ Vaccine"}
                                                            </span>
                                                                </p>
                                                                <p>
                                                                    <span className="label">Tên Vaccine:</span>
                                                                    <span className="value">
                                                                {detail.vaccineName}
                                                            </span>
                                                                </p>
                                                                <p>
                                                                    <span className="label">Ngày tiêm:</span>
                                                                    <span
                                                                        className="value">{dayjs(detail.bookingDate).format("DD/MM/YYYY")}</span>
                                                                </p>
                                                                <p>
                                                                    <span className="label">Giá:</span>
                                                                    <span className="value">
                                                                {new Intl.NumberFormat("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND"
                                                                }).format(Number(detail.price))}
                                                            </span>
                                                                </p>
                                                                <p>
                                                                    <span className="label">Trạng thái:</span>
                                                                    <Tag
                                                                        color={STATUS_COLORS[detail.status]}>{detail.status}</Tag>

                                                                </p>

                                                                <div className="booking-actions">
                                                                    {detail.status === "Completed" && (
                                                                        <>
                                                                            <Button
                                                                                type="primary"
                                                                                className="vaccine-record-button"
                                                                                onClick={() => {
                                                                                    setBkDetailid(detail.bookingDetailId)
                                                                                    setVaccineRecordModal(true);
                                                                                    setDetailBooking(null);
                                                                                }}
                                                                            >
                                                                                Xem Vaccine Record
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                )
                                                }
                                            />
                                        </div>
                                    </TabPane>



                                </Tabs>
                            </div>
                        </div>
                    )}

                    <Modal
                        title="Chi Tiết Hồ Sơ Tiêm Chủng"
                        open={vaccineRecordModal}
                        onCancel={() => setVaccineRecordModal(false)}
                        footer={null}
                        width={1000}
                    >
                        {selectedRecord ? (
                            <>
                                <Descriptions title="Thông Tin Cá Nhân" bordered column={2}>
                                    <Descriptions.Item label="Mã Đặt Lịch">{selectedRecord.bookingId}</Descriptions.Item>
                                    <Descriptions.Item label="Họ Tên">{selectedRecord.fullName}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày Sinh">{selectedRecord.dateOfBirth}</Descriptions.Item>
                                    <Descriptions.Item label="Chiều Cao">{selectedRecord.height} cm</Descriptions.Item>
                                    <Descriptions.Item label="Cân Nặng">{selectedRecord.weight} kg</Descriptions.Item>
                                </Descriptions>

                                <h3 style={{marginTop: 16}}>Lịch Sử Tiêm Chủng</h3>
                                <Table
                                    dataSource={selectedRecord.vaccineRecords}
                                    rowKey="vaccinationRecordId"
                                    pagination={false}
                                    bordered
                                >
                                    <Table.Column title="Mã booking" dataIndex="vaccinationRecordId" key="id"/>
                                    <Table.Column title="Tên Vaccine" dataIndex="vaccineName" key="vaccineName"/>
                                    <Table.Column title="Liều Lượng (ml)" dataIndex="doseAmount" key="doseAmount"/>
                                    <Table.Column
                                        title="Giá (VNĐ)"
                                        dataIndex="price"
                                        key="price"
                                        render={(price) => new Intl.NumberFormat("vi-VN").format(price) + " VND"}
                                    />
                                    <Table.Column title="Ngày Tiêm Kế Tiếp" dataIndex="nextDoseDate" key="nextDoseDate"/>
                                    <Table.Column title="Lô Vaccine" dataIndex="batchNumber" key="batchNumber"/>
                                    <Table.Column title="Trạng Thái" dataIndex="status" key="status"/>
                                    <Table.Column title="Ghi Chú" dataIndex="notes" key="notes"/>
                                </Table>
                            </>
                        ) : (
                            <p>Không có dữ liệu</p>
                        )}
                    </Modal>

                </div>
            </AdminLayout>
        </>
    );
};

export default AdminBookingPage;

const FilterTable = (columns: ColumnsType<BookingResponse>, filteredBooking: BookingResponse[]) => {

    return (
        <>
            <Table
                columns={columns}
                dataSource={filteredBooking.map((booking => ({
                    ...booking,
                    id: booking.bookingId || Math.random(),
                    userId: booking.userId || "Chưa có dữ liệu",
                    childName: booking.childName || "Chưa có dữ liệu",
                    bookingType: booking.bookingType || "Chưa có dữ liệu",
                    bookingDate: booking.bookingDate || "Chưa có dữ liệu",
                    totalPrice: booking.totalPrice || Math.random(),
                    status: booking.status || "Chưa có dữ liệu"
                })))}
                rowKey="id"
                pagination={{pageSize: 8, showSizeChanger: false}}
                className="account-table"
            />
        </>
    );

}