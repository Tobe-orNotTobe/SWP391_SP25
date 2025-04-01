import {VaccineRecordUser} from "../../../interfaces/VaccineRecord.ts";
import {
    apiGetBookingUser,
    apiGetVaccineRecordByBookingDetailId,
    apiGetVaccineRecordByBookingId
} from "../../../apis/apiBooking.ts";
import { useState, useMemo, useEffect } from "react";//Dùng useMemo() giúp tránh tính toán lại khi các thông tin  không thay đổi.
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {BookingDetailResponse, BookingUser} from "../../../interfaces/VaccineRegistration.ts";
import { apiCancelBooking } from "../../../apis/apiBooking.ts";
import {useNavigate} from "react-router-dom";
import {apiPostRefundRequest} from "../../../apis/apiTransaction.ts";



export const useBookingUser = () => {
    const [bookings, setBookings] = useState<BookingUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await apiGetBookingUser();
                setBookings(data.result || []);
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải dữ liệu đặt lịch.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return { bookings, loading, error };
};

export const STATUS_COLORS: Record<string, string> = {
    Pending: "#faad14",
    Confirmed: "#2a388f",
    InProgress: "#42A5F5",
    Completed: "#52c41a",
    Cancelled: "#ff4d4f",
    RequestRefund : "#FD7E14",
    Skipped : "#B0B0B0",
};

export const useBookingHistoryPage = (bookings: BookingUser[]) => {

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingDetailResponse | undefined>(undefined);
    const [calendarValue, setCalendarValue] = useState<Dayjs>(dayjs());
    const [latestDate, setLatestDate] = useState<string | null>(null);
    const [bkId, setBKId] = useState<number>(0);
    const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
    const [reason, setReason] = useState<string>("");
    const navigate = useNavigate();


    //sắp xếp lại mảng dựa vào BookingID lớn nhất ( cái này để người dùng hình dung là khi họ đăng kí đơn, naviaate tới trang lịch sử thì họ sẽ thấy đơn mình vừa đặt đầu tiên
    const latestBooking = useMemo(() => {
        if (bookings.length === 0) return null;
        return bookings.reduce(
            (max, booking) => (booking.bookingId > max.bookingId ? booking : max),
            bookings[0]
        );
    }, [bookings]);

    useEffect(() => {
        if (latestBooking && latestBooking.bookingDate !== latestDate) {
            setLatestDate(latestBooking.bookingDate);
        }
        if (latestDate) {
            setCalendarValue(dayjs(latestDate));
        }
    }, [latestBooking, latestDate]);


    //gọi cái này để không phải gọi lại api khi truy cập ( trừ trường hợp có thay đổi)
    const defaultSelectedDate = useMemo(() => {
        if (!latestBooking) return dayjs();
        return dayjs(latestBooking.bookingDate);
    }, [latestBooking]);


    const selectedYear = useMemo(
        () => (calendarValue ? calendarValue.year() : defaultSelectedDate.year()),
        [calendarValue, defaultSelectedDate]
    );

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => b.bookingId - a.bookingId);
    }, [bookings]);

    const bookingsByYear = useMemo(() => {
        return sortedBookings.filter(
            (booking) => dayjs(booking.bookingDate).year() === selectedYear
        );
    }, [sortedBookings, selectedYear]);

    const bookingMap: Record<string, BookingDetailResponse[]> = useMemo(() => {
        return bookingsByYear.reduce<Record<string, BookingDetailResponse[]>>((map, booking) => {
            booking.bookingDetails.forEach((detail) => {
                const dateKey = dayjs(detail.injectionDate).format("YYYY-MM-DD");
                if (!map[dateKey]) {
                    map[dateKey] = [];
                }
                map[dateKey].push({
                    ...detail,
                    childName: booking.childName,
                    status: detail.status,
                });
            });
            return map;
        }, {});
    }, [bookingsByYear]);

    //Tư
    const bookingsByMonth: Record<string, number> = useMemo(() => {
        const monthMap: Record<string, number> = {};
        bookingsByYear.forEach((booking) => {
            const monthKey = dayjs(booking.bookingDate).format("YYYY-MM");
            monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
        });
        return monthMap;
    }, [bookingsByYear]);

    // Biến này tạo ra một đối tượng (result) chứa số lượng đơn đặt lịch theo tháng và theo từng trạng thái (status)
    const statusCountByMonth = useMemo(() => {
        const result: Record<string, Record<string, number>> = {};

        bookingsByYear.forEach((booking) => {
            const monthKey = dayjs(booking.bookingDate).format("YYYY-MM");
            if (!result[monthKey]) {
                result[monthKey] = {};
            }
            result[monthKey][booking.status] = (result[monthKey][booking.status] || 0) + 1;
        });

        return result;
    }, [bookingsByYear]);


    const handleCancelBooking = async (bookingId: number) => {
        try {
            const response = await apiCancelBooking(bookingId);

            if (response.isSuccess) {
                toast.success("Hủy lịch thành công");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error: unknown) {
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
    };

    const handleRefundRequest = async () => {

        const formatedData = {
            bookingId : bkId,
            reason : reason,
        }

        try {
            const response = await apiPostRefundRequest(formatedData);
            if(response.isSuccess){
                toast.success("Đã hủy đơn và gửi yêu cầu refund thành công");
            }
            setTimeout(() => {
                navigate("/customer/wallet")
            })
        }catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errors = error.response?.data?.errors?.Reason;
                const errorMessages = error.response?.data?.errorMessages;

                if (errors && errors.length > 0) {
                    toast.error(errors.join(" "));
                } else if (errorMessages && errorMessages.length > 0) {
                    toast.error(errorMessages.join(" "));
                } else {
                    toast.error("Lỗi không xác định");
                }
            }
        }
    }

    const openRefundModal = (bookingId : number) => {
        setBKId(bookingId);
        setRefundModalVisible(true);
    }


    const closeRefundModal = () => {
        setRefundModalVisible(false);
        setBKId(0);
    };


    const handleTransactionPendingStatus  = async (bookingId: number) => {

        navigate(`/payment/${bookingId}`);
    }

    return {
        // State
        bkId,
        selectedDate,
        setSelectedDate,
        visible,
        setVisible,

        selectedBooking,
        setSelectedBooking,
        calendarValue,
        setCalendarValue,
        reason,
        setReason,
        refundModalVisible,
        setRefundModalVisible,

        // Derived data
        bookingMap,
        bookingsByMonth,
        statusCountByMonth,
        defaultSelectedDate,
        selectedYear,


        // Actions
        handleCancelBooking,
        openRefundModal,
        closeRefundModal,
        handleTransactionPendingStatus,
        handleRefundRequest,

    };
};


export const useVaccineRecordByBookingId  = (bookingId : number)=> {
    const [vaccineRecord, setVaccineRecord] = useState<VaccineRecordUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVaccineRecord = async () => {

            if (!bookingId) {
                setLoading(false);
                return;
            }
            try {
                const data = await apiGetVaccineRecordByBookingId(bookingId);
                if (data.isSuccess) {
                    setVaccineRecord(data.result);
                }
            }catch (err){
                setError("err")
            }finally {
                setLoading(false)
            }
        };
        fetchVaccineRecord();
    },[bookingId])

    return {vaccineRecord, loading, error}
}

export const useVaccineRecordByBookingDetailId = ( bookingDetailId : number) => {
    const [vaccineRecordByBookingDetailId, setVaccineRecord] = useState<VaccineRecordUser | null >(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVaccineRecord = async () => {

            if (!bookingDetailId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await apiGetVaccineRecordByBookingDetailId(bookingDetailId);
                if(response.isSuccess){
                    setVaccineRecord(response.result);
                }
            }catch (err){
                setError("err");
            }finally {
                setLoading(false);
            }
        };
        fetchVaccineRecord()
    }, [bookingDetailId])

    return{vaccineRecordByBookingDetailId, loading, error}
}
