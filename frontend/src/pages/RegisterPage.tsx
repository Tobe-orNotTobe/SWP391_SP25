import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import Register from "../components/Auth/Register";
import FloatingButtons from "../components/FloatingButton/FloatingButtons";

const RegisterPage : React.FC = () =>{
    return(
        <>
            <div className="registerBackGround" style={{height:'100vh'}}>
                <CustomerNavbar/>
                <Register/>
                <FloatingButtons/>
            </div>
        </>
    );
}

export default RegisterPage