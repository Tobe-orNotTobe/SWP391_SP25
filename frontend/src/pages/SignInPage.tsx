import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import Login from "../components/Auth/Login";


const SignInPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <Login/>
        </>
    );
}
export default SignInPage