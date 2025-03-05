import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { LoginRequest } from "../../../interfaces/Auth";
import { apiLogIn } from "../../../apis/apiAuth";
import {AxiosError} from "axios";
import { notification } from "antd";

export const useLogin = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();  
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () =>{
        setShowPassword((prev)=> !prev)
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); 
        const data : LoginRequest = {username, password};

        
        if (!username || !password) {
            setError("Tài khoản và mật khẩu không được để trống");
            notification.error({
                message:"Đăng Nhập Thất Bại"
            })
            return;
        }


        setIsLoading(true);

        try {
            const response = await apiLogIn(data);
            if (response.token) {
                localStorage.setItem("token", response.token);
                console.log("Login Successful", response);

                notification.success({
                    message: "Đăng nhập thành công",
                });

                setIsLoading(false);
                setIsRedirecting(true);

                setTimeout(() => {
                    setIsRedirecting(false);
                    navigate("/homepage");
                }, 1000);
            }
        } catch (error : unknown) {
            if (error instanceof AxiosError) {

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
        username,
        setUsername,
        password,
        setPassword,
        handleLoginSubmit,
        showPassword,
        isLoading,
        togglePasswordVisibility,
        error,
        isRedirecting
    };
};

export const useLoginGoogle = () => {

    const handleGoogleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    return {handleGoogleLogin}


}