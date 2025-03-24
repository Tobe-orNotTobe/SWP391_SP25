import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { apiConfirmEmail } from "../../apis/apiAccount.ts";
import { FaTimesCircle, FaSpinner } from "react-icons/fa";
import "./Confirm.scss";
import { ConfirmEmailRequest } from "../../interfaces/Account.ts";
import LoadingRedirect from "../Loading/LoadingRedirect.tsx";

export const ConfirmEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const [status, setStatus] = useState<string>("Đang xác nhận...");
    const [statusType, setStatusType] = useState<"loading" | "success" | "error">("loading");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
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

                if (!response.isSuccess) {
                    console.log(response.result);
                    setStatus(response.result.message);
                    setStatusType("error"); // Đặt lại thành "error" nếu thất bại
                } else {
                    setStatus("Xác nhận email thành công!");
                    setStatusType("success");
                }
            } catch (error) {
                console.error("API Error:", error);
                setStatus("Lỗi xác nhận! Vui lòng kiểm tra lại.");
                setStatusType("error");
            }
        };

        confirmEmail();

        // Reload trang nếu sau 4 giây vẫn đang ở trạng thái loading
        if (statusType === "loading") {
            const reloadTimeout = setTimeout(() => {
                window.location.reload();
            }, 4000);

            return () => clearTimeout(reloadTimeout);
        }
    }, [statusType]); // Chỉ chạy khi `statusType` là "loading"

    if (statusType === "success") {
        return <LoadingRedirect message={status} delay={3000} to="/login" />;
    }

    return (
        <div className="confirm-container">
            {statusType === "loading" && (
                <div className="status status--loading">
                    <FaSpinner className="status__icon status__icon--spin" />
                    <p className="status__message">{status}</p>
                </div>
            )}
            {statusType === "error" && (
                <div className="status status--error">
                    <FaTimesCircle className="status__icon" />
                    <p className="status__message">{status}</p>
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
        return (
            <LoadingRedirect
                message={`Thanh toán Đăng Kí Tiêm Chủng Thành Công Với Giá Tiền ${Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
                delay={3000}
                to="/booking-history"
            />
        );
    }

    return (
        <div className="confirm-container">
            {statusType === "loading" && (
                <div className="status status--loading">
                    <FaSpinner className="status__icon status__icon--spin" />
                    <p className="status__message">{status}</p>
                </div>
            )}
            {statusType === "error" && (
                <div className="status status--error">
                    <FaTimesCircle className="status__icon" />
                    <p className="status__message">{status}</p>
                </div>
            )}
        </div>
    );
};

export const DepositSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const amount = searchParams.get("amount");

    const [status, setStatus] = useState<string>("Đang xác định giao dịch...");
    const [statusType, setStatusType] = useState<"loading" | "success" | "error">("loading");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const processDeposit = async () => {
            if (!amount) {
                setStatus("Thiếu thông tin số tiền nạp.");
                setStatusType("error");
                return;
            }

            try {
                // Simulate API call with delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                setStatus("Nạp tiền thành công!");
                setStatusType("success");
            } catch (error) {
                console.error("Lỗi xử lý nạp tiền:", error);
                setStatus("Nạp tiền thất bại! Vui lòng thử lại.");
                setStatusType("error");
            }
        };

        processDeposit();
    }, [amount]);

    if (statusType === "success" && amount != null) {
        const formattedAmount = Number(amount)
            .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            .replace("₫", "VND");
        return (
            <LoadingRedirect
                message={`Nạp tiền vào ví thành công với giá tiền ${formattedAmount}`}
                delay={3000}
                to="/customer/wallet"
            />
        );
    }

    return (
        <div className="confirm-container">
            {statusType === "loading" && (
                <div className="status status--loading">
                    <FaSpinner className="status__icon status__icon--spin" />
                    <p className="status__message">{status}</p>
                </div>
            )}
            {statusType === "error" && (
                <div className="status status--error">
                    <FaTimesCircle className="status__icon" />
                    <p className="status__message">{status}</p>
                </div>
            )}
        </div>
    );
};