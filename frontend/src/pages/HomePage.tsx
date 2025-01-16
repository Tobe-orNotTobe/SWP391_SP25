import Footer from "../components/Footer/Footer";
import Home from "../components/Home/Home";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";

const HomePage : React.FC = () =>{
    return(
        <>
            <CustomerNavbar/>
            <Home/>
            <Footer/>       
        </>
    );
}

export default HomePage