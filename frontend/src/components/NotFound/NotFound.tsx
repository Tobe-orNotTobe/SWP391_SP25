
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.scss"
import CustomerNavbar from "../Navbar/CustomerNavbar/CustomerNavbar";

const NotFoundPage : React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
        <CustomerNavbar/>
        <div className="not-found-container">
            <h1 className="not-found-error-code">404</h1>
            <p className="not-found-error-message">Page not found</p>
            <button className="not-found-home-button" onClick={() => navigate("/")}>Go to Homepage</button>
        </div>
    
    </>
    
  );
};

export default NotFoundPage;
