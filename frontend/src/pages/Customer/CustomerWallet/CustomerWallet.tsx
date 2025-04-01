import React from "react";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import Wallet from "../../../components/Wallet/Wallet.tsx";

const CustomerWallet : React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <Wallet/>
            <FloatingButtons/>
            <Footer/>

        </>
    )
}

export default CustomerWallet;