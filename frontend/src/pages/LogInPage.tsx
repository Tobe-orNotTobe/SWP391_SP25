import React from "react";

import Login from "../components/Auth/Login";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";


const LogInPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <Login/>
        </>
    );
}
export default LogInPage