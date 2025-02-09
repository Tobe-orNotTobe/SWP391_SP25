import FloatingButtons from "../components/FloatingButton/FloatingButtons";
import Footer from "../components/Footer/Footer";
import {Introduction, AboutUs, OurTeam} from "../components/Introduction/Introduction.tsx";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";
import React from "react"

export const IntroductionPage: React.FC = () => {
    return (
      <>
        <CustomerNavbar/>
          <Introduction/>
          <FloatingButtons/>
          <Footer/>
      </>
    );
}

export const AboutUsPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <AboutUs/>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export const OurTeamPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <OurTeam/>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}
