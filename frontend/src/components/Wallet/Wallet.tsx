import React, {useState} from "react";
import "./Wallet.scss";


const sampleRefundRequests = [
    {
        refundRequestId: 1,
        bookingId: 1,
        amount: 180000,
        reason: "Het Tien Roi",
        status: "Pending",
        createdAt: "2025-03-07T10:28:45.4202848",
        adminNote: "Auto-calculated refund: Full refund (100%) - Cancelled 7 or more days before appointment"
    },
    {
        refundRequestId: 2,
        bookingId: 2,
        amount: 250000,
        reason: "Dich vu khong tot",
        status: "Approved",
        createdAt: "2025-03-05T08:15:32.4202848",
        adminNote: "Customer complaint verified"
    },
    {
        refundRequestId: 3,
        bookingId: 3,
        amount: 120000,
        reason: "Khong hai long",
        status: "Rejected",
        createdAt: "2025-03-04T16:42:18.4202848",
        adminNote: "Service was provided as described"
    }
];

const Wallet : React.FC = () => {

    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [showTopupModal, setShowTopupModal] = useState<boolean>(false);
    const [topupAmount, setTopupAmount] = useState<string>("");

    // Filter refund requests based on selected filter
    const filteredRefundRequests = activeFilter === "All"
        ? sampleRefundRequests
        : sampleRefundRequests.filter(req => req.status === activeFilter);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' VND';
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'status-pending';
            case 'Approved':
                return 'status-approved';
            case 'Rejected':
                return 'status-rejected';
            default:
                return '';
        }
    };

    const handleTopup = (e: React.FormEvent) => {
        e.preventDefault();
        setShowTopupModal(false);
        setTopupAmount("");
        // Wallet balance update will be handled by API in the real implementation
    };
    return (
        <>
            <div className="wallet-page">
                <div className="wallet-container">
                    <div className="wallet-card">
                        <div className="wallet-header">
                            <h1>Ví của tôi</h1>
                            <div className="wallet-balance">
                                <span className="balance-label">Số dư:</span>
                                <span className="balance-amount">500,000 VND</span>
                            </div>
                            <button className="topup-btn" onClick={() => setShowTopupModal(true)}>
                                Nạp tiền
                            </button>
                        </div>
                    </div>

                    <div className="refund-section">
                        <h2>Lịch sử yêu cầu hoàn tiền</h2>

                        <div className="filter-buttons">
                            <button
                                className={activeFilter === "All" ? "active" : ""}
                                onClick={() => setActiveFilter("All")}
                            >
                                Tất cả
                            </button>
                            <button
                                className={activeFilter === "Pending" ? "active" : ""}
                                onClick={() => setActiveFilter("Pending")}
                            >
                                Đang chờ
                            </button>
                            <button
                                className={activeFilter === "Approved" ? "active" : ""}
                                onClick={() => setActiveFilter("Approved")}
                            >
                                Đã duyệt
                            </button>
                            <button
                                className={activeFilter === "Rejected" ? "active" : ""}
                                onClick={() => setActiveFilter("Rejected")}
                            >
                                Đã từ chối
                            </button>
                        </div>

                        <div className="refund-table-container">
                            <table className="refund-table">
                                <thead>
                                <tr>
                                    <th>Mã yêu cầu</th>
                                    <th>Mã đặt</th>
                                    <th>Số tiền</th>
                                    <th>Lý do</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Ghi chú</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredRefundRequests.map((request) => (
                                    <tr key={request.refundRequestId}>
                                        <td>#{request.refundRequestId}</td>
                                        <td>#{request.bookingId}</td>
                                        <td className="amount">{formatCurrency(request.amount)}</td>
                                        <td>{request.reason}</td>
                                        <td>
                      <span className={`status-badge ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                                        </td>
                                        <td>{formatDate(request.createdAt)}</td>
                                        <td className="note">{request.adminNote}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showTopupModal && (
                    <div className="modal-backdrop">
                        <div className="topup-modal">
                            <h2>Nạp tiền vào ví</h2>
                            <form onSubmit={handleTopup}>
                                <div className="form-group">
                                    <label htmlFor="amount">Số tiền:</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={topupAmount}
                                        onChange={(e) => setTopupAmount(e.target.value)}
                                        placeholder="Nhập số tiền"
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn"
                                            onClick={() => setShowTopupModal(false)}>Hủy
                                    </button>
                                    <button type="submit" className="submit-btn">Nạp tiền</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default Wallet