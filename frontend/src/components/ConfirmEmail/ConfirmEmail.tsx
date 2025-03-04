import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { apiConfirmEmail } from "../../apis/apiAuth.ts";
import { FaTimesCircle, FaSpinner } from "react-icons/fa";
import "./ConfirmEmail.scss";
import { ConfirmEmailRequest } from "../../interfaces/Auth.ts";
import LoadingRedirect from "../Loading/LoadingRedirect.tsx";

const ConfirmEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const [status, setStatus] = useState<string>("Đang xác nhận...");
    const [statusType, setStatusType] = useState<"loading" | "success" | "error">("loading");
    const hasRun = useRef(false); // Ngăn `useEffect` chạy lại

    useEffect(() => {
        if (hasRun.current) return; // Ngăn không chạy lần 2
        hasRun.current = true;

        const confirmEmail = async () => {
            if (!email || !token) {
                setStatus("Thiếu email hoặc token.");
                setStatusType("error");
                return;
            }

            const data: ConfirmEmailRequest = { email, token };

            try {
                const response = await apiConfirmEmail(data);

                if (response.isSuccess) {
                    setStatus(response.result.message);
                    setStatusType("success");
                }else if (response.error){
                    setStatus("Xác nhận thất bại! Vui lòng thử lại.");
                    setStatusType("error");
                }
            } catch (error) {
                console.error("API Error:", error);
                setStatus("Lỗi xác nhận! Vui lòng kiểm tra lại.");
                setStatusType("error");
            }
        };

        confirmEmail();
    }, []);

    if (statusType === "success") {
        return <LoadingRedirect message={status} delay={5000} to="/login" />;
    }

    return (
        <div className="confirm-email">
            {statusType === "loading" && (
                <div className="status status--loading">
                    <FaSpinner className="status__icon status__icon--spin" />
                    <span>{status}</span>
                </div>
            )}
            {statusType === "error" && (
                <div className="status status--error">
                    <FaTimesCircle className="status__icon" />
                    <span>{status}</span>
                </div>
            )}
        </div>
    );
};

export default ConfirmEmail;
