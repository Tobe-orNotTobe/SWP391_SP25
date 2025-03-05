import React from "react"
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Feedback from "../../components/Feedback/Feedback.tsx";

const FeedbackPage: React.FC = () => {
    return (
      <>
            <CustomerNavbar/>
            <Feedback/>
            <FloatingButtons/>
            <Footer/>
      </>
    );
}

export default FeedbackPage;