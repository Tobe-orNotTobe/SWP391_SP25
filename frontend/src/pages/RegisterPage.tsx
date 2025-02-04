import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import Register from "../components/Auth/Register";
import FloatingButtons from "../components/FloatingButton/FloatingButtons";

const RegisterPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <Register/>
            <FloatingButtons/>
        </>
    );
}

export default RegisterPage