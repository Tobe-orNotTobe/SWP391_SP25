import Footer from "../../components/Footer/Footer";
import FloatingButtons from "../../components/FloatingButton/FloatingButtons";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar";
import Payment from "../../components/Transaction/Transaction";

const TransactionPage : React.FC = () =>{
    return(
        <>    
            <CustomerNavbar/>       
            <Payment/>
            <FloatingButtons/>
            <Footer/>
        </>
    );
}

export default TransactionPage