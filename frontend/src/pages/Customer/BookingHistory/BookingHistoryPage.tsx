import React, {useState, useMemo, useEffect} from "react";
import { Calendar, Modal, List, Button, Tag, Form, Input } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useBookingUser } from "./useBookingHistoryPage.ts";
import "./BookingHistory.scss";
import { BookingUser } from "../../../interfaces/VaccineRegistration.ts";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import {Link} from "react-router-dom";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import {SelectInfo} from "antd/lib/calendar/generateCalendar";
import {apiCancelBooking} from "../../../apis/apiBooking.ts";
import {AxiosError} from "axios";
import {toast} from "react-toastify";


//Chỉnh màu sẵn ở đây để sử dụng cho các trạng thái cần thiết á mà
const STATUS_COLORS : Record<string, string>= {
    Pending: "#faad14",
    Confirmed: "#1890ff",
    Completed: "#52c41a",
    Cancelled: "#ff4d4f"
};

const BookingHistory: React.FC = () => {
    const { bookings } = useBookingUser();

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [visible, setVisible] = useState(false);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingUser | null>(null);
    const [calendarValue, setCalendarValue] = useState<Dayjs>(dayjs());

    const [latestDate, setLatestDate] = useState<string | null>(null);

    // Cái này lấy  cái bookings có Bookings Id lớn nhất
    const latestBooking = useMemo(() => {
        if (bookings.length === 0) return null;

        return bookings.reduce((max, booking) =>
            booking.bookingId > max.bookingId ? booking : max, bookings[0]
        );
    }, [bookings]);
    //Cái này áp dụng cái trên booking có id lớn nhất để lấy cái date, cập nhật default cho thằng Calendar
    // CÓ thể hiểu là khi calendar chạy, thì nó sẽ hiển thị cái booking gần nhất


    useEffect(() => {
        if (latestBooking && latestBooking.bookingDate !== latestDate) {
            // console.log((latestBooking.bookingDate))
            setLatestDate(latestBooking.bookingDate);
        }
        if (latestDate) {
            setCalendarValue(dayjs(latestDate));
        }
    }, [latestBooking, latestDate]);


    const defaultSelectedDate = useMemo(() => {
        if (!latestBooking) return dayjs();
        return dayjs(latestBooking.bookingDate);
    }, [latestBooking]);


    const selectedYear = useMemo(() =>
            calendarValue ? calendarValue.year() : defaultSelectedDate.year(),
        [calendarValue, defaultSelectedDate]
    );


    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => b.bookingId - a.bookingId);
    }, [bookings]);

    const bookingsByYear = useMemo(() => {
        return sortedBookings.filter((booking) => dayjs(booking.bookingDate).year() === selectedYear);
    }, [sortedBookings, selectedYear]);

    const bookingMap: Record<string, typeof bookings> = {};
    bookingsByYear.forEach((booking) => {
        const dateKey = dayjs(booking.bookingDate).format("YYYY-MM-DD");
        if (!bookingMap[dateKey]) {
            bookingMap[dateKey] = [];
        }
        bookingMap[dateKey].push(booking);
    });

    const bookingsByMonth: Record<string, number> = {};
    bookingsByYear.forEach((booking) => {
        const monthKey = dayjs(booking.bookingDate).format("YYYY-MM");
        bookingsByMonth[monthKey] = (bookingsByMonth[monthKey] || 0) + 1;
    });

    const handleSelectDate = (date: Dayjs, selectInfo: SelectInfo) => {
        // Only show modal when selecting a specific date, not in month view
        if (selectInfo.source === 'date' && bookingMap[date.format("YYYY-MM-DD")]) {
            setSelectedDate(date);
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    const dateCellRender = (value: Dayjs) => {
        const bookingsOnDay = bookingMap[value.format("YYYY-MM-DD")];
        if (!bookingsOnDay) return null;

        return (
            <div className="booking-cell" style={{
                backgroundColor: STATUS_COLORS[bookingsOnDay[0].status] || '#f0f0f0',
                color: 'white',
                borderRadius: '4px',
                textAlign: 'center',
                padding: '5px'
            }}>
                {bookingsOnDay.length} đơn
            </div>
        );
    };

    const monthCellRender = (value: Dayjs) => {
        const monthKey = value.format("YYYY-MM");
        if (!bookingsByMonth[monthKey]) return null;

        return (
            <div className="month-summary" style={{
                backgroundColor: '#e6f7ff',
                color: '#1890ff',
                borderRadius: '4px',
                textAlign: 'center',
                padding: '10px',
                fontWeight: 'bold'
            }}>
                {bookingsByMonth[monthKey]} đơn
            </div>
        );
    };

    const handleCancelBooking = async (bookingId : number) =>{
        try{
            const response = await apiCancelBooking(bookingId)

            if(response.isSuccess){
                toast.success("Hủy lịch thành công");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error : unknown) {

            console.error(error);
            if (error instanceof AxiosError) {

                if (error.response && error.response.data && error.response.data.errorMessages) {
                    toast.error(`${error.response.data.errorMessages}`);
                } else {
                    toast.error("Lỗi không xác định");
                }
            } else {
                toast.error("Lỗi không xác định");
            }
        }
    }

    return (
        <>
            <CustomerNavbar/>
            <div className="booking-calendar-container">
                 <span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link><span
                     className="separator"> » </span><span
                     className="last">Lịch sử đặt đơn tiêm chủng</span>
                </span>

                <div style={{paddingTop: "20px", textAlign: "center"}} className="introductionTitle">
                    <h1 className="gt-title">Đơn Tiêm Chủng Của Bạn</h1>
                </div>
                <Calendar
                    value={calendarValue}
                    cellRender={(current, info) => {
                        if (info.type === 'date') {
                            return dateCellRender(current);
                        }
                        if (info.type === 'month') {
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
                                            <span
                                                className="value">{dayjs(booking.bookingDate).format("DD/MM/YYYY")}</span>
                                        </p>
                                        <p>
                                            <span className="label">Tổng tiền:</span>
                                            <span
                                                className="value total-price">{booking.totalPrice.toLocaleString()} VNĐ</span>
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
                                                            setSelectedBooking(booking);
                                                            setFeedbackModalVisible(true);
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

                                            {booking.status === "Confrimed" && (
                                                <>
                                                    <Button
                                                        type="primary"
                                                        className="Cancel-button"
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setFeedbackModalVisible(true);
                                                        }}
                                                    >
                                                        Hủy Lịch
                                                    </Button>
                                                </>
                                            )}

                                            {booking.status === "Completed" && (
                                                <>
                                                    <Button
                                                        type="primary"
                                                        className="feedback-button"
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setFeedbackModalVisible(true);
                                                        }}
                                                    >
                                                        Nhập Feedback
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        className="vaccine-record-button"
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setFeedbackModalVisible(true);
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
                        )}
                    />
                </Modal>

                <Modal
                    title="Nhập Feedback"
                    open={feedbackModalVisible}
                    onCancel={() => setFeedbackModalVisible(false)}
                    onOk={() => {
                        alert(`Gửi feedback cho booking ID: ${selectedBooking?.bookingId}`);
                        setFeedbackModalVisible(false);
                    }}
                    style={{backgroundColor: '#e6f7ff', padding: '20px', borderRadius: '8px'}}
                >
                    <Form layout="vertical">
                        <Form.Item label="Nhận xét">
                            <Input.TextArea rows={4} placeholder="Nhập đánh giá của bạn..."/>
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