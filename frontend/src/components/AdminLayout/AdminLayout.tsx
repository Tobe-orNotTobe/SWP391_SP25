// import React, { useState } from "react";
// import "./adminLayout.scss";
// import AdminNavBar from "../Navbar/AdminNavbar/AdminNavbar";
// import logo from "../../assets/navbar/Logo_Navbar.png";
// import { DownOutlined } from "@ant-design/icons";
//
// interface CustomLayoutProps {
//   children: React.ReactNode;
// }
//
// interface OpenGroupsState {
//   management: boolean;
//   posting: boolean;
//   vaccination: boolean;
// }
//
// // Mock user dữ liệu giả lập
// const mockUser = {
//   username: "Nguyễn Văn A",
//   avatarUrl: "", // Để trống sẽ hiển thị Avatar mặc định của Ant Design
// };
//
// const AdminLayout: React.FC<CustomLayoutProps> = ({ children }) => {
//   const [activeTab, setActiveTab] = useState<string>("Đăng cẩm nang");
//   const [openGroups, setOpenGroups] = useState<OpenGroupsState>({
//     management: true,
//     posting: false,
//     vaccination: false,
//   });
//
//   const toggleGroup = (group: keyof OpenGroupsState) => {
//     setOpenGroups((prev) => ({
//       ...prev,
//       [group]: !prev[group],
//     }));
//   };
//
//   return (
//     <div className="custom-layout">
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <div className="nav">
//           <div className="nav-group">
//             <div
//               className="nav-group-header"
//               onClick={() => toggleGroup("management")}
//             >
//               <h3 className="nav-group-title">Quản lý</h3>
//               <DownOutlined
//                 className={`nav-group-icon ${
//                   openGroups.management ? "open" : ""
//                 }`}
//               />
//             </div>
//             {openGroups.management && (
//               <ul>
//                 {["Quản lý người dùng", "Quản lý bài viết"].map((tab) => (
//                   <li key={tab} className={activeTab === tab ? "active" : ""}>
//                     <a href="#" onClick={() => setActiveTab(tab)}>
//                       {tab}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//
//           <div className="nav-group">
//             <div
//               className="nav-group-header"
//               onClick={() => toggleGroup("posting")}
//             >
//               <h3 className="nav-group-title">Đăng bài</h3>
//               <DownOutlined
//                 className={`nav-group-icon ${openGroups.posting ? "open" : ""}`}
//               />
//             </div>
//             {openGroups.posting && (
//               <ul>
//                 {["Đăng cẩm nang", "Đăng tin tức"].map((tab) => (
//                   <li key={tab} className={activeTab === tab ? "active" : ""}>
//                     <a href="#" onClick={() => setActiveTab(tab)}>
//                       {tab}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//
//           <div className="nav-group">
//             <div
//               className="nav-group-header"
//               onClick={() => toggleGroup("vaccination")}
//             >
//               <h3 className="nav-group-title">Tiêm chủng</h3>
//               <DownOutlined
//                 className={`nav-group-icon ${
//                   openGroups.vaccination ? "open" : ""
//                 }`}
//               />
//             </div>
//             {openGroups.vaccination && (
//               <ul>
//                 {["Lịch tiêm chủng", "Quản lý vaccine"].map((tab) => (
//                   <li key={tab} className={activeTab === tab ? "active" : ""}>
//                     <a href="#" onClick={() => setActiveTab(tab)}>
//                       {tab}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </aside>
//
//       <main className="main">
//         {/* Truyền mock user vào AdminNavBar */}
//         <AdminNavBar
//           username={mockUser.username}
//           avatarUrl={mockUser.avatarUrl}
//         />
//         <div className="content">{children}</div>
//       </main>
//     </div>
//   );
// };
//
// export default AdminLayout;
