import React from "react";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import {Link} from "react-router-dom";
import "./Handbook.scss"

const BeforeHandbook : React.FC = () => {
    return (
        <>
            <CustomerNavbar/>|
            <div className="Handbook-container">
                <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link>
                <span className="separator"> » </span>
                <Link style={{textDecoration: "none", color: "#2A388F"}} to="#">Cẩm Nang</Link>
                <span className="separator"> » </span>
                <span>Những Điều Cần Biết Trước Khi Tiêm</span>

                <div style={{paddingTop: "20px"}} className="introductionTitle">
                    <h1 className="gt-title">Những Điều Cần Biết Trước Khi Tiêm</h1>
                </div>

                <h3 style={{textDecoration : "none"}}>Khám Sàn Lọc Trước Khi Tiêm Chủng</h3>

            </div>


            <Footer/>
        </>
    )
}
export default BeforeHandbook;