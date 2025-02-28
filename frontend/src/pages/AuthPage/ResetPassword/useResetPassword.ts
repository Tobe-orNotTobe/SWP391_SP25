import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ResetPasswordRequest } from "../../../interfaces/Auth";
import { notification } from "antd";  
import { apiResetPassword } from "../../../apis/apiAuth";
import {AxiosError} from "axios";

export const useResetPassword = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [errorPassword, setErrorPassword] = useState<string | null>(null);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [token, setToken] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        const getSearchParams = () => {
            const query = new URLSearchParams(window.location.search);
            const rawToken = window.location.search.split("token=")[1]?.split("&")[0] || "";
            setToken(decodeURIComponent(rawToken));
            setEmail(query.get("email") || "");
        };
        getSearchParams();
    }, []); 
    

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validatePassword = (newPassword : string) => {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(newPassword);
    };

    const handlePasswordChange = (value : string) => {
        setNewPassword(value);
        setErrorPassword(validatePassword(value) ? null : "Mật khẩu cần ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt, tối thiểu 6 ký tự.");
        setErrorConfirmPassword(confirmPassword && value !== confirmPassword ? "Mật khẩu xác nhận không khớp" : null);
    };

    const handleConfirmPasswordChange = (value : string) => {
        setConfirmPassword(value);
        setErrorConfirmPassword(value !== newPassword ? "Mật khẩu xác nhận không khớp" : null);
    };

    const handleSubmitResetPassword = async (e : React.FormEvent) => {
        e.preventDefault();


        if (errorPassword || errorConfirmPassword) return;

        const data  : ResetPasswordRequest = {email, token, newPassword}

        setIsLoading(true);
        try {
            const response = await apiResetPassword(data);
            if (response.message) {
                notification.success({ message: response.message, description: "Bạn sẽ được chuyển đến trang Login trong ít giây." });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                notification.error({
                    message: response?.error ?? "Có lỗi xảy ra, vui lòng thử lại!",
                });
            }
        } catch (error : unknown) {
            if (error instanceof AxiosError) {
                console.error("Lỗi API:", error.response?.data || error.message);
                notification.error({
                    message: "Đăng Nhập Thất Bại",
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
            setIsLoading(false);
        }
    };

    return {
        showPassword,
        togglePasswordVisibility,
        errorConfirmPassword,
        errorPassword,
        newPassword,
        confirmPassword,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleSubmitResetPassword,
        isLoading,
    };
};
