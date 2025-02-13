import axios from "axios";

import React, {useEffect, useState,} from "react";
import {  apiForgotPassword, apiLogIn, apiRegister, apiResetPassword } from "../apis/apiAuth";
import {  ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest} from "../types/Auth";
import { notification } from "antd";  
import { useNavigate} from "react-router-dom";  



export const useLogin = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        const response = await apiLogIn(data);
        try {


            if (response.token) {

                localStorage.setItem("token", response.token);
                console.log("Login Successful", response);

                notification.success({
                    message: "Đăng Nhập Thành Công",  
                });

                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/homepage");  
                }, 2000);
            }else{
                notification.error({
                    message: "Đăng Nhập Thành Công",
                    description: response.error,
                });
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Đăng nhập thất bại",
                description: response.error,
            });
            setError("Đăng nhập thất bại, Tài Khoản Hoặc mật Khẩu bị sai");
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
    };
};

export const useRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [userName, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [dateOfBirth, setDob] = useState<string>("");

    
    const [errorUsername, setErrorUsername] = useState<string | null>(null);
    const [errorEmail, setErrorEmail] = useState<string | null>(null);
    const [errorPassword, setErrorPassword] = useState<string | null>(null);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string | null>(null);
    const [errorPhoneNumber, setErrorPhoneNumber] = useState<string | null>(null);
    const [errorAddress, setErrorAddress] = useState<string | null>(null);
    const [errorDoB, setErrorDoB] = useState<string | null>(null);
    const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
    const [errorFullName, setErrorFullName] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () =>{
        setShowPassword((prev)=> !prev)
    }

    const handlefullNameChange = (value :  string) => {
        setFullName(value);
        if(!value) {
            setErrorFullName("Không được để trống tên")
        }else{
            setErrorFullName(null);
        }
    }

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
            setErrorUsername("Tên đăng nhập chỉ chứa chữ và số, không có dấu cách.");
        } else {
            setErrorUsername(null);
        }
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (!/\S+@\S+\.\S+/.test(value)) {
            setErrorEmail("Email không đúng định dạng");
        } else {
            setErrorEmail(null);
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if ((!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(value))) {
            setErrorPassword("Mật khẩu cần ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt, tối thiểu 6 ký tự.");
        } else {
            setErrorPassword(null);
        }

        if (confirmPassword && value !== confirmPassword) {
            setErrorConfirmPassword("Mật khẩu xác nhận không khớp");
        } else {
            setErrorConfirmPassword(null);
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (password && value !== password) {
            setErrorConfirmPassword("Mật khẩu xác nhận không khớp");
        } else {
            setErrorConfirmPassword(null);
        }
    };

    const handlePhoneNumberChange = (value: string) => {
        setPhoneNumber(value);
        if (!/^\d{10,11}$/.test(value)) {
            setErrorPhoneNumber("Số điện thoại không hợp lệ.");
        } else {
            setErrorPhoneNumber(null);
        }
    };

    const handleAddressChange = (value: string) => {
        setAddress(value);
        if (value.length < 5) {
            setErrorAddress("Địa chỉ phải có ít nhất 5 ký tự.");
        } else {
            setErrorAddress(null);
        }
    };

    const handleDoBChange = (value: string) => {
        setDob(value);
        if (!value) {
            setErrorDoB("Không Được Để Trống Ngày Sinh");
        } else {
            setErrorDoB(null);
        }
    };

    
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorGeneral(null);
    
        handleUsernameChange(userName);
        handleEmailChange(email);
        handlePasswordChange(password);
        handleConfirmPasswordChange(confirmPassword);
        handlePhoneNumberChange(phoneNumber);
        handleAddressChange(address);
        handleDoBChange(dateOfBirth);
        handlefullNameChange(fullName);
    
        const data: RegisterRequest = { email, password, userName, fullName, phoneNumber, address, dateOfBirth, role: "User" };
    
        if (errorUsername || errorEmail || errorPassword || errorConfirmPassword || errorPhoneNumber || errorAddress || errorDoB) {
            notification.error({
                message: "Đăng Kí Thất Bại",
                description: "Vui lòng kiểm tra lại thông tin nhập vào.",
            });
            return;
        }
    
        setIsLoading(true);
    
        try {
            const response = await apiRegister(data);
    
            if (response.message) {
               
                notification.success({
                    message: "Đăng Kí Thành Công",
                    description: response.message || "Vui lòng kiểm tra email của bạn để xác nhận.",
                });
                navigate("/login");
            } else {
                
                throw new Error(response.error || "Đăng ký thất bại");
            }
        } catch (error: unknown) {
            setIsLoading(false);

            let errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại.";
    
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
    
            notification.error({
                message: "Đăng Kí Thất Bại",
                description: errorMessage,
            });
    
            console.error("Lỗi đăng ký:", error);
        }
    };     
    
    return {
        showPassword,
        togglePasswordVisibility,
        userName,
        handleUsernameChange,
        email,
        handleEmailChange,
        password,
        handlePasswordChange,
        confirmPassword,
        handleConfirmPasswordChange,
        fullName,
        handlefullNameChange,
        phoneNumber,
        handlePhoneNumberChange,
        address,
        handleAddressChange,
        dateOfBirth,
        handleDoBChange,
        isLoading,
        handleRegisterSubmit,
        errorUsername,
        errorEmail,
        errorPassword,
        errorConfirmPassword,
        errorPhoneNumber,
        errorAddress,
        errorDoB,
        errorGeneral,
        errorFullName
    };
};

export const useLoginGoogle = () => {

    const handleGoogleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    return {handleGoogleLogin}


}


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
        } catch (error) {
            console.error(error);
            notification.error({ message: "Đổi Mật Khẩu Thất Bại", description: "Lỗi Server" });
        } finally {
            setLoading(false);
        }
    };

    return { email, setEmail, loading, error, handleForgotPasswordSubmit };
}


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
    }, [location.search]);

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
