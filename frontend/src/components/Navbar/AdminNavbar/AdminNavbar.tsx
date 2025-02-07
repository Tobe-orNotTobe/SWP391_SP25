import React, { useState, ReactNode } from 'react';
import './adminNavbar.scss';

interface AdminNavbarProps {
  children: ReactNode;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('Đăng cẩm nang');

  const tabs: string[] = ['Đăng cẩm nang', 'About', 'Contact'];

  return (
    <div className="custom-layout">
      <aside className="sidebar">
        <div className="logo">
          <h1>Custom Layout</h1>
          <img src="logo.png" alt="Logo" />
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
