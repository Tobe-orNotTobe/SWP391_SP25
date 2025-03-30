import React, { useEffect } from "react";
import "./CustomerNavbar.scss";
import logo from "../../../assets/navbar/Logo_Navbar.png";
import { MdOutlineChangeCircle, MdLogin, MdLogout } from "react-icons/md";
import { GiPositionMarker } from "react-icons/gi";
import { FaCalendarAlt, FaUserCircle, FaWallet } from "react-icons/fa";
import { TbMoodKid } from "react-icons/tb";
import { BsCalendar2MinusFill } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully";
import { useWalletUserDetail } from "../../Wallet/useWallet.ts";
import NotificationDropdown from "../../Notification/NotificationDropdown";
import { auth, signOut } from "../../../utils/firebase.ts";

const CustomerNavbar: React.FC = () => {
    const { username, role } = IsLoginSuccessFully();
    const navigate = useNavigate();
    const { walletData, fetchWalletData } = useWalletUserDetail();

    useEffect(() => {
        if (username) {
            fetchWalletData();
        }
    }, [username]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleLogoutGoogle = async () => {
        await signOut(auth);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            <div className="cusTopNavbar">
                <div className="cusTopLogo">
                    <Link to="/homepage">
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>
                <div className="bookingService">
                    <span>
                        <Link to="/booking">
                            <FaCalendarAlt size={22} /> Đăng Kí Tiêm Tại Đây
                        </Link>
                    </span>
                </div>
                <div className="contactInfoTop">
                    <span>
                        <GiPositionMarker size={22} />
                    </span>
                    <p>Lô E2a-7, Đ. D1, Long Thạnh Mỹ, TP.Thủ Đức, HCM</p>
                </div>
                <div className="hotLineTop">
                    <span className="phoneNumber">Hotline: 091 222 4434</span>
                    <span className="timeSchedule">Mở cửa 7h30-17h/ T2-CN xuyên trưa</span>
                </div>
            </div>

            <header className="customerHeader">
                <nav className="mainNavbarContainer">
                    <ul className="cusNavbarLink">
                        <li><Link to="/homepage" className="cusNavItem">Trang Chủ</Link></li>

                        {/* Dropdown for Giới thiệu */}
                        <li className="cusNavDropdown">
                            <Link to="/introduction" className="cusNavItem">Giới thiệu</Link>
                            <ul className="cusNavDropdown-menu">
                                <li><Link to="/introduction/about-us" className="cusNavDropdown-link">Về chúng tôi</Link></li>
                                <li><Link to="/vision" className="cusNavDropdown-link">Lịch sử phát triển</Link></li>
                                <li><Link to="/our-team" className="cusNavDropdown-link">Đội ngũ bác sĩ</Link></li>
                            </ul>
                        </li>

                        <li><Link to="/vaccines-list" className="cusNavItem">Vaccine</Link></li>
                        <li><Link to="/vaccine-packages" className="cusNavItem">Gói Vaccine</Link></li>
                        <li><Link to="/blog" className="cusNavItem">Blog</Link></li>
                        <li><Link to="/news" className="cusNavItem">Tin Tức</Link></li>

                        {/* Dropdown for Cẩm Nang */}
                        <li className="cusNavDropdown">
                            <Link to="/handbook" className="cusNavItem">Cẩm Nang</Link>
                            <ul className="cusNavDropdown-menu">
                                <li><Link to="/handbook/before" className="cusNavDropdown-link">Trước Khi Tiêm Chủng</Link></li>
                                <li><Link to="/handbook/process" className="cusNavDropdown-link">Quy trình tiêm chủng</Link></li>
                                <li><Link to="/handbook/after" className="cusNavDropdown-link">Sau Khi Tiêm Chủng</Link></li>
                            </ul>
                        </li>

                        <li><Link to="/terms" className="cusNavItem">Điều Khoản và Dịch Vụ</Link></li>
                    </ul>
                    <div className="authButtonLink">
                        {username ? (
                            <div className="loggedInUser">
                                {role === 'Customer' && <NotificationDropdown />}
                                <li className="user-dropdown">
                                    <Link to="#" className="user-dropdown-toggle">
                                        <div className="cusNavItem" style={{ display: "flex", alignItems: "center" }}>
                                            <FaUserCircle size={24} style={{ marginRight: "8px" }} />
                                            <span>Xin chào, {role} {username}</span>
                                        </div>
                                    </Link>
                                    <ul className="user-dropdown-menu">
                                        {role === 'Admin' && (
                                            <li>
                                                <Link to="/admin/dashboard" className="user-dropdown-item">
                                                    <MdOutlineChangeCircle size={20} /> Chuyển sang chế độ admin
                                                </Link>
                                            </li>
                                        )}
                                        <li><Link to="/user-profile" className="user-dropdown-item"><ImProfile size={23} /> Thông tin tài khoản</Link></li>
                                        <li><Link to="/my-childs" className="user-dropdown-item"><TbMoodKid size={23} /> Trẻ của bạn</Link></li>
                                        <li><Link to="/booking-history" className="user-dropdown-item"><BsCalendar2MinusFill size={20} /> Lịch sử tiêm</Link></li>
                                        <li>
                                            <Link to="/customer/wallet" className="user-dropdown-item">
                                                <FaWallet size={20} /> Ví Của Bạn
                                                <p style={{ color: "#6d6e70" }}>
                                                    {walletData?.balance
                                                        ? `${new Intl.NumberFormat("vi-VN").format(walletData.balance)} VNĐ`
                                                        : "0 VNĐ"}
                                                </p>
                                            </Link>
                                        </li>
                                        <li>
                                            <span onClick={localStorage.getItem("isGoogleLogin") ? handleLogoutGoogle : handleLogout} className="user-dropdown-item">
                                                <MdLogout size={23} /> Đăng Xuất
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button className="authButton">
                                        <MdLogin size={21} /> Đăng Nhập
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="authButton">
                                        <MdLogin size={21} /> Đăng Kí
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
};

export default CustomerNavbar;