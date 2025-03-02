import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StaffLayout.scss";
import AdminNavBar from "../../Navbar/AdminNavbar/AdminNavbar";
import logo from "../../../assets/navbar/Logo_Navbar.png";
import { DownOutlined } from "@ant-design/icons";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully";

interface CustomLayoutProps {
  children: React.ReactNode;
}

interface OpenGroupsState {
  management: boolean;
  posting: boolean;
  vaccination: boolean;
}

const StaffLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { username } = IsLoginSuccessFully();
  const [activeTab, setActiveTab] = useState<string>("/post-guide");
  const [openGroups, setOpenGroups] = useState<OpenGroupsState>({
    management: true,
    posting: false,
    vaccination: false,
  });

  const toggleGroup = (group: keyof OpenGroupsState) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
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
          <div className="nav-group">
            <div
              className="nav-group-header"
              onClick={() => toggleGroup("management")}
            >
              <h3 className="nav-group-title">Tiêm chủng</h3>
              <DownOutlined
                className={`nav-group-icon ${
                  openGroups.management ? "open" : ""
                }`}
              />
            </div>
            {openGroups.management && (
              <ul>
                {[
                  { label: "Ghi nhận tiêm chủng", path: "/staff/service" },
                  {
                    label: "Lịch tiêm chủng",
                    path: "/staff/vaccination-schedule",
                  },
                ].map((tab) => (
                  <li
                    key={tab.path}
                    className={activeTab === tab.path ? "active" : ""}
                  >
                    <a onClick={() => handleNavigation(tab.path)}>
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="nav-group">
            <div
              className="nav-group-header"
              onClick={() => toggleGroup("posting")}
            >
              <h3 className="nav-group-title">Đăng bài</h3>
              <DownOutlined
                className={`nav-group-icon ${openGroups.posting ? "open" : ""}`}
              />
            </div>
            {openGroups.posting && (
              <ul>
                {[
                  { label: "Đăng cẩm nang", path: "/post-guide" },
                  { label: "Đăng tin tức", path: "/post-news" },
                ].map((tab) => (
                  <li
                    key={tab.path}
                    className={activeTab === tab.path ? "active" : ""}
                  >
                    <a onClick={() => handleNavigation(tab.path)}>
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="nav-group">
            <div
              className="nav-group-header"
              onClick={() => toggleGroup("vaccination")}
            >
              <h3 className="nav-group-title">Tiêm chủng</h3>
              <DownOutlined
                className={`nav-group-icon ${
                  openGroups.vaccination ? "open" : ""
                }`}
              />
            </div>
            {openGroups.vaccination && (
              <ul>
                {[
                  { label: "Lịch tiêm chủng", path: "/vaccination-schedule" },
                  { label: "Quản lý vaccine", path: "/manage-vaccine" },
                ].map((tab) => (
                  <li
                    key={tab.path}
                    className={activeTab === tab.path ? "active" : ""}
                  >
                    <a onClick={() => handleNavigation(tab.path)}>
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      <main className="main">
        {/* Truyền mock user vào AdminNavBar */}
        <AdminNavBar username={username} avatarUrl={""} />
        <div className="content">{children}</div>
      </main>
    </div>
  );
};

export default StaffLayout;
