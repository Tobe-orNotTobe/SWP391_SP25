import React from "react";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import UserProfile from "../../../components/UserProfile/UserProfile.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";


const CustomerProfile : React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <UserProfile/>
            <FloatingButtons/>
        </>
    )
}

export default CustomerProfile;