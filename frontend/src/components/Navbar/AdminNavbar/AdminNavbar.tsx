import React from "react";
import { Button, Modal, Avatar } from "antd";
import { LogoutOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import "./adminNavBar.scss";

interface AdminNavbarProps {
  username: string;
  avatarUrl?: string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ username, avatarUrl }) => {
  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk() {
        console.log("User logged out"); // Thay bằng logic đăng xuất thực tế
      },
    });
  };

  return (
    <div className="wrapedStatusbar">
      <nav>
        <a href="#" className="nav-link underline">Categories</a>
        <a href="#" className="notification">
          <BellOutlined className="bell-icon" />
          <span className="num">8</span>
        </a>
        <div className="profile">
          <Avatar 
            src={avatarUrl} 
            icon={!avatarUrl ? <UserOutlined /> : undefined} 
          />
          <span className="username">{username}</span>
        </div>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          className="logout-btn"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </nav>
    </div>
  );
};

export default AdminNavbar;
