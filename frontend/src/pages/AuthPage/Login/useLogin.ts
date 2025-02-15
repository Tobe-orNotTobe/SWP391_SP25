import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginRequest } from "../../../types/Auth";
import { apiLogIn } from "../../../apis/apiAuth";
import { notification } from "antd";  

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

export const useLoginGoogle = () => {

    const handleGoogleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    return {handleGoogleLogin}


}