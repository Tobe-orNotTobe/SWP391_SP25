import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { AppstoreOutlined, MedicineBoxOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./ManagerLayout.scss";
import { IsLoginSuccessFully } from "../../validations/IsLogginSuccessfully";
import logo from "../../assets/navbar/Logo_Navbar.png"

const { Header, Sider, Content } = Layout;

const ManagerLayout: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("combo");

  const { username, role } = IsLoginSuccessFully();

  const handleLogout = () => {
    console.log("Đăng xuất...");
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
        <Sider width={250} theme="light">
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={({ key }) => setSelectedMenu(key)}
          >
            <Menu.Item key="combo" icon={<AppstoreOutlined />}>
              Quản lý Combo Vaccine
            </Menu.Item>
            <Menu.Item key="vaccine" icon={<MedicineBoxOutlined />}>
              Quản lý Vaccine
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="content-layout">
          <Content className="content">
            {selectedMenu === "combo" && <h2>Trang Quản lý Combo Vaccine</h2>}
            {selectedMenu === "vaccine" && <h2>Trang Quản lý Vaccine</h2>}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
