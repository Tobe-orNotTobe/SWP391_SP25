import React from "react";
import { Link } from "react-router-dom";
import { useLoginGoogle, useRegister } from "../../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";


const Register: React.FC = () => {
    const register = useRegister();
    const {handleGoogleLogin} = useLoginGoogle();

  
    return (
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
                            className="authInput"/>
                        {register.errorDoB && <p className="errorText">{register.errorDoB}</p>}
                    </div>
                </div>
                <br/>
                {register.errorGeneral && <p className="errorText">{register.errorGeneral}</p>}
                <button type="submit" className="authButton" >Đăng Kí</button>

                <div className="divider">
                                <span>hoặc</span>
                            </div>
                
                            <div className="authSocialContainer">
                                <button type="button" className="googleButton" onClick={handleGoogleLogin}>
                                    <FcGoogle className="googleIcon" />
                                    Đăng nhập với Google
                                </button>
                            </div>
                
                <span>Đã có tài khoản? <Link to="/login">Đăng Nhập</Link></span>
            </form>
        </div>
    );
}

export default Register;
