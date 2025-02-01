import React from "react";
import { FaGoogle, FaGithub, FaFacebookF } from "react-icons/fa";
import { useLogin } from "../../hooks/useAuth"; // Import the custom hook
import "./Auth.scss";

const Login: React.FC = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        handleLoginSubmit,
        isLoading,
    } = useLogin();

    return (
        <div className="authContainer">
            <form onSubmit={handleLoginSubmit}>
                <h1>Trang Đăng Nhập</h1>
                <div className="authSocialContainer">
                    <a href="https://www.linkedin.com/in/freewebsitecode/" className="social">
                        <FaGoogle />
                    </a>
                    <a href="https://twitter.com/freewebsitecode" className="social">
                        <FaGithub />
                    </a>
                    <a href="https://www.facebook.com/FreeWebsiteCode/" className="social">
                        <FaFacebookF />
                    </a>
                </div>
                <span>Hoặc Đăng Nhập Với Tài Khoản Đã Đăng Kí</span>
                <input
                    type="email"
                    placeholder="Email"
                    className="authInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="authInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="authButton" disabled={isLoading}>
                    {isLoading ? "Đang Đăng Nhập..." : "Đăng Nhập"}
                </button>
                <span><a href="/register">Quên Mật Khẩu?</a></span>
            </form>

            <hr />
            <span>Chưa có tài khoản? <a href="/register">Đăng Kí Tại Đây</a></span>
        </div>
    );
};

export default Login;
