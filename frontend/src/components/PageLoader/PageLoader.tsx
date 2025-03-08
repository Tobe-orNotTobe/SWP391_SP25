import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DNA } from "react-loader-spinner";
import "./PageLoader.scss"


const PageLoader: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Lấy thông tin route hiện tại

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 200);

        return () => clearTimeout(timeout);
    }, [location]);

    return loading ? (
        <div className="page-loader-wrapper">
            <div className="page-loader-container">
                <DNA height="80" width="80" ariaLabel="loading" visible={true} />
                <p className="page-loader-text">Loading....</p>
            </div>
        </div>
    ) : null;
};

export default PageLoader;
