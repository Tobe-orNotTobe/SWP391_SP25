import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import ResetPassword from "../components/Auth/ResetPassword";

const ResetPasswordPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <ResetPassword/>
        </>
    )

}

export default ResetPasswordPage