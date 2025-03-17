import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {BookingResponse} from "../../../interfaces/Booking.ts";
import {apiGetAllBookings, apiGetBookingById} from "../../../apis/apiBooking.ts";
import {useForm} from "antd/es/form/Form";
import {useNavigate, useParams} from "react-router-dom";
import {apiCreateAccount, apiUpdateAccount} from "../../../apis/apiAccount.ts";
import dayjs from "dayjs";
import {AccountRequest, UpdateAccountRequest} from "../../../interfaces/Account.ts";
import {apiVaccineRecordByBookingId} from "../../../apis/apiVaccineRecord.ts";
import {VaccineRecordUser} from "../../../interfaces/VaccineRecord.ts";

export const useGetAllBooking = () => {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllBookings = async () => {
        setLoading(true);
        const response = await apiGetAllBookings();
        if (!response.isSuccess) {
            response.errorMessages.forEach((msg: string) => {
                toast.error(msg);
            });
            setError("Error Fetching All Booking Data")
            return;
        }
        if (response.result) setBookings(response.result);
        setLoading(false);

    };

    return { bookings, loading, error, fetchAllBookings };
};

export const useGetVaccineRecordByBookingId = () => {
    const [vaccineRecord, setVaccineRecord] = useState<VaccineRecordUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const fetchVaccineRecordByBookingId = async (bookingId: number) => {

        setLoading(true);
        const response = await apiVaccineRecordByBookingId(bookingId);
        if (!response.isSuccess) {
            response.errorMessages.forEach((msg: string) => {
                toast.error(msg);
            });
            setError("Error Fetching All Booking Data")
            return;
        }
        if (response.result) setVaccineRecord(response.result);
        setLoading(false);

    };

    return { vaccineRecord, loading, error, fetchVaccineRecordByBookingId };

}


export const useAdminBookingForm = () => {
    const [form] = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [bookingDate, setBookingDate] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            apiGetBookingById(Number(id))
                .then((response) => {
                    if (response?.result) {
                        setBookingDate(response.result.bookingDate ? dayjs(response.result.bookingDate).format("YYYY-MM-DD") : undefined);
                        form.setFieldsValue({
                            ...response.result,
                            bookingDate: response.result.bookingDate
                                ? dayjs(response.result.bookingDate).format("YYYY-MM-DD")
                                : undefined,
                        });
                    }
                })
                .catch(() => {
                    toast.error("Không thể tải dữ liệu tài khoản.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, form, isEditMode]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        if (isEditMode) {
            const updateAccountData: UpdateAccountRequest = {
                id,
                ...values,
                isActive: values.isActive ?? true // Nếu thiếu thì mặc định là true
            };
            const response = await apiUpdateAccount(updateAccountData);
            if (!response.isSuccess) {
                response.errorMessages.forEach((msg: string) => {
                    toast.error(msg);
                });
                return;
            }
            toast.success("Cập nhật thành công!");
        } else {
            const newAccountData: AccountRequest = {
                ...values,
                role: values.role ?? "Customer",
            };
            const response = await apiCreateAccount(newAccountData);
            if (!response.isSuccess) {
                response.errorMessages.forEach((msg: string) => {
                    toast.error(msg);
                });
                return;
            }
            toast.success("Tạo tài khoản thành công!");
        }
        navigate("/admin/account");
        setLoading(false);

    };
    return { form, bookingDate, setBookingDate, isEditMode, handleSubmit, loading };
};
