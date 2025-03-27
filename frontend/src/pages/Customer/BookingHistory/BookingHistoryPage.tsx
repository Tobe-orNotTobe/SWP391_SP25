import React, {useState} from "react";
import {
    Calendar,
    Modal,
    List,
    Button,
    Tag,
    Form,
    Input,
    Rate,
    Tabs,
    Popconfirm,
    Flex,
    Descriptions,
    Table,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
    useBookingUser,
    STATUS_COLORS,
    useVaccineRecordByBookingId,
    useVaccineRecordByBookingDetailId
} from "./useBookingHistoryPage.ts";
import {useBookingHistoryPage} from "./useBookingHistoryPage.ts";
import "./BookingHistory.scss";
import { SelectInfo } from "antd/lib/calendar/generateCalendar";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import { Link } from "react-router-dom";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {BookingDetailResponse, BookingUser} from "../../../interfaces/VaccineRegistration.ts";

const { Search } = Input;

const BookingHistory: React.FC = () => {
    const { bookings } = useBookingUser();

    const [searchText, setSearchText] = useState<string>("");

    const handleSearch = (value  : any) => {
        setSearchText(value.toLowerCase());
    };

    const filteredBookings = bookings.filter((item) =>
        item.childName.toLowerCase().includes(searchText) ||
        item.bookingType.toLowerCase().includes(searchText) ||
        item.status.toLowerCase().includes(searchText) ||
        item.totalPrice.toString().includes(searchText)
    );

    // console.log(bookings);
    const [bkid, setBkId] = useState<number>(0);
    const [bkDetailid, setBkDetailid] = useState<number>(0);


    const [vaccineRecordModal,setVaccineRecordModal] = useState<boolean>(false);

    const {vaccineRecord} =  useVaccineRecordByBookingId(bkid)

    const {vaccineRecordByBookingDetailId} = useVaccineRecordByBookingDetailId(bkDetailid)

    // console.log(vaccineRecordByBookingDetailId)

    const selectedRecord = vaccineRecord || vaccineRecordByBookingDetailId;

    const {
        // State
        selectedDate,
        setSelectedDate,
        visible,
        setVisible,
        feedbackModalVisible,
        setFeedbackModalVisible,
        selectedBooking,
        setSelectedBooking,
        calendarValue,
        setCalendarValue,
        comment,
        setComment,
        rating,
        setRating,
        isEditMode,
        feedbackBookingId,
        reason,
        setReason,
        refundModalVisible,

        // Derived data
        bookingMap,
        // Actions
        handleCancelBooking,
        handleSubmitFeedback,
        handleDeleteFeedback,
        openFeedbackModal,
        handleTransactionPendingStatus,
        handleRefundRequest,
        closeRefundModal,
        openRefundModal,

    } = useBookingHistoryPage(bookings);

    const handleSelectDate = (date: Dayjs, selectInfo: SelectInfo) => {
        if (selectInfo.source === "date" && bookingMap[date.format("YYYY-MM-DD")]) {
            const selectedBooking = bookingMap[date.format("YYYY-MM-DD")][0]; // Select first booking of the day
            if (selectedBooking) {
                setSelectedBooking(selectedBooking);
                setSelectedDate(date);
                setVisible(true);
            } else {
                setVisible(false);
            }
        } else {
            setVisible(false);
        }
    };

    const dateCellRender = (value: Dayjs) => {
        const bookingsOnDay = bookingMap[value.format("YYYY-MM-DD")]; // Lấy danh sách bookingDetail theo ngày
        if (!bookingsOnDay || bookingsOnDay.length === 0) return null;

        return (
            <div
                className="booking-cell"
                style={{
                    backgroundColor: STATUS_COLORS[bookingsOnDay[0].status] || "#f0f0f0",
                    color: "white",
                    borderRadius: "4px",
                    textAlign: "center",
                    padding: "5px",
                }}
            >
                {bookingsOnDay.length} đơn
            </div>
        );
    };

    const monthCellRender = (value: Dayjs) => {
        const monthKey = value.format("YYYY-MM");
        const bookingDetailsInMonth = Object.values(bookingMap)
            .flat()
            .filter((detail) => dayjs(detail.bookingDate).format("YYYY-MM") === monthKey); // Lọc bookingDetail theo tháng

        if (bookingDetailsInMonth.length === 0) return null;

        // Đếm số lượng booking theo trạng thái trong tháng
        const statusCount = bookingDetailsInMonth.reduce((acc, detail) => {
            acc[detail.status] = (acc[detail.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return (
            <div className="month-summary" style={{ padding: "5px" }}>
                {Object.entries(statusCount).map(([status, count]) => (
                    <div
                        key={status}
                        style={{
                            backgroundColor: STATUS_COLORS[status] || "#f0f0f0",
                            color: "white",
                            borderRadius: "4px",
                            textAlign: "center",
                            padding: "2px",
                            marginBottom: "2px",
                            fontSize: "12px",
                            fontWeight: "bold",
                        }}
                    >
                        Có {status}: {count} đơn
                    </div>
                ))}
            </div>
        );
    };

    const StatusLegend = () => (
        <Flex gap="small" align="center">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Tag color={color} key={status}>{status}</Tag>
            ))}
        </Flex>
    );

    const columns = [
        {
            title: "Mã Lịch Tiêm",
            dataIndex: "bookingId",
            key: "bookingId",
            sorter: (a : BookingUser, b: BookingUser) => a.bookingId - b.bookingId,
        },
        {
            title: "Tên Trẻ",
            dataIndex: "childName",
            key: "childName",
        },
        {
            title: "Loại Lịch Tiêm",
            dataIndex: "bookingType",
            key: "bookingType",
            filters: [
                { text: "Combo Vaccine", value: "comboVaccine" },
                { text: "Single Vaccine", value: "singleVaccine" },
            ],
            onFilter: (value: string, record: BookingUser) => record.bookingType === value,
        },
        {
            title: "Ngày Đặt Lịch",
            dataIndex: "bookingDate",
            key: "bookingDate",
            sorter: (a: BookingUser, b: BookingUser) =>
                new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
            filters: [
                { text: "Hôm nay", value: "today" },
                { text: "Tuần này", value: "thisWeek" },
                { text: "Tháng này", value: "thisMonth" },
            ],
            onFilter: (value: string, record: BookingUser) => {
                const today = new Date();
                const bookingDate = new Date(record.bookingDate);
                if (value === "today") {
                    return bookingDate.toDateString() === today.toDateString();
                }
                if (value === "thisWeek") {
                    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    return bookingDate >= startOfWeek;
                }
                if (value === "thisMonth") {
                    return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
                }
            },
            render: (bookingDate: string) => new Date(bookingDate).toLocaleDateString("vi-VN"),
        },
        {
            title: "Tổng Giá",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice : number) => `${totalPrice.toLocaleString()} VND`,
            sorter: (a : BookingUser, b: BookingUser) => a.totalPrice - b.totalPrice,
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Pending", value: "Pending" },
                { text: "Confirmed", value: "Confirmed" },
                { text: "InProgress", value: "InProgress" },
                { text: "Completed", value: "Completed" },
                { text: "Cancelled", value: "Cancelled" },
                { text: "RefundRequest", value: "RefundRequest" },
            ],
            onFilter: (value : string, record : BookingUser) => record.status === value,
            render: (status : string) => <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>,
        },
        {
            title: "Hành Động",
            key: "action",
            render: (_ : undefined, record : BookingUser) => (
                <div className="booking-actions">
                    {record.status === "Pending" && (
                        <>
                            <Button type="primary" onClick={() => handleTransactionPendingStatus(record.bookingId)}  className="Pending-Button">
                                Thanh Toán
                            </Button>
                            <Button onClick={() => handleCancelBooking(record.bookingId)}  className="Cancel-button">
                                Hủy Lịch
                            </Button>
                        </>
                    )}
                    {record.status === "Confirmed" && (
                        <Button type="primary" onClick={() => openRefundModal(record.bookingId)}   className="Refund-button">
                            Hủy Đơn và Yêu Cầu Hoàn Tiền
                        </Button>
                    )}
                    {record.status === "Completed" && (
                        <>
                            {!feedbackBookingId && (
                                <Button type="primary" onClick={() => openFeedbackModal()}>
                                    Nhập Feedback
                                </Button>
                            )}
                            <Button
                                type="primary"
                                onClick={() => {
                                    setBkId(record.bookingId);
                                    setVaccineRecordModal(true);
                                }}
                            >
                                Xem Vaccine Record
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    const expandedRowRender = (record: BookingUser) => {
        const detailColumns = [
            {
                title: "Mã Chi Tiết",
                dataIndex: "bookingDetailId",
                key: "bookingDetailId",
                sorter: (a : BookingDetailResponse, b: BookingDetailResponse) => a.bookingDetailId - b.bookingDetailId,
            },
            {
                title: "Tên Vaccine",
                dataIndex: "vaccineName",
                key: "vaccineName",
                render: (_: any, row: BookingDetailResponse) =>
                    row.vaccineName || row.comboVaccineName || "Không có",
            },
            {
                title: "Giá",
                dataIndex: "price",
                key: "price",
                render: (price: number) => `${price.toLocaleString()} VND`,
                sorter: (a : BookingDetailResponse, b : BookingDetailResponse) => a.price - b.price,
            },
            {
                title: "Ngày Tiêm",
                dataIndex: "injectionDate",
                key: "injectionDate",
                sorter: (a: BookingDetailResponse, b: BookingDetailResponse) =>
                    new Date(a.injectionDate).getTime() - new Date(b.injectionDate).getTime(),
                render: (injectionDate: string) => new Date(injectionDate).toLocaleDateString("vi-VN"),
            },
            {
                title: "Trạng Thái",
                dataIndex: "status",
                key: "status",
                render: (status: string) => <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>,
                filters: [
                    { text: "Completed", value: "Completed" },
                    { text: "InProgress", value: "InProgress" },
                    { text: "Canceled", value: "Canceled" },
                    { text: "Skipped", value: "Skipped" },
                ],
                onFilter: (value: any, record : any) => record.status === value,
            },
            {
                title: "Hành Động",
                key: "action",
                render: (_: undefined, record : BookingDetailResponse) => (
                    <div className="booking-actions">
                        {record.status === "Completed" && (
                            <>
                                <Button
                                    type="primary"
                                    className="vaccine-record-button"
                                    onClick={() => {
                                        setBkDetailid(record.bookingDetailId);
                                        setVaccineRecordModal(true);
                                    }}
                                >
                                    Xem Vaccine Record
                                </Button>
                            </>
                        )}
                    </div>
                ),
            },
        ];

        return <Table columns={detailColumns} dataSource={record.bookingDetails} rowKey="bookingDetailId"
                      pagination={false}/>;
    };

    const tabItems = [
        {
            key: '1',
            label: 'Đơn Tiêm Chủng',
            children: (
                <>
                    <div style={{textAlign: "left"}} className="introductionTitle">
                        <h1 className="gt-title">Đơn Tiêm Chủng Của Bạn</h1>
                    </div>
                    <p style={{
                        textAlign: "justify",
                        margin: "0 0 10px",
                        fontSize: "17px",
                        color: "#6D6E70",
                        lineHeight: "1.42857143",
                        paddingBottom: "5px"
                    }}>
                        Đây chính là lịch tiêm chủng mà bạn đã đặt trước, giúp bạn dễ dàng theo dõi và quản lý các mốc thời
                        gian quan trọng để đảm bảo sức khỏe tốt nhất.
                    </p>
                    <StatusLegend/>
                    <Search
                        placeholder="Nhập từ khóa tìm kiếm..."
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: 16, width: 300 }}
                    />
                    <Table
                        columns={columns}
                        dataSource={filteredBookings}
                        rowKey="bookingId"
                        expandable={{ expandedRowRender }}
                        pagination={{ pageSize: 10 }}
                    />
                </>
            ),
        },
        {
            key: '2',
            label: 'Lịch Tiêm Chủng',
            children: (
                <>
                    <div style={{textAlign: "left"}} className="introductionTitle">
                        <h1 className="gt-title">Lịch tiêm chủng cho đơn mà bạn đã đặt</h1>
                    </div>
                    <p style={{
                        textAlign: "justify",
                        margin: "0 0 10px",
                        fontSize: "17px",
                        color: "#6D6E70",
                        lineHeight: "1.42857143",
                        paddingBottom: "5px"
                    }}>
                        Không chỉ vậy, tôi còn hỗ trợ bạn xem trước các lịch tiêm trong tương lai, giúp bạn luôn chủ động
                        sắp xếp thời gian và không bỏ lỡ bất kỳ mũi tiêm quan trọng nào.
                    </p>
                    <StatusLegend/>
                    <Calendar
                        value={calendarValue}
                        cellRender={(current, info) => {
                            if (info.type === "date") {
                                return dateCellRender(current);
                            }
                            if (info.type === "month") {
                                return monthCellRender(current);
                            }
                        }}
                        onSelect={handleSelectDate}
                        onChange={(value) => setCalendarValue(value)}
                    />
                </>
            ),
        }
    ];

    return (
        <>
            <CustomerNavbar/>
            <div className="booking-calendar-container">
                <span>
                  <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">
                    Trang chủ
                  </Link>
                  <span className="separator"> » </span>
                  <span className="last">Tổng các đặt đơn tiêm chủng của bạn</span>
                </span>

                <Tabs
                    defaultActiveKey="1"
                    style={{ marginTop: '20px' }}
                    items={tabItems}
                />

                <Modal
                    className="booking-details-modal"
                    title={`Chi tiết đặt lịch ngày ${selectedDate?.format("DD/MM/YYYY")}`}
                    open={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                >
                    <Tabs defaultActiveKey="1" items={[
                        {
                            label: "Thông tin đặt lịch",
                            key: "1",
                            children: (
                                <List
                                    dataSource={selectedDate ? bookingMap[selectedDate.format("YYYY-MM-DD")] ?? [] : []}
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
                                                                }).format(detail.price)}
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
                                                                        setVisible(false)
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
                            ),
                        },
                        {
                            label: "Feedback của người dùng",
                            key: "2",
                            children: feedbackBookingId && (
                                <div className="feedback-container">
                                    {/* Rating Section */}

                                    <p style={{
                                        textAlign: "left",
                                        fontSize: "15px", color: "#1890FF", marginBottom: "20px"
                                    }}> Mã FeedBack: {feedbackBookingId.feedbackId}</p>

                                    <div className="feedback-container__rating">
                                        <Rate
                                            disabled
                                            value={feedbackBookingId?.rating}
                                            className="feedback-container__rating-icon"
                                            style={{color: "#FFD700"}}
                                        />
                                    </div>

                                    <p className="feedback-container__comment-label">
                                        Bình Luận:
                                    </p>

                                    {/* Comment Section */}
                                    <div className="feedback-container__comment-section">
                                        <p className="feedback-container__comment-section-text">
                                            {feedbackBookingId?.comment || 'Không có bình luận'}
                                        </p>
                                    </div>

                                    {/* Feedback Date Section */}
                                    <div className="feedback-container__date-section">
                                        <p className="feedback-container__date-section-label">
                                            Ngày:
                                        </p>
                                        <p className="feedback-container__date-section-value">
                                            {feedbackBookingId?.dateSubmitted || 'Chưa có ngày'}
                                        </p>
                                    </div>

                                    <div className="feedback-container__actions">
                                        <Button
                                            type="primary"
                                            className="update-feedback-button"
                                            onClick={() => openFeedbackModal(true)}
                                        >
                                            <FiEdit2/> Chỉnh sửa
                                        </Button>

                                        <Popconfirm
                                            title="Xóa feedback"
                                            description="Bạn có chắc chắn muốn xóa feedback này không?"
                                            onConfirm={() => handleDeleteFeedback(feedbackBookingId.feedbackId)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <Button
                                                type="primary"
                                                danger
                                                className="delete-feedback-button"
                                            >
                                                <MdDeleteOutline/> Xóa Feedback
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            ),
                        },
                    ]}/>
                </Modal>

                {/* Dành cho việc sửa và thêm feedback */}
                <Modal
                    title={isEditMode ? "Chỉnh sửa Feedback" : "Nhập Feedback"}
                    open={feedbackModalVisible}
                    onCancel={() => setFeedbackModalVisible(false)}
                    onOk={handleSubmitFeedback}
                    okText={isEditMode ? "Cập nhật" : "Gửi"}
                >
                    <Form layout="vertical">
                        <Form.Item label="Mã đơn hàng">
                            <Input
                                value={selectedBooking?.bookingId}
                                disabled
                            />
                        </Form.Item>
                        {isEditMode && feedbackBookingId && (
                            <Form.Item label="Mã Feedback">
                                <Input value={feedbackBookingId.feedbackId} disabled/>
                            </Form.Item>
                        )}
                        <Form.Item label="Bình luận">
                            <Input.TextArea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Nhập bình luận của bạn..."
                                rows={4}
                            />
                        </Form.Item>
                        <Form.Item label="Đánh giá">
                            <Rate
                                value={rating}
                                onChange={(value) => setRating(value)}
                            />
                        </Form.Item>
                    </Form>

                </Modal

                >

                {/* */}
                <Modal
                    title="Xác Nhận Hủy Đơn"
                    open={refundModalVisible}
                    onCancel={closeRefundModal}
                    onOk={handleRefundRequest}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Input.TextArea
                        placeholder="Nhập lý do hủy để yêu cầu hoàn tiền"
                        value={reason || ""}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                    />
                </Modal>

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
            <FloatingButtons/>
            <Footer/>
        </>
    );
};

export default BookingHistory;