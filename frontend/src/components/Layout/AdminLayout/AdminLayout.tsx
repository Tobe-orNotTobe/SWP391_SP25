import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { AppstoreOutlined, MedicineBoxOutlined,LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLayout.scss";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully.ts";
import logo from "../../../assets/navbar/Logo_Navbar.png";
import { GoPackage } from "react-icons/go";
import {MdOutlineCalendarToday, MdOutlineChangeCircle} from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import {CiUser} from "react-icons/ci";
import {IoWalletOutline} from "react-icons/io5";
import {RiAdminLine} from "react-icons/ri";

const { Header, Sider, Content } = Layout;


interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState<string>("combo");

    const { username, role } = IsLoginSuccessFully();

    const navigate = useNavigate();

    const handleLogout = () => {
        window.localStorage.clear();
        navigate("/login");
    };

    const handleChangeUser = () =>{
        navigate("/homepage");
    }


    const menuItems = [
        {
            key: 'admin-dashboard',
            icon: <AppstoreOutlined />,
            label: <Link to="/admin/dashboard">Trang Dashboard</Link>
        },
        {
            key: 'admin-profile',
            icon:  <CiUser/>,
            label: <Link to="/admin/profile">Thông tin cá nhân</Link>
        },
        {
            key: 'admin-wallet',
            icon: <IoWalletOutline/>,
            label: <Link to="/admin/wallet">Quản lý Ví Admin</Link>
        },
        {
            key: 'account',
            icon: <GoPackage />,
            label: <Link to="/admin/account">Quản lý Account</Link>
        },
        {
            key: 'blog',
            icon: <MedicineBoxOutlined />,
            label: 'Quản lý Blog',  // Không dùng <Link> ở đây vì nó có submenu
            children: [
                {
                    key: 'blog-list',
                    label: <Link to="/admin/blog">Danh sách Blog</Link>,
                },
                {
                    key: 'blog-deactive',
                    label: <Link to="/admin/blog/deactive">Chờ xét duyệt</Link>,
                },
            ],
        },
        {
            key: 'vaccine-schedule',
            icon: <MdOutlineCalendarToday/>,
            label: <Link to="/admin/booking">Quản lý Lịch Tiêm</Link>
        },
        {
            key: 'feedback',
            icon: <MdOutlineInventory2 />,
            label: <Link to="/admin/feedback">Quản lý Feedback</Link>,
        }
    ];

    return (
        <Layout className="admin-layout">
            <Header className="admin-header">
                <Link to="/admin/dashboard" className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>

                <div className="header-right">
                    <RiAdminLine className="user-icon" />
                    <span className="user-info">Xin chào {role} {username}</span>
                    <Button
                        type="primary"
                        icon={<MdOutlineChangeCircle size={20}/>}
                        onClick={handleChangeUser}
                        className="change-user-button"
                    >
                        Chế độ người dùng
                    </Button>
                    <Button
                        type="primary"
                        icon={<LogoutOutlined  size={20}/>}
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Đăng xuất
                    </Button>
                </div>
            </Header>

            <Layout>
                <Sider width={300} theme="light" className="sider">
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        onClick={({ key }) => setSelectedMenu(key)}
                        items={menuItems}
                    />
                </Sider>

                <Layout className="content-layout">
                    <Content className="content">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;