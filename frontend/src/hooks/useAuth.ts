import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginResponse } from "../types/response/AuthResponse";
import { LoginRequest } from "../types/request/AuthRequest";
import { apiLogIn } from "../apis/apiAuth";
import { notification } from "antd";  // Import notification from Ant Design

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");  // Error message for failed login
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [success, setSuccess] = useState<LoginResponse | null>(null);  // Store successful login data
    const navigate = useNavigate();

    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");  // Reset any previous error messages
        const data: LoginRequest = { email, password };
    
        try {
            const response = await apiLogIn(data);
            
            if (response.token) {
                setSuccess(response);
                console.log("Login Successful", response);
    
                notification.success({
                    message: "Đăng Nhập Thành Công",
                });
    
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/homepage");  
                }, 2000); 
            } else {
                setSuccess(null);  
                const errorMessage = "Tài khoản hoặc mật khẩu sai";
                setError(errorMessage);
    
                notification.error({
                    message: "Lỗi Đăng Nhập",
                    description: errorMessage,
                });
    
                setIsLoading(false); 
            }
        } catch (error) {
            setIsLoading(false); 
            const errorMessage = "Đăng Nhập Thất Bại. Vui Lòng Thử Lại";
            setError(errorMessage);
    
            notification.error({
                message: "Server Có Lỗi",
                description: errorMessage,
            });
    
            console.error("Login Failed:", error);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLoginSubmit,
        error,
        isLoading,
        success,  
    };
};
