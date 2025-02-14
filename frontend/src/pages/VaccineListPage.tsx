import React from "react";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import FloatingButtons from "../components/FloatingButton/FloatingButtons";
import Footer from "../components/Footer/Footer";
import VaccineList from "../components/Vaccine/VaccineList";

const VaccineListPage : React.FC = () => {
    return(
        <>
            <CustomerNavbar/>
            <VaccineList/>
            <FloatingButtons/>
            <Footer/>        
        </>
    );
}

export default VaccineListPage