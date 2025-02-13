import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import ResetPassword from "../components/Auth/ResetPassword";
import ForgotPassword from "../components/Auth/ForgotPassword";



export const ForgotPasswordPage : React.FC = () => {
    return(
        <>
            <CustomerNavbar/>
            <ForgotPassword/>      
        </>
    );
}




export const ResetPasswordPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <ResetPassword/>
        </>
    )

}
