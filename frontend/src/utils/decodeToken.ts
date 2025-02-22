import { jwtDecode } from "jwt-decode";
import { TokenResponse } from "../types/Auth";

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