import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordRequest } from "../../../interfaces/Account.ts";
import { apiForgotPassword } from "../../../apis/apiAccount.ts";
import { notification } from "antd";
import {AxiosError} from "axios";
import {toast} from "react-toastify";

export const useForgotPassWord  = () => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

   

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: ForgotPasswordRequest = { email };

        if (!email.trim()) {
            setError("Vui lòng nhập email.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiForgotPassword(data);

            if (response.result) {
                toast.success(response.result.message);
                setTimeout(() => navigate("/login"), 5000);
            } else {
                notification.error({ message: response.error || "Lỗi Server" });
            }
        } catch (error : unknown) {
            if (error instanceof AxiosError) {
               toast.error(error.response?.data?.errorMessages);
            } else {
               toast.error("Lỗi không xác định");
            }
        } finally {
            setLoading(false);
        }
    };

    return { email, setEmail, loading, error, handleForgotPasswordSubmit };
}
