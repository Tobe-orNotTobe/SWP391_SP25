
import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

export const IsLoginSuccessFully = () => {
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshToken");

            if (token) {
                const decodedToken = decodeToken(token);
                if (decodedToken) {
                    const expTime = decodedToken.exp * 1000; // Chuyển từ giây sang milliseconds
                    const currentTime = Date.now();
                    const userSub = decodedToken.sub;                    if (currentTime >= expTime) {
                        // Token đã hết hạn, gọi API refresh token
                        if (refreshToken) {
                            try {
                                const newTokenData = await apiRefreshToken(refreshToken);
                                if (newTokenData?.token) {
                                    localStorage.setItem("token", newTokenData.token);

                                    const newDecodedToken = decodeToken(newTokenData.token);
                                    if (newDecodedToken) {
                                        const newUserRole = newDecodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                                        const newUserName = newDecodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

                                        setRole(newUserRole);
                                        setUsername(newUserName);
                                        localStorage.setItem("role", newUserRole);
                                    }
                                }
                            } catch (error) {
                                console.log("Lỗi khi làm mới token:", error);
                                localStorage.removeItem("token");
                                localStorage.removeItem("refreshToken");
                            }
                        } else {
                            console.log("Không có refreshToken để làm mới token");
                            localStorage.removeItem("token");
                        }
                    } else {
                        // Token vẫn hợp lệ
                        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                        const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                const userSub = decodedToken.sub;

                        setRole(userRole);
                        setUsername(userName);
                        localStorage.setItem("role", userRole);
                    }
                } else {
                    console.log("Token không hợp lệ");
                }
            }
        };

        checkToken();
    }, []);
                setRole(userRole);
                setUsername(userName);
                setSub(userSub)

                localStorage.setItem("role", userRole);
            } else {
                console.log("Token không hợp lệ");
            }
        }
    }, []);

    return { username, role, sub };
};