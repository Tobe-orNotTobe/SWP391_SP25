import React from "react";
import { Button, Modal, Avatar } from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";
import "./adminNavBar.scss";
import {Link, useNavigate} from "react-router-dom";
import { MdLogin, MdLogout } from "react-icons/md";
import {IsLoginSuccessFully} from "../../../validations/IsLogginSuccessfully.ts";

interface AdminNavbarProps {
  username: string;
  avatarUrl?: string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ username, avatarUrl }) => {

  const {sub} = IsLoginSuccessFully();

  const navigate = useNavigate();
  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk() {
        console.log("User logged out"); // Thay bằng logic đăng xuất thực tế
        localStorage.clear();
        navigate("/login");
      },
    });
  };

  return (
    <div className="wrapedStatusbar">
      <nav>
        <div className="profile">
          <Avatar
            src={avatarUrl}
            icon={<UserOutlined />}
          />
          <span className="username"> {username}</span>
        </div>
        <Link to="/login">
          {!sub && (
              <Button type="primary" className="login-btn">
                <MdLogin size={21} /> Đăng nhập
              </Button>
          )}
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
