import React from "react";
import './CustomerNavbar.scss';
import logo from "../../../assets/navbar/Logo_Navbar.png";

import { GiPositionMarker } from "react-icons/gi";
import { Button } from "antd";
import { MdLogin } from "react-icons/md";

const CustomerNavbar: React.FC = () => {
    return (
        <header className="customerHeader">
            <div className="cusTopNavbar">
                <div className="cusTopLogo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="contactInfoTop">
                    <span><GiPositionMarker size={22} /></span>
                    <p>Lô E2a-7, Đ. D1, Long Thạnh Mỹ, TP.Thủ Đức, HCM</p>
                </div>
                <div className="hotLineTop">
                    <span className="phoneNumber">Hotline: 091 222 4434</span>
                    <span className="timeSchedule">Mở cửa 7h30-17h/ T2-CN xuyên trưa</span>
                </div>
            </div>
            <nav className="mainNavbarContainer">
                <ul className="cusNavbarLink">
                    <li><a href="#" className="cusNavItem">Trang Chủ</a></li>
                    <li><a href="#" className="cusNavItem">Giới Thiệu</a></li>
                    <li><a href="#" className="cusNavItem">Vaccine </a></li>
                    <li><a href="#" className="cusNavItem">Gói Vaccine </a></li>
                    <li><a href="#" className="cusNavItem">Cẩm Nang</a></li>
                    <li><a href="#" className="cusNavItem">Điều Khoản và Dịch Vụ</a></li>
                    <li><a href="#" className="cusNavItem">Tin Tức</a></li>                
                </ul>
                <div className="authButtonLink">
                    <Button className="authButton">
                        <MdLogin size={23} />Đăng Nhập 
                    </Button>
                    <Button className="authButton">
                        <MdLogin size={23} />Đăng Kí 
                    </Button>
                </div>
            </nav>
        </header>
    );
};

export default CustomerNavbar;
