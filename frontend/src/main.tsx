import  { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {ToastContainer, Zoom} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TokenExpiryAlert from "./validations/TokenExpiryAlert.tsx";
import "./App.scss"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <TokenExpiryAlert/>
    <App />
      <ToastContainer
          position="top-center"
          autoClose={2500}
          limit={1}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Zoom}
          closeButton={false}
      />
  </StrictMode>,
)
