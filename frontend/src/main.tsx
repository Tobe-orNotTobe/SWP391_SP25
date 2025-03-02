import  { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {Slide, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          draggable
          pauseOnHover
          transition={Slide}
          toastStyle={{
              fontSize: "16px",  // Cỡ chữ
              padding: "20px", // Khoảng cách bên trong
              borderRadius: "99px", // Bo tròn góc
              whiteSpace: "nowrap", // Đảm bảo nội dung hiển thị trên 1 dòng
              overflow: "hidden", // Ẩn phần bị tràn
              textOverflow: "ellipsis",
              textAlign: "center"// Hiển thị "..." nếu nội dung quá dài
          }}
      />
  </StrictMode>,
)
