import React, { useState} from 'react';
import './adminNavbar.scss';
import Logo_Navbar from "../../../assets/navbar/Logo_Navbar.png"
// interface AdminNavbarProps {
//   children: ReactNode;
// }

// const AdminNavbar: React.FC<AdminNavbarProps> = ({ children }) => {
const AdminNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Đăng cẩm nang');

  const tabs: string[] = ['Đăng cẩm nang', 'About', 'Contact'];

  return (
    <div className="custom-layout">
      <aside className="sidebar">
        <div className="logo">
          <h1>Custom Layout</h1>
          <img src={Logo_Navbar} alt="Logo" />
        </div>
        <nav className="nav">
          <ul>
            {tabs.map((tab) => (
              <li key={tab} className={activeTab === tab ? 'active' : ''}>
                <button onClick={() => setActiveTab(tab)}>{tab}</button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdminNavbar;
