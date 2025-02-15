import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ResetPasswordRequest } from "../../../types/Auth";
import { notification } from "antd";  
import { apiResetPassword } from "../../../apis/apiAuth";

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
                notification.error({ message: response.error || "Lỗi Server" });
            }
        } catch (error) {
            console.error(error);
            notification.error({ message: "Đổi Mật Khẩu Thất Bại", description: "Lỗi Server" });
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
