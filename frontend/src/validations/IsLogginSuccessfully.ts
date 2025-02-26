
import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

export const IsLoginSuccessFully = () => {
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

                setRole(userRole);
                setUsername(userName);

                localStorage.setItem("role", userRole);
            } else {
                console.log("Token không hợp lệ");
            }
        }
    }, []); 

    return { username, role };
};