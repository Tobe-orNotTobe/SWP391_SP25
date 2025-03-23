import { useNavigate } from "react-router-dom";
import React, { useEffect, ReactNode } from "react";

const getAuth = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return { token, role };
};

// PublicRoute: Cho phép truy cập nếu không có token hoặc role không phải Staff, Doctor, Manager
export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { token, role } = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const redirectMap: { [key: string]: string } = {
                Staff: "/staff/assignDoctor",
                Manager: "/manager/dashboard",
                Doctor: "/doctor/vaccination-schedule",
            };
            if (role && redirectMap[role]) {
                navigate(redirectMap[role]);
            }
        }
    }, [token, role, navigate]);

    return <>{children}</>;
};

// NoAuthRoute: Không cho phép truy cập nếu đã có token
export const NoAuthRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { token, role } = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const redirectMap: { [key: string]: string } = {
                Customer: "/homepage",
                Admin: "/homepage",
                Manager: "/manager/dashboard",
                Staff: "/staff/assignDoctor",
                Doctor: "/doctor/vaccination-schedule",
            };
            if (role && redirectMap[role]) {
                navigate(redirectMap[role]);
            }
        }
    }, [token, role, navigate]);

    return <>{children}</>;
};

// ProtectedRoute: Chỉ cho phép truy cập nếu có token và role hợp lệ
interface ProtectedRouteProps {
    allowedRoles: string[];
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const { token, role } = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !allowedRoles.includes(role || "")) {
            navigate("/login");
        }
    }, [token, role, allowedRoles, navigate]);

    if (!token || !allowedRoles.includes(role || "")) {
        return null; // Có thể thay bằng một component thông báo không có quyền
    }

    return <>{children}</>;
};
