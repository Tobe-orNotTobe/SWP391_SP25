import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";
import { apiRefreshToken } from "../apis/apiAccount.ts";


export const IsLoginSuccessFully = () => {
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [sub, setSub] = useState<string>("");
    const [showSessionAlert, setShowSessionAlert] = useState<boolean>(false);


    const refreshUserSession = async () => {
        const token = localStorage.getItem("token");

        const refreshToken = localStorage.getItem("refreshToken");

        if (token) {
            try {
                const newTokenData = await apiRefreshToken(refreshToken);
                if (newTokenData?.isSuccess) {
                    setShowSessionAlert(false);
                    localStorage.setItem("token", newTokenData.result.token);
                    localStorage.setItem("refreshToken", newTokenData.result.refeshToken);

                    const newDecodedToken = decodeToken(newTokenData.token);
                    if (newDecodedToken) {
                        const newUserRole = newDecodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                        const newUserName = newDecodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

                        setRole(newUserRole);
                        setUsername(newUserName);
                        localStorage.setItem("role", newUserRole);


                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);

                        return true;
                    }
                }
            } catch (error) {
                console.log("Lỗi khi làm mới token:", error);
                return false;
            }
        } else {
            console.log("Không có refreshToken để làm mới token");
            // handleLogout();
            return false;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");

        window.location.href = "/login";
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                const decodedToken = decodeToken(token);
                if (decodedToken) {
                    const expTime = decodedToken.exp * 1000;
                    const currentTime = Date.now();

                    if (currentTime >= expTime) {
                        // Show session expired alert instead of automatic refresh
                        setShowSessionAlert(true);
                    } else {
                        // Token vẫn hợp lệ
                        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                        const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                        const userSub = decodedToken.sub;

                        setRole(userRole);
                        setUsername(userName);
                        setSub(userSub);

                        localStorage.setItem("role", userRole);

                        // Set up a timer to check when the token is about to expire
                        const timeUntilExpiry = expTime - currentTime;
                        if (timeUntilExpiry > 0) {
                            // Show alert 1 minute before expiration
                            const alertTimeout = setTimeout(() => {
                                setShowSessionAlert(true);
                            }, timeUntilExpiry - 60000); // 60000ms = 1 minute

                            return () => clearTimeout(alertTimeout);
                        }
                    }
                } else {
                    console.log("Token không hợp lệ");
                }
            }
        };

        checkToken();
    }, []);

    return {
        username,
        role,
        sub,
        showSessionAlert,
        setShowSessionAlert,
        refreshUserSession,
        handleLogout
    };
};