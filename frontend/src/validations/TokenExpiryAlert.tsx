import React from "react";
import { IsLoginSuccessFully } from "./IsLogginSuccessfully.ts"
import "./TokenExpiryAlert.scss"

const SessionExpiryAlert: React.FC = () => {
    const {
        showSessionAlert,
        refreshUserSession,
        handleLogout
    } = IsLoginSuccessFully();

    if (!showSessionAlert) return null;

    return (
        <div className="session-alert-overlay "  >
            <div className="session-alert-container">
                <h3 className="session-alert-title">Phiên đăng nhập đã hết hạn</h3>
                <p className="session-alert-message">Bạn có muốn duy trì phiên đăng nhập không?</p>
                <div className="session-alert-buttons">
                    <button
                        className="session-alert-button session-alert-button--cancel"
                        onClick={handleLogout}
                    >
                        Thoát
                    </button>
                    <button
                        className="session-alert-button session-alert-button--confirm"
                        onClick={refreshUserSession}
                    >
                        Duy trì
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionExpiryAlert;