import { jwtDecode } from "jwt-decode";
import {TokenDecode} from "../interfaces/Auth";

export const decodeToken = (token: string | null) : TokenDecode | null => {
    if (!token) {
        return null;
    }
    try{
        return jwtDecode(token);
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}