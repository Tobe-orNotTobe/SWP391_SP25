import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StaffLayout.scss";
import AdminNavBar from "../../Navbar/AdminNavbar/AdminNavbar";
import logo from "../../../assets/navbar/Logo_Navbar.png";
import { DownOutlined } from "@ant-design/icons";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully";
import { Group } from "../../../interfaces/Layout";

interface CustomLayoutProps {
  children: React.ReactNode;
  groups: Group[]; // Thêm prop groups
}

interface OpenGroupsState {
  [key: string]: boolean; // Sử dụng key động để quản lý trạng thái mở/đóng của các nhóm
}

const StaffLayout: React.FC<CustomLayoutProps> = ({ children, groups }) => {
  const navigate = useNavigate();
  const { username } = IsLoginSuccessFully();
  const [activeTab, setActiveTab] = useState<string>("/post-guide");
  //const [openGroups, setOpenGroups] = useState<OpenGroupsState>({});

  // Khởi tạo trạng thái mở/đóng cho các nhóm
  const initializeOpenGroups = () => {
    const initialState: OpenGroupsState = {};
    groups.forEach((group, index) => {
      initialState[`group${index}`] = index === 0; // Mặc định mở nhóm đầu tiên
    });
    return initialState;
  };

  const [openGroups, setOpenGroups] = useState<OpenGroupsState>(
    initializeOpenGroups()
  );

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebarlogo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="nav">
          {groups.map((group, index) => (
            <div className="nav-group" key={`group${index}`}>
              <div
                className="nav-group-header"
                onClick={() => toggleGroup(`group${index}`)}
              >
                <h3 className="nav-group-title">{group.title}</h3>
                <DownOutlined
                  className={`nav-group-item ${
                    openGroups[`group${index}`] ? "open" : ""
                  }`}
                />
              </div>
              {openGroups[`group${index}`] && (
                <ul>
                  {group.items.map((item) => (
                    <li
                      key={item.path}
                      className={activeTab === item.path ? "active" : ""}
                    >
                      <a onClick={() => handleNavigation(item.path)}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="main">
        <AdminNavBar username={username} avatarUrl={""} />
        <div className="content">{children}</div>
      </main>
    </div>
  );
};

export default StaffLayout;