import React from "react";
import { Button, Modal, Avatar } from "antd";
import {
  LogoutOutlined,
  BellOutlined,
  UserOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import "./adminNavBar.scss";
import { Link } from "react-router-dom";
import { MdLogin, MdLogout } from "react-icons/md";

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
        localStorage.clear();
        window.location.reload();
      },
    });
  };

  return (
    <div className="wrapedStatusbar">
      <nav>
        <a href="#" className="nav-link underline">
          Categories
        </a>
        <a href="#" className="notification">
          <BellOutlined className="bell-icon" />
          <span className="num">8</span>
        </a>
        <div className="profile">
          <Avatar
            src={avatarUrl}
            icon={<UserOutlined />}
          />
          <span className="username">{username}</span>
        </div>
        <Link to="/login">
          <Button type="primary" className="login-btn">
            <MdLogin size={21} /> Đăng nhập
          </Button>
        </Link>

        <Button type="primary" className="logout-btn" onClick={handleLogout}>
          <MdLogout size={21} />
          Đăng xuất
        </Button>
      </nav>
    </div>
  );
};

export default AdminNavbar;
