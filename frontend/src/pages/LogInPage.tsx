import React from "react";

import Login from "../components/Auth/Login";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import FloatingButtons from "../components/FloatingButton/FloatingButtons";


const LogInPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <Login/>
            <FloatingButtons/>
        </>
    );
}
export default LogInPage