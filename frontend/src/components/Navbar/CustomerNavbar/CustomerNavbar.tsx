import React from "react";
import './CustomerNavbar.scss';
import logo from "../../../assets/navbar/Logo_Navbar.png";

import { GiPositionMarker } from "react-icons/gi";
import { Button } from "antd";
import { MdLogin } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

const CustomerNavbar: React.FC = () => {

    return (
        <header className="customerHeader">
            <div className="cusTopNavbar">
                <div className="cusTopLogo">
                    <Link to="/homepage"><img src={logo} alt="Logo" /></Link>
                </div>
                <div className="bookingService">
                    <span><Link to="/booking"><FaCalendarAlt size={22}/>Đăng Kí Tiêm Tại Đây</Link></span>
                </div>
                <div className="contactInfoTop">
                    <span><GiPositionMarker size={22}/></span>
                    <p>Lô E2a-7, Đ. D1, Long Thạnh Mỹ, TP.Thủ Đức, HCM</p>
                </div>
                <div className="hotLineTop">
                    <span className="phoneNumber">Hotline: 091 222 4434</span>
                    <span className="timeSchedule">Mở cửa 7h30-17h/ T2-CN xuyên trưa</span>
                </div>
            </div>
            <nav className="mainNavbarContainer">
                <ul className="cusNavbarLink">
                    <li><Link to="/homepage" className="cusNavItem">Trang Chủ</Link></li>
                    <li className="dropdown">
                        <Link to="/introduction" className="cusNavItem">Giới thiệu</Link>
                        <ul className="dropdown-menu">
                            <li><Link to="/about-us">Về Chúng Tôi</Link></li>
                            <li><Link to="/team">Đội Ngũ</Link></li>
                        </ul>
                    </li>

                    <li><Link to="#" className="cusNavItem">Vaccine </Link></li>
                    <li><Link to="#" className="cusNavItem">Gói Vaccine </Link></li>
                    <li><Link to="#" className="cusNavItem">Tin Tức Và Cẩm Nang</Link></li>
                    <li><Link to="#" className="cusNavItem">Điều Khoản và Dịch Vụ</Link></li>
                    <li><Link to="#" className="cusNavItem">Blog</Link></li>                
                </ul>
                <div className="authButtonLink">
                    
                    <Link to="/login">
                        <Button className="authButton">
                            <MdLogin size={23} /> Đăng Nhập
                        </Button>
                    </Link>
            
                    <Link to="/register">
                        <Button className="authButton">
                            <MdLogin size={23} /> Đăng Kí
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default CustomerNavbar;
