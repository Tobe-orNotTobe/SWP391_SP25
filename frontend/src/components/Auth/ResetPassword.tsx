import React from "react";
import { useResetPassword } from "../../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const ResetPassword : React.FC = () => {


    const ResetPassword = useResetPassword();

    return(
        <>
            <div className="authContainer">
                <form onSubmit={ResetPassword.handleSubmitResetPassword}>
                    <h1>Đặt Lại Mật Khẩu</h1>                
                    <label>Mật Khẩu: </label>
                    <div className="passwordInputContainer">
                        <input 
                            type={ResetPassword.showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            value={ResetPassword.newPassword}
                            onChange={(e) => ResetPassword.handlePasswordChange(e.target.value)}  
                            className="authInput"/>
                        <span className="eyeIcon" onClick={ResetPassword.togglePasswordVisibility}>
                            {ResetPassword.showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </span>
                    </div>
                    {ResetPassword.errorPassword && <p className="errorText">{ResetPassword.errorPassword}</p>}   
                    <label>Xác Nhận Mật Khẩu: </label>
                    <div className="passwordInputContainer">
                        <input 
                            type={ResetPassword.showPassword ? "text" : "password"} 
                            placeholder="Confirm Password" 
                            value={ResetPassword.confirmPassword} 
                            onChange={(e) => ResetPassword.handleConfirmPasswordChange(e.target.value)}  
                            className="authInput"/>
                        <span className="eyeIcon" onClick={ResetPassword.togglePasswordVisibility}>
                            {ResetPassword.showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </span>
                    </div>
                    {ResetPassword.errorConfirmPassword && <p className="errorText">{ResetPassword.errorConfirmPassword}</p>}  

                    <button type="submit" className="authButton" disabled={ResetPassword.isLoading}>
                    {ResetPassword.isLoading ? "Đang Chờ Xác Nhập..." : "Đổi Mật Khẩu"}
                </button>                   
                </form>
            </div>
        </>
    )
}

export default ResetPassword