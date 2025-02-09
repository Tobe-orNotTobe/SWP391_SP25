import React from "react";
import { useForgotPassWord } from "../../hooks/useAuth";

const ForgotPassword : React.FC = () => {

    const {email, loading, error, setEmail,handleForgotPasswordSubmit} = useForgotPassWord();


    return(
        <>
            <div className="authContainer">
                <h1>Nhập email đã đăng kí</h1>
                <form onClick={handleForgotPasswordSubmit}>
                    <label>Email đã đăng kí: </label>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}  
                        className="authInput"
                        required
                    />
                    {error && <p className="errorText">{error}</p>}
                    <button type="submit" className="authButton" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>
                </form>
            </div>
        </>
    );
}

export default ForgotPassword;