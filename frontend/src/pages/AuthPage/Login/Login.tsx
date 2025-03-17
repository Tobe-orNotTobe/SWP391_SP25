import React from "react";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar";
import { FaEyeSlash, FaEye } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import {useAuthGoogle, useLogin} from "./useLogin";
import "../Auth.scss"
import LoadingRedirect from "../../../components/Loading/LoadingRedirect";
import {FcGoogle} from "react-icons/fc";

const Login : React.FC = () => {

    const {
        username,
        isLoading,
        setUsername,
        password,
        setPassword,
        handleLoginSubmit,
        error,
        showPassword,
        togglePasswordVisibility,
        isRedirecting
    } = useLogin();

    const {isGoogleLoading, isGoogleRedirecting, googleError, handleLoginGoogle} = useAuthGoogle();

    if (isRedirecting || isGoogleRedirecting) {
        return <LoadingRedirect message="Đăng nhập thành công! Đang chuyển hướng..." delay={2000} to="/homepage" />;
    }

    return (
        <>
            <CustomerNavbar/>
            <div className="authBackGround">
                <div className="authContainer">
                    <h1>Trang Đăng Nhập</h1>
                    <form onSubmit={handleLoginSubmit}>
                        <label>Tên Đăng Nhập: </label>
                        <input
                            type="text"
                            placeholder="Nhập tên đăng nhập"
                            className="authInput"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label>Mật Khẩu: </label>
                        <div className="passwordInputContainer">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                className="authInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="eyeIcon" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {error || googleError && <p className="errorText">{error}</p>}
                        <button type="submit" className="authButton"  disabled={isLoading}>
                           Đăng Nhập
                        </button>
                    </form>

                    <div className="divider">
                        <span>hoặc</span>
                    </div>

                    <div className="authSocialContainer">
                        <button type="button" className="googleButton" onClick={handleLoginGoogle} disabled={isGoogleLoading}>
                            <FcGoogle className="googleIcon" />
                            Đăng nhập với Google
                        </button>
                    </div>

                    <span>
                        Chưa có tài khoản? <Link to="/register" style={{color : "#2A388F"}}>Đăng Kí Tại Đây</Link>
                    </span>

                    <span>
                        <Link to="/forgot-password" style={{color : "#2A388F"}}> Quên Mật Khẩu?</Link>
                    </span>
                </div>
            </div>
        </>
    );
}

export default Login