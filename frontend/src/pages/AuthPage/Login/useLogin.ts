import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { LoginRequest } from "../../../interfaces/Account.ts";
import { apiLogIn } from "../../../apis/apiAccount.ts";
import {AxiosError} from "axios";
import { toast } from "react-toastify";
import {decodeToken} from "../../../utils/decodeToken.ts";

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
            toast.error("Đăng nhập thất bại! Tài khoản và mật khẩu không được để trống.");
            return;
        }


        setIsLoading(true);

        try {
            const response = await apiLogIn(data);
            if (response.result) {
                localStorage.setItem("token", response.result.token);

                // Cảnh báo: Lưu refreshToken vào localStorage không an toàn, cần thảo luận với BE
                localStorage.setItem("refreshToken", response.result.refeshToken);

                toast.success("Đăng nhập thành công!");

                setIsLoading(false);

                // Giải mã token để lấy role
                const decoded = decodeToken(response.result.token);

                if (!decoded) {
                    toast.error("Token không hợp lệ!");
                    return;
                }

                const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                let redirectPath = "/homepage";
                switch (userRole) {
                    case "Admin":
                        redirectPath = "/homepage";
                        break;
                    case "Manager":
                        redirectPath = "/manager/dashboard";
                        break;
                    case "Staff":
                        redirectPath = "/staff/assignDoctor";
                        break;
                    case "Doctor":
                        redirectPath = "/doctor/vaccination-schedule";
                        break;
                    case "Customer":
                        redirectPath = "/homepage";
                        break;
                    default:
                        toast.error("Vai trò không hợp lệ!");
                        return;
                }

                setIsRedirecting(true);

                setTimeout(() => {
                    setIsRedirecting(false);
                    navigate(redirectPath);
                }, 2000);
            }

        } catch (error : unknown) {
            if (error instanceof AxiosError) {
                toast.error(`${error.response?.data?.errorMessages || "Lỗi không xác định từ server"}`);
            } else {
                console.error("Lỗi không xác định:", error);
                toast.error("Lỗi không xác định, vui lòng thử lại sau.");
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