import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { apiRegister } from "../../../apis/apiAuth";
import { RegisterRequest } from "../../../interfaces/Auth";
import { notification } from "antd";
import {AxiosError} from "axios";


export const useRegister = () => {
    // const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

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

        const data: RegisterRequest = { email, password, userName, fullName, phoneNumber, address, dateOfBirth };

        if (errorUsername || errorEmail || errorPassword || errorConfirmPassword || errorPhoneNumber || errorAddress || errorDoB) {
            notification.error({
                message: "Đăng Kí Thất Bại",
                description: "Vui lòng kiểm tra lại thông tin nhập vào.",
            });

            console.log("hahahahaha")
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiRegister(data);
            if (response?.message) {
                notification.success({
                    message: "Đăng Kí Thành Công",
                    description: response.message,
                });

                setIsRedirecting(true);
            } else {
                notification.error({
                    message: response?.error ?? "Có lỗi xảy ra, vui lòng thử lại!",
                });
            }
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.error("Lỗi API:", error.response?.data || error.message);
                notification.error({
                    message: "Đăng Kí Thất Bại",
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
        errorFullName,
        isRedirecting
    };
};