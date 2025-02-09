import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import ForgotPassword from "../components/Auth/ForgotPassword";

const ForgotPasswordPage : React.FC = () => {
    return(
        <>
            <CustomerNavbar/>
            <ForgotPassword/>      
        </>
    );
}

export default ForgotPasswordPage