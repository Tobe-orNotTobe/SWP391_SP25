import React from "react";
import { useVerifyOTP } from "../../hooks/useAuth";

const VerifyOTP : React.FC = () => {

    const OTP = useVerifyOTP();

    return(
        <>
            <div className="authContainer">
                <form onSubmit={OTP.handleVerifyOTPSubmit} className="registerForm">
                    <h1> Hãy Nhập OTP đã gửi qua email </h1>
                    <input 
                        type="text" 
                        placeholder="Nhập OTP" 
                        value={OTP.otp} 
                        onChange={(e) => OTP.setOTP(e.target.value)}  
                        className="authInput" 
                    />
                    {OTP.error && <p className="errorText">{OTP.error}</p>}
                    <button type="submit" className="authButton" disabled={OTP.loading}>
                        {OTP.loading ? "Đang Đăng Nhập..." : "Đăng Nhập"}
                    </button>
                </form>
                
            </div>
        
        </>
    );
}

export default VerifyOTP