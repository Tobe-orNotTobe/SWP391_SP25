import FloatingButtons from "../components/FloatingButton/FloatingButtons";
import Footer from "../components/Footer/Footer";
import ChildRegistration from "../components/ChildRegistration/ChildRegistration.tsx";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";

const ChildRegistrationPage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <ChildRegistration/>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default ChildRegistrationPage