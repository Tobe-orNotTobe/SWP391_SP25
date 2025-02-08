import React from "react";
import { FaGoogle, FaGithub, FaFacebookF, FaEyeSlash, FaEye } from "react-icons/fa";
import { useLogin } from "../../hooks/useAuth"; // Import the custom hook
import "./Auth.scss";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const {
        username,
        setUsername,
        password,
        setPassword,
        handleLoginSubmit,
        isLoading,
        error,
        showPassword,
        togglePasswordVisibility,
    } = useLogin();

    return (
        <div className="authContainer">
            <form onSubmit={handleLoginSubmit}>
                <h1>Trang Đăng Nhập</h1>
                <div className="authSocialContainer">
                    <a href="#" className="social">
                        <FaGoogle />
                    </a>
                    <a href="#" className="social">
                        <FaGithub />
                    </a>
                    <a href="#" className="social">
                        <FaFacebookF />
                    </a>
                </div>
                <span>Hoặc Đăng Nhập Với Tài Khoản Đã Đăng Kí</span>
                <label>Tên Đăng Nhập: </label>
                <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    className="authInput"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Mật Khẩu: </label>
                <div className="passwordInputContainer">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        className="authInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="eyeIcon" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                    </span>
                </div>          
                {error && <p className="errorText">{error}</p>}
                <button type="submit" className="authButton" disabled={isLoading}>
                    {isLoading ? "Đang Đăng Nhập..." : "Đăng Nhập"}
                </button>
                <span><Link to="forgot-password">Quên Mật Khẩu?</Link></span>
            </form>
            <hr/>
            <span>Chưa có tài khoản? <Link to="/register">Đăng Kí Tại Đây</Link></span>
        </div>
    );
};

export default Login;
