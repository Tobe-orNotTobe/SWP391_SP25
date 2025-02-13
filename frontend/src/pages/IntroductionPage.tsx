import FloatingButtons from "../components/FloatingButton/FloatingButtons";
import Footer from "../components/Footer/Footer";
import {Introduction, Vision, Mission, OurTeam} from "../components/Introduction/Introduction.tsx";
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

export const VisionPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <Vision/>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export const MissionPage: React.FC = () => {
    return (
        <>
            <CustomerNavbar/>
            <Mission/>
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
