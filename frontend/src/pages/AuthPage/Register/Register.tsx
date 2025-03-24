import React from "react";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingRedirect from "../../../components/Loading/LoadingRedirect";
import { Link } from "react-router-dom";
import { useRegister } from "./useRegister";
import "../Auth.scss"

const Register : React.FC  = () => {

    const register = useRegister();

    if (register.isRedirecting) {
        return <LoadingRedirect message="Hãy Kiểm Tra Hòm Thư Email Của Bạn để xác nhận tài khoản!" delay={5000} to="/login" />;
    }



    return (
        <>
            <CustomerNavbar/>
            <div className="authBackGround">
                <div className="authContainer">
                    <form onSubmit={register.handleRegisterSubmit} className="registerForm">
                        <h1>Trang Đăng Kí</h1>
                        <div className="formGroup">
                            <div className="formColumn">
                                <label>Tên Đăng Nhập: </label>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={register.userName}
                                    onChange={(e) => register.handleUsernameChange(e.target.value)}
                                    className="authInput"

                                />
                                {register.errorUsername && <p className="errorText">{register.errorUsername}</p>}

                                <label>Email: </label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={register.email}
                                    onChange={(e) => register.handleEmailChange(e.target.value)}
                                    className="authInput"

                                />
                                {register.errorEmail && <p className="errorText">{register.errorEmail}</p>}

                                <label>Mật Khẩu: </label>
                                <div className="passwordInputContainer">
                                    <input
                                        type={register.showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={register.password}
                                        onChange={(e) => register.handlePasswordChange(e.target.value)}
                                        className="authInput"/>
                                    <span className="eyeIcon" onClick={register.togglePasswordVisibility}>
                                        {register.showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </span>
                                </div>
                                {register.errorPassword && <p className="errorText">{register.errorPassword}</p>}

                                <label>Xác Nhận Mật Khẩu: </label>
                                <div className="passwordInputContainer">
                                    <input
                                        type={register.showPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={register.confirmPassword}
                                        onChange={(e) => register.handleConfirmPasswordChange(e.target.value)}
                                        className="authInput"/>
                                    <span className="eyeIcon" onClick={register.togglePasswordVisibility}>
                                        {register.showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </span>
                                </div>
                                {register.errorConfirmPassword && <p className="errorText">{register.errorConfirmPassword}</p>}
                            </div>

                            <div className="formColumn">
                                <label>Họ và tên: </label>
                                <input
                                    type="text"
                                    placeholder="full name"
                                    value={register.fullName}
                                    onChange={(e) => register.handlefullNameChange(e.target.value)}
                                    className="authInput"
                                />
                                {register.errorFullName && <p className="errorText">{register.errorFullName}</p>}
                                <label>Số điện thoại: </label>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={register.phoneNumber}
                                    onChange={(e) => register.handlePhoneNumberChange(e.target.value)}
                                    className="authInput"/>
                                {register.errorPhoneNumber && <p className="errorText">{register.errorPhoneNumber}</p>}

                                <label>Địa Chỉ: </label>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={register.address}
                                    onChange={(e) => register.handleAddressChange(e.target.value)}
                                    className="authInput"/>
                                {register.errorAddress && <p className="errorText">{register.errorAddress}</p>}

                                <label>Ngày tháng năm sinh: </label>
                                <input
                                    type="date"
                                    value={register.dateOfBirth}
                                    onChange={(e) => register.handleDoBChange(e.target.value)}
                                    className="authInput"
                                    max={new Date().toISOString().split("T")[0]} // Chặn ngày lớn hơn hôm nay
                                />
                                {register.errorDoB && <p className="errorText">{register.errorDoB}</p>}
                            </div>
                        </div>
                        <br/>
                        {register.errorGeneral && <p className="errorText">{register.errorGeneral}</p>}
                        <button type="submit" className="authButton" disabled={register.isLoading} >Đăng Kí</button>

                        <span>Đã có tài khoản? <Link to="/login">Đăng Nhập</Link></span>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register