import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import LoadingRedirect from "../Loading/LoadingRedirect.tsx";
import "./Failure.scss"

type StatusType = "loading" | "error";

const Failure: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const errorCode = searchParams.get("errorCode");
    const isWalletFailure = window.location.pathname.includes("wallet/deposit-failure");

    const [status, setStatus] = useState<string>("Đang xử lý...");
    const [statusType, setStatusType] = useState<StatusType>("loading");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const processFailure = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (errorCode) {
                setStatus(`Giao dịch thất bại! Mã lỗi: ${errorCode}`);
            } else {
                setStatus("Giao dịch thất bại! Vui lòng thử lại.");
            }
            setStatusType("error");
        };

        processFailure();
    }, [errorCode]);

    // Use LoadingRedirect when statusType is error
    if (statusType === "error") {
        return <LoadingRedirect
            message={isWalletFailure
                ? "Nạp tiền thất bại, bạn sẽ được chuyển hướng..."
                : `Thanh toán thất bại cho đơn hàng ${orderId}, bạn sẽ được chuyển hướng...`}
            delay={3000}
            to={isWalletFailure ? "/customer/wallet" : "/booking-history"}
        />;
    }

    // This will only render when statusType is "loading"
    return (
        <div className="failure-container">
            <div className="failure-status failure-status--loading">
                <FaSpinner className="failure-status__icon failure-status__icon--spin" />
                <p className="failure-status__message">{status}</p>
            </div>
        </div>
    );
};

export default Failure;