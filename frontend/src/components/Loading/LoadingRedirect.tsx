import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { LoadingRedirectProps } from "../../interfaces/Decorative";
import "./LoadingRedirect.scss"

const LoadingRedirect : React.FC<LoadingRedirectProps> = ({message, delay, to}) => {

    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(delay / 1000); 

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            navigate(to);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [navigate, to, delay]);

    return(
        <>
             <div className="loadingScreen">
                <h2>{message}</h2>
                <p>Chuyển hướng sau {countdown} giây...</p>
                <div className="loadingSpinner"></div>
            </div>       
        </>
    );

}

export default LoadingRedirect