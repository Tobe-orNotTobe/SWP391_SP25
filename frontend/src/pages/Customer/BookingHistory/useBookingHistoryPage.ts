import {useState, useEffect} from "react";
import {apiGetBookingUser} from "../../../apis/apiBooking.ts";
import {BookingUser} from "../../../interfaces/VaccineRegistration.ts";



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





