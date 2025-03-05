import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { apiConfirmEmail } from "../../apis/apiAuth.ts";
import { FaTimesCircle, FaSpinner } from "react-icons/fa";
import "./Confirm.scss";
import { ConfirmEmailRequest } from "../../interfaces/Auth.ts";
import LoadingRedirect from "../Loading/LoadingRedirect.tsx";



export const ConfirmEmail : React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const [status, setStatus] = useState<string>("Đang xác nhận...");
    const [statusType, setStatusType] = useState<"loading" | "success" | "error">("loading");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        const confirmEmail = async () => {
            if (!email || !token) {
                setStatus("Thiếu email hoặc token.");
                setStatusType("error");
                return;
            }

            const data: ConfirmEmailRequest = { email, token };

            try {
                const response = await apiConfirmEmail(data);

                if (!response.isSuccess) {
                    console.log(response.result);
                    setStatus(response.result.message);
                    setStatusType("success");
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

export const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    const [status, setStatus] = useState<string>("Đang xử lý thanh toán...");
    const [statusType, setStatusType] = useState<"loading" | "success" | "error">("loading");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const processPayment = async () => {
            if (!orderId || !amount) {
                setStatus("Thiếu thông tin đơn hàng hoặc số tiền.");
                setStatusType("error");
                return;
            }

            try {
                await new Promise(resolve => setTimeout(resolve, 2000));

                setStatus("Thanh toán thành công!");
                setStatusType("success");


            } catch (error) {
                console.error("Lỗi xử lý thanh toán:", error);
                setStatus("Thanh toán thất bại! Vui lòng thử lại.");
                setStatusType("error");
            }
        };

        processPayment();
    }, [orderId, amount]);

    if (statusType === "success") {
        return <LoadingRedirect
            message={`Thanh toán Đăng Kí Tiêm Chủng Thành Công Với Giá Tiền ${amount}`}
            delay={5000}
            to="/booking-history"
        />;
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




