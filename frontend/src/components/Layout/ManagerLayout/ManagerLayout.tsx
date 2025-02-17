import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { AppstoreOutlined, MedicineBoxOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./ManagerLayout.scss";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully.ts";
import logo from "../../../assets/navbar/Logo_Navbar.png";
import { GoPackage } from "react-icons/go";

const { Header, Sider, Content } = Layout;

// Explicitly define the children prop type
interface ManagerLayoutProps {
  children: React.ReactNode; // This allows any valid React node
}

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState<string>("combo");

  const { username, role } = IsLoginSuccessFully();

  const handleLogout = () => {
    window.localStorage.clear();
  };

  return (
      <Layout className="manager-layout">
        <Header className="manager-header">
          <Link to="/manager/dashboard" className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          <div className="header-right">
            <UserOutlined className="user-icon" />
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
            >
              <Menu.Item key='mamaner-dashboard' icon={<AppstoreOutlined/>}>
                <Link to="/manager/dashboard" >Trang Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="comboVaccine" icon={<GoPackage/>}>
                <Link to="/manager/comboVaccine">Quản lý Combo Vaccine</Link>
              </Menu.Item>
              <Menu.Item key="vaccine" icon={<MedicineBoxOutlined />}>
                <Link to="/manager/vaccine">Quản lý Vaccine</Link>
              </Menu.Item>

            </Menu>
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
