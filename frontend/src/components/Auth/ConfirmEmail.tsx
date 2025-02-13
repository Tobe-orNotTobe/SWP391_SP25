import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {apiConfirmEmail} from "../../apis/apiAuth";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import "./Auth.scss";
import {ConfirmEmailRequest  } from "../../types/Auth.ts";


const ConfirmEmail: React.FC = () => {
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

      const data : ConfirmEmailRequest   = {email, token};

      try {
        const response = await apiConfirmEmail(data);

        if (response.message) {
          setStatus(response.message);
          setStatusType("success");

          setTimeout(() => {
            setStatusType("success");
            navigate("/login");
          }, 3000);

        } else if (response.errors) {
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

export default ConfirmEmail;
