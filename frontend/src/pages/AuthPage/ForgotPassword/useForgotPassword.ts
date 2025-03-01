import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordRequest } from "../../../interfaces/Auth";
import { apiForgotPassword } from "../../../apis/apiAuth";
import { notification } from "antd";
import {AxiosError} from "axios";

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

            if (response.message) {
                notification.success({ message: response.message, description: "Vui Lòng check hộp thư email của bạn" });
                setTimeout(() => navigate("/login"), 5000);
            } else {
                notification.error({ message: response.error || "Lỗi Server" });
            }
        } catch (error : unknown) {
            if (error instanceof AxiosError) {
                console.error("Lỗi API:", error.response?.data || error.message);
                notification.error({
                    message: "Thay Đổi Mật Khẩu Thất Bại",
                    description: error.response?.data?.error || "Lỗi không xác định từ server",
                });
            } else {
                console.error("Lỗi không xác định:", error);
                notification.error({
                    message: "Lỗi không xác định",
                    description: "Vui lòng thử lại sau.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return { email, setEmail, loading, error, handleForgotPasswordSubmit };
}
