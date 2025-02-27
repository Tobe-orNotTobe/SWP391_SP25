import FloatingButtons from "../../components/FloatingButton/FloatingButtons";
import Footer from "../../components/Footer/Footer";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar";
import VaccinationRegistration from "../../components/VaccinationRegistration/VaccinationRegistration";

const VaccinationRegistrationPage : React.FC = () =>{
    return(
        <>    
            <CustomerNavbar/>       
            <VaccinationRegistration/>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default VaccinationRegistrationPage