import React from "react";
import styles from "./CustomerNavbar.module.css";
import logo from "../../../assets/navbar/Logo_Navbar.png";

import { GiPositionMarker } from "react-icons/gi";
import { Button } from "antd";
import { MdLogin } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";

const CustomerNavbar: React.FC = () => {
    return (
        <header className={styles.customerHeader}>
            <div className={styles.cusTopNavbar}>
                <div className={styles.cusTopLogo}>
                    <span><img src={logo}/></span>
                </div>
                <div className={styles.contactInfoTop}>
                    <span><GiPositionMarker size={22}/>Lô E2a-7, Đ. D1, Long Thạnh Mỹ, TP.Thủ Đức, HCM</span>
                </div>
                <div className={styles.hotLineTop}>
                    <span className={styles.phoneNumber}>091 222 4434</span>
                    <span className={styles.timeSchedule}>Mở cửa 7h30-17h/ T2-CN xuyên trưa</span>
                </div>
            </div>
            <nav className={styles.mainNavbarContainer}>
                <ul className={styles.cusNavbarLink}>
                    <li><a href="#" className={styles.cusNavItem}>Trang Chủ</a></li>
                    <li><a href="#" className={styles.cusNavItem}>Giới Thiệu</a></li>
                    <li><a href="#" className={styles.cusNavItem}>Vaccine </a></li>
                    <li><a href="#" className={styles.cusNavItem}>Gói Vaccine </a></li>
                    <li><a href="#" className={styles.cusNavItem}>Cẩm Nang</a></li>
                    <li><a href="#" className={styles.cusNavItem}>Điều Khoản và Dịch Vụ</a></li>
                    <li><a href="#" className={styles.cusNavItem}>Tin Tức</a></li>                
                </ul>
                <div className={styles.authButtonLink}>
                    <Button className={styles.authButton}>
                        <MdLogin size={23}/>Đăng Nhập 
                    </Button>
                    <Button className={styles.authButton}>
                        <MdLogin size={23}/>Đăng Kí 
                    </Button>
                    <Button className={styles.authButton}>
                        <AiOutlineSchedule size={23}/>Đặt Lịch Ngay 
                    </Button>
                </div>
            </nav>
        </header>
    );
};

export default CustomerNavbar;
