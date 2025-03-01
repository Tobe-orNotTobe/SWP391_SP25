import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import React from "react";
import "../ChildPage.scss";
import "../useChildPage.ts"
import ChildForm from "../../../components/ChildForm/ChildForm.tsx"

const ChildRegistrationPage: React.FC = () => {

    return (
        <>
            <CustomerNavbar />
            <div className="childRegistrationContainer">
                <ChildForm isUpdate={false}/>
            </div>
            <FloatingButtons/>
            <Footer/>
        </>
    );
};

export default ChildRegistrationPage;
