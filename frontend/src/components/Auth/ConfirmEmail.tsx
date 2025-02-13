import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiConfirmPassword } from "../../apis/apiAuth";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import "./Auth.scss";
import {ConfirmPassWord} from "../../types/Auth.ts";

const ConfirmPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("Đang xác nhận...");
  const [statusType, setStatusType] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const confirmEmail = async () => {
      if (!email || !token) {
        setStatus("Thiếu email hoặc token.");
        setStatusType("error");
        return;
      }

      const data : ConfirmPassWord = {email, token};

      try {
        const response = await apiConfirmPassword(data);

        if (response && response.message) {
          setStatus(response.message);
          setStatusType("success");
        } else {
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
  }, [email, token, navigate]);

  return (
      <div className="confirm-password">
        {statusType === "loading" && (
            <div className="status status--loading">
              <FaSpinner className="status__icon status__icon--spin" />
              <span>{status}</span>
            </div>
        )}
        {statusType === "success" && (
            <div className="status status--success">
              <FaCheckCircle size={40} className="status__icon" />
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

export default ConfirmPassword;
