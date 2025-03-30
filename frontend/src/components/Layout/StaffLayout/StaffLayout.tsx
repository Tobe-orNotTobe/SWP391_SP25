import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./StaffLayout.scss";
import AdminNavBar from "../../Navbar/AdminNavbar/AdminNavbar";
import logo from "../../../assets/navbar/Logo_Navbar.png";
import { DownOutlined } from "@ant-design/icons";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully";
import { Group } from "../../../interfaces/Layout";
import { UserProfile } from "../../../interfaces/Account";
import { apiGetProfileUser } from "../../../apis/apiAccount";


interface CustomLayoutProps {
  children: React.ReactNode;
  groups: Group[];
}

interface OpenGroupsState {
  [key: string]: boolean;
}

const StaffLayout: React.FC<CustomLayoutProps> = ({ children, groups }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {sub,username } = IsLoginSuccessFully();

  // Cập nhật trạng thái active tab theo URL
  const [userProfile, setUserProfile] = useState<UserProfile>();

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const userProfileResponse = await apiGetProfileUser();
            const userProfile = userProfileResponse.result

            setUserProfile(userProfile);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    fetchUser();
}, [sub]);

  const initializeOpenGroups = () => {
    const initialState: OpenGroupsState = {};
    groups.forEach((group, index) => {
      initialState[`group${index}`] = group.items.some(
        (item) => item.path === location.pathname
      );
    });
    return initialState;
  };

  const [openGroups, setOpenGroups] = useState<OpenGroupsState>(
    initializeOpenGroups()
  );

  useEffect(() => {
    setOpenGroups(initializeOpenGroups());
  }, [location.pathname]);

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebarlogo">
          <img
            src={logo}
            alt="Logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
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
                      className={
                        location.pathname === item.path ? "active" : ""
                      }
                    >
                      <a onClick={() => handleNavigation(item.path)}>
                        {item.icon && (
                          <span className="nav-item-icon">{item.icon}</span>
                        )}
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
        <AdminNavBar username={username} avatarUrl={userProfile?.imageUrl} />
        <div className="content">{children}</div>
      </main>
    </div>
  );
};

export default StaffLayout;
