import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { AppstoreOutlined, MedicineBoxOutlined,  LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./ManagerLayout.scss";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully.ts";
import logo from "../../../assets/navbar/Logo_Navbar.png";
import { GoPackage } from "react-icons/go";
import { MdOutlineCalendarToday } from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import {GrUserManager} from "react-icons/gr";

const { Header, Sider, Content } = Layout;


interface ManagerLayoutProps {
  children: React.ReactNode; 
}

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState<string>("combo");

  const { username, role } = IsLoginSuccessFully();

  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.clear();
    navigate("/homepage");
  };

 
  const menuItems = [
    {
      key: 'mamaner-dashboard',
      icon:<AppstoreOutlined />,
      label: <Link to="/manager/dashboard">Trang Dashboard</Link>
    },
    {
      key: 'manager-profile',
      icon:  <CiUser/>,
      label: <Link to="/manager/profile">Thông tin cá nhân</Link>
    },
    {
      key: 'comboVaccine',
      icon: <GoPackage />,
      label: <Link to="/manager/combo-vaccines">Quản lý Combo Vaccine</Link>
    },
    {
      key: 'vaccine',
      icon: <MedicineBoxOutlined />,
      label: <Link to="/manager/vaccines">Quản lý Loại Vaccine</Link>
    },
    {
      key: 'vaccine-schedule',
      icon: <MdOutlineCalendarToday/>,
      label: <Link to="/manager/schedule-vaccines">Quản lý Lịch Tiêm Cho Vaccine</Link>
    },
    {
      key: 'inventory-vaccines',
      icon: <MdOutlineInventory2 />,
      label: <Link to="/manager/inventory-vaccines">Quản lý Vacine trong kho</Link>,
    }
  ];

  return (
      <Layout className="manager-layout">
        <Header className="manager-header">
          <Link to="/manager/dashboard" className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          <div className="header-right">
            <GrUserManager className="user-icon" />
            <span className="user-info">Xin chào {role} {username}</span>

            <Button
                type="primary"
                icon={<LogoutOutlined />}
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

export default ManagerLayout;