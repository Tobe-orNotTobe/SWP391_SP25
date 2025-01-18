import Home from "../components/Home/Home";
import CustomerNavbar from "../components/Navbar/CustomerNavbar/CustomerNavbar";



const HomePage : React.FC = () =>{
    return(
        <>    
            <CustomerNavbar/>       
            <Home/>
        </>
    );
}

export default HomePage