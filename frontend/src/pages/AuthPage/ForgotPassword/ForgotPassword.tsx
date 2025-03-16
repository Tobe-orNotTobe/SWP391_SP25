import React from "react";
import { useForgotPassWord } from "./useForgotPassword";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar";
import "../Auth.scss"

const ForgotPassword : React.FC = () => {

    const {email, loading, error, setEmail,handleForgotPasswordSubmit} = useForgotPassWord();

    return(
        <>
            <CustomerNavbar/>
            <div className="authBackGround">
                <div className="authContainer">
                    <h1>Nhập email đã đăng kí</h1>
                    <form onSubmit={handleForgotPasswordSubmit}>
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
            </div>
        </>
    );
}


export default ForgotPassword

