import { jwtDecode } from "jwt-decode";
import { TokenResponse } from "../interfaces/Auth";

export const decodeToken = (token: string | null) : TokenResponse | null => {
    if (!token) {
        return null;
    }
    try{
        const decoded : TokenResponse =jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}