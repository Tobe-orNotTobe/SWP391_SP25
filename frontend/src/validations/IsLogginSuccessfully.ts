import { useState } from "react"
import { decodeToken } from "../utils/decodeToken";

export const IsLoginSuccessFully = () => {

    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");


    const token = localStorage.getItem("token");

    const decodedToken = decodeToken(token);

    if(decodedToken) {
        setRole(decodedToken.role);
        setUsername(decodedToken.sub);
    } else {
        console.log("Token khong hop le")
    }

    return {username, role}

}