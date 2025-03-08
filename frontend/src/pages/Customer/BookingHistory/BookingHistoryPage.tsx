import React from "react";
import {Calendar, Modal, List, Button, Tag, Form, Input, Rate, Tabs, Popconfirm} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useBookingUser , STATUS_COLORS} from "./useBookingHistoryPage.ts";
import {useBookingHistoryPage} from "./useBookingHistoryPage.ts";
import "./BookingHistory.scss";
import { SelectInfo } from "antd/lib/calendar/generateCalendar";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import { Link } from "react-router-dom";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";

const BookingHistory: React.FC = () => {
    const { bookings } = useBookingUser();
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

        // Derived data
        bookingMap,
        statusCountByMonth,

        // Actions
        handleCancelBooking,
        handleSubmitFeedback,
        handleDeleteFeedback,
        openFeedbackModal,
        handleTransactionPedingStatus,
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
        const bookingsOnDay = bookingMap[value.format("YYYY-MM-DD")];
        if (!bookingsOnDay) return null;

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
        const statusCount = statusCountByMonth[monthKey];

        // If no bookings in this month, return null
        if (!statusCount || Object.keys(statusCount).length === 0) return null;

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
                            fontWeight: "bold"
                        }}
                    >
                        {status}: {count} đơn
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <CustomerNavbar />
            <div className="booking-calendar-container">
                <span>
                  <Link style={{ textDecoration: "none", color: "#2A388F" }} to="/homepage">
                    Trang chủ
                  </Link>
                  <span className="separator"> » </span>
                  <span className="last">Lịch sử đặt đơn tiêm chủng</span>
                </span>

                <div style={{ paddingTop: "20px", textAlign: "left" }} className="introductionTitle">
                    <h1 className="gt-title">Đơn Tiêm Chủng Của Bạn</h1>
                </div>

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
                                    dataSource={selectedDate ? bookingMap[selectedDate.format("YYYY-MM-DD")] : []}
                                    renderItem={(booking) => (
                                        <List.Item className="booking-list-item">
                                            <div className="booking-details">
                                                <div>
                                                    <p>
                                                        <span className="label">Mã đặt lịch:</span>
                                                        <span className="value booking-id">{booking.bookingId}</span>
                                                    </p>
                                                    <p>
                                                        <span className="label">Tên trẻ:</span>
                                                        <span className="value">{booking.childName}</span>
                                                    </p>
                                                    <p>
                                                        <span className="label">Loại đặt lịch:</span>
                                                        <span className="value">{booking.bookingType}</span>
                                                    </p>
                                                    <p></p>
                                                    <p>
                                                        <span className="label">Ngày đặt:</span>
                                                        <span className="value">
                                                            {dayjs(booking.bookingDate).format("DD/MM/YYYY")}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="label">Tổng tiền:</span>
                                                        <span className="value total-price">
                                                            {booking.totalPrice.toLocaleString()} VNĐ
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="label">Ghi chú:</span>
                                                        <span className="value">{booking.notes}</span>
                                                    </p>
                                                    <p>
                                                        <span className="label">Trạng thái:</span>
                                                        <Tag color={STATUS_COLORS[booking.status]}>{booking.status}</Tag>
                                                    </p>

                                                    <div className="booking-actions">
                                                        {booking.status === "Pending" && (
                                                            <>
                                                                <Button
                                                                    type="primary"
                                                                    className="Pending-Button"
                                                                    onClick={() => {
                                                                        handleTransactionPedingStatus(booking.bookingId);
                                                                    }}
                                                                >
                                                                    Thanh Toán
                                                                </Button>

                                                                <Button
                                                                    type="primary"
                                                                    className="Cancel-button"
                                                                    onClick={() => {
                                                                        handleCancelBooking(booking.bookingId);
                                                                    }}
                                                                >
                                                                    Hủy Lịch
                                                                </Button>
                                                            </>
                                                        )}

                                                        {booking.status === "Confirmed" && (
                                                            <>
                                                                <Button
                                                                    type="primary"
                                                                    className="Cancel-button"
                                                                    onClick={() => {
                                                                        setSelectedBooking(booking);
                                                                        openFeedbackModal(false);
                                                                    }}
                                                                >
                                                                    Hủy Lịch
                                                                </Button>
                                                            </>
                                                        )}

                                                        {booking.status === "Completed" && (
                                                            <>
                                                                {!feedbackBookingId && (
                                                                    <Button
                                                                        type="primary"
                                                                        className="feedback-button"
                                                                        onClick={() => {
                                                                            setSelectedBooking(booking);
                                                                            openFeedbackModal(false);
                                                                        }}
                                                                    >
                                                                        Nhập Feedback
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    type="primary"
                                                                    className="vaccine-record-button"
                                                                    // onClick={() => {
                                                                    //     handleVaccineRecordClick(booking);
                                                                    // }}
                                                                >
                                                                    Xem Vaccine Record
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            ),
                        },
                        {
                            label: "Feedback của người dùng",
                            key: "2",
                            children: feedbackBookingId && (
                                <div className="feedback-container">
                                    {/* Rating Section */}

                                    <p style={{textAlign : "left", fontSize : "15px", color : "#1890FF", marginBottom :"20px"}}> Mã FeedBack: {feedbackBookingId.feedbackId}</p>

                                    <div className="feedback-container__rating">
                                        <Rate
                                            disabled
                                            value={feedbackBookingId?.rating}
                                            className="feedback-container__rating-icon"
                                            style={{color : "#FFD700"}}
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

                {/* Shared Modal for Adding and Editing Feedback */}
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
                                <Input value={feedbackBookingId.feedbackId} disabled />
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
                </Modal>
            </div>
            <FloatingButtons/>
            <Footer/>
        </>
    );
};

export default BookingHistory;