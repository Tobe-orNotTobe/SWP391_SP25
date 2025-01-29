import React from "react";
import { FaGoogle, FaGithub, FaFacebookF } from "react-icons/fa";
import "./Auth.scss";

const Register: React.FC = () => {
    return (
        <>
            <div className="authContainer">
                <form action="#">
                    <h1>Trang Đăng Kí</h1>
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
                    <input type="text" placeholder="Username" className="authInput" />
                    <input type="password" placeholder="Password" className="authInput" />
                    <input type="text" placeholder="Full Name" className="authInput" />
                    <input type="email" placeholder="Email" className="authInput" />
                    <input type="text" placeholder="Phone Number" className="authInput" />
                    <input type="text" placeholder="Address" className="authInput" />
                    <input type="date" placeholder="Date of Birth" className="authInput" />

                    <button className="authButton">Đăng Kí</button>
                    <span>Đã có tài khoản?<a href="/login"> Đăng Nhập</a></span>
                </form>
            </div>
        </>
    );
}

export default Register;
