import FloatingButtons from "../components/FloatingButton/FloatingButtons";
import Footer from "../components/Footer/Footer";
import Home from "../components/Home/Home";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";

const HomePage : React.FC = () =>{
    return(
        <>    
            <CustomerNavbar/>       
            <Home/>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default HomePage