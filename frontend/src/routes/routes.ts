// routes.ts
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const getAuth = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return { token, role };
};

// PublicRoute: Cho phép truy cập nếu không có token hoặc role không phải Staff, Doctor, Manager
export const PublicRoute = () => {
    const { token, role } = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const redirectMap: { [key: string]: string } = {
                Staff: "/",
                Manager: "/manager/dashboard",
                Doctor: "/",
            };
            if (role && redirectMap[role]) {
                navigate(redirectMap[role]);
            }
        }
    }, [token, role, navigate]);

    return ;
};

// NoAuthRoute: Không cho phép truy cập nếu đã có token
export const NoAuthRoute = () => {
    const { token, role } = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const redirectMap: { [key: string]: string } = {
                Customer: "/homepage",
                Admin: "/homepage",
                Manager: "/manager/dashboard",
                Staff: "/",
                Doctor: "/",
            };
            if (role && redirectMap[role]) {
                navigate(redirectMap[role]);
            }
        }
    }, [token, role, navigate]);

    return;
};

// ProtectedRoute: Chỉ cho phép truy cập nếu có token và role hợp lệ
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { token, role } = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || (allowedRoles && !allowedRoles.includes(role || ""))) {
            navigate("/login");
        }
    }, [token, role, allowedRoles, navigate]);

    return ;
};
