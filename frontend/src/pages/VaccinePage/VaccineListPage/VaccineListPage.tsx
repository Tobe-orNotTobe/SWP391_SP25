import React, {useState} from "react";
import { Link } from "react-router-dom";
import { VaccineCard } from "../../../components/Card/Card.tsx";
import { Row, Col, Pagination } from "antd";
import { useVaccineIntro } from "../../../hooks/useVaccine.ts";
import Footer from "../../../components/Footer/Footer.tsx";
import "./VaccineListPage.scss"
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";

const VaccineListPage : React.FC = () => {

    const { vaccineIntro: vaccineList } = useVaccineIntro();
    
    const [currentPage, setCurrentPage] = useState(1);
    
    const PAGE_SIZE = 12;
    
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const currentVaccines = vaccineList.slice(startIndex, startIndex + PAGE_SIZE);


    return (
        <>
            <CustomerNavbar/>
            
            <div className="vaccineListContainer">
                <span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link><span
                        className="separator"> » </span><span
                        className="last">Thông tin sản phẩm vaccine</span>
                </span>
    
                <div style={{paddingTop: "20px"}} className="vaccineListTitle">
                    <h1 className="gt-title">Thông tin sản phẩm vaccine</h1>  
                </div>
                    
                <div className="vaccineList" style={{marginTop : "10px"}}>
    
                <Row gutter={[16, 16]}>
                    {currentVaccines.map((vaccine) => (
                        <Col key={vaccine.id} xs={24} sm={12} md={8}>
                            <Link to={`/vaccines-list/${vaccine.id}`} style={{ textDecoration: "none" }}>
                                <VaccineCard {...vaccine} />
                            </Link>
                        </Col>
                    ))}
                </Row>
    
                    <Pagination
                        style={{ marginTop: "20px", textAlign: "center" }}
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={vaccineList.length}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
    
            </div>
            <FloatingButtons/>
            <Footer/>
        </>
    );
    
}

export default VaccineListPage