import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import Register from "../components/Auth/Register";

const RegisterPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <Register/>
        </>
    );
}

export default RegisterPage