import FloatingButtons from "../components/FloatingButton/FloatingButtons";
import Footer from "../components/Footer/Footer";
import Introduction from "../components/Introduction/Introduction.tsx";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import React from "react"

const IntroductionPage: React.FC = () => {
    return (
      <>
        <CustomerNavbar/>
          <Introduction/>
          <FloatingButtons/>
          <Footer/>
      </>
    );
}

export default IntroductionPage;