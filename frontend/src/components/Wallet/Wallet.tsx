import React from "react";
import {Table, Modal, Button, Tag, Card, Typography, Tabs,  Col, Row} from "antd";
import { WalletHistoryUserDetail } from "../../interfaces/Account";
import {useWalletLogic} from "./useWallet.ts";
import "./Wallet.scss";

const { Title, Text } = Typography;

const Wallet: React.FC = () => {
    const {
        walletData,
        activeTransactionTab,
        setActiveTransactionTab,
        activeRefundTab,
        setActiveRefundTab,
        showTopupModal,
        setShowTopupModal,
        topupAmount,
        setTopupAmount,
        currentPage,
        setCurrentPage,
        currentRefundPage,
        setCurrentRefundPage,
        pageSize,
        refundPageSize,
        filteredTransactions,
        filteredRefunds,
        formatDate,
        formatCurrency,
        getTransactionTagColor,
        getTransactionTypeName,
        getRefundStatusTagColor,
        handleAddFundToUseWallet,
    } = useWalletLogic();

    // Transaction columns
    const transactionColumns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'walletTransactionId',
            key: 'walletTransactionId',
            render: (id: number) => `#${id}`,
        },
        {
            title: 'Loại',
            dataIndex: 'transactionType',
            key: 'transactionType',
            render: (type: string, record: WalletHistoryUserDetail) => (
                <Tag color={getTransactionTagColor(type, record.amount)}>
                    {getTransactionTypeName(type, record.amount)}
                </Tag>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record: WalletHistoryUserDetail) => {
                const isPositive = record.transactionType === "Nạp tiền" ||
                    (record.transactionType === "Chuyển khoản" && amount > 0);
                return (
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: isPositive ? '#28a745' : '#dc3545'
                        }}
                    >
                        {(isPositive ? "+" : "") + formatCurrency(Math.abs(amount))}
                    </Text>
                );
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày giao dịch',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => formatDate(date),
        },
    ];

    // Refund columns
    const refundColumns = [
        {
            title: 'Mã yêu cầu',
            dataIndex: 'refundRequestId',
            key: 'refundRequestId',
            render: (id: number) => `#${id}`,
        },
        {
            title: 'Mã đặt lịch',
            dataIndex: 'bookingId',
            key: 'bookingId',
            render: (id: number) => `#${id}`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getRefundStatusTagColor(status)}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <Text
                    style={{
                        fontWeight: 'bold',
                        color: '#28a745'
                    }}
                >
                    {formatCurrency(amount)}
                </Text>
            ),
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
            width: '20%',
        },
        {
            title: 'Ghi chú Admin',
            dataIndex: 'adminNote',
            key: 'adminNote',
            width: '25%',
        },
        {
            title: 'Ngày yêu cầu',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Ngày xử lý',
            dataIndex: 'processedAt',
            key: 'processedAt',
            render: (date: string) => date ? formatDate(date) : 'Chưa xử lý',
        },
    ];

    const transactionTabItems = [
        { key: "All", label: "Tất cả" },
        { key: "Nạp tiền", label: "Nạp tiền" },
        { key: "Transfer", label: "Giao dịch" },
    ];

    const refundTabItems = [
        { key: "All", label: "Tất cả" },
        { key: "Đang chờ xử lý", label: "Đang chờ" },
        { key: "Approved", label: "Đã duyệt" },
        { key: "Rejected", label: "Từ chối" },
    ];

    const topupOptions = [10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000];

    return (
        <div className="wallet-page">
            <div className="wallet-container">
                <Card className="wallet-card">
                    <div className="wallet-header">
                        <Title level={3} style={{ color: '#2A388F', margin: 0 }}>Ví của tôi</Title>
                        <div className="wallet-balance">
                            <Text className="balance-label">
                                Số dư:
                            </Text>
                            <Text strong className="balance-amount" style={{ color: '#2A388F', fontSize: '1.8rem' }}>
                                {walletData ? new Intl.NumberFormat("vi-VN").format(walletData.balance) + " VNĐ" : "0 VNĐ"}
                            </Text>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => setShowTopupModal(true)}
                            style={{ backgroundColor: '#FFB400', color: 'white', border: 'none' }}
                        >
                            Nạp tiền
                        </Button>
                    </div>
                </Card>

                <Card className="transaction-section">
                    <Title level={4} style={{ color: '#2A388F', marginTop: 0, marginBottom: '1.5rem' }}>
                        Lịch sử giao dịch
                    </Title>

                    <Tabs
                        activeKey={activeTransactionTab}
                        onChange={(key) => {
                            setActiveTransactionTab(key);
                            setCurrentPage(1);
                        }}
                        items={transactionTabItems}
                    />

                    <Table
                        dataSource={filteredTransactions}
                        columns={transactionColumns}
                        rowKey="walletTransactionId"
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: filteredTransactions.length,
                            onChange: (page) => setCurrentPage(page),
                            showSizeChanger: false,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giao dịch`,
                        }}
                        locale={{
                            emptyText: 'Không có dữ liệu giao dịch',
                        }}
                    />
                </Card>

                <Card className="refund-section">
                    <Title level={4} style={{ color: '#2A388F', marginTop: 0, marginBottom: '1.5rem' }}>
                        Lịch sử hoàn tiền
                    </Title>

                    <Tabs
                        activeKey={activeRefundTab}
                        onChange={(key) => {
                            setActiveRefundTab(key);
                            setCurrentRefundPage(1);
                        }}
                        items={refundTabItems}
                    />

                    <Table
                        dataSource={filteredRefunds}
                        columns={refundColumns}
                        rowKey="refundRequestId"
                        pagination={{
                            current: currentRefundPage,
                            pageSize: refundPageSize,
                            total: filteredRefunds.length,
                            onChange: (page) => setCurrentRefundPage(page),
                            showSizeChanger: false,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu hoàn tiền`,
                        }}
                        locale={{
                            emptyText: 'Không có dữ liệu hoàn tiền',
                        }}
                    />
                </Card>
            </div>

            <Modal
                title={<span style={{ color: "#2A388F" }}>Nạp tiền vào ví</span>}
                open={showTopupModal}
                onCancel={() => setShowTopupModal(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowTopupModal(false)} style={{ color: "#2A388F" }}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAddFundToUseWallet}
                        disabled={!topupAmount}
                        style={{ backgroundColor: '#FFB400', color: '#343a40', border: 'none' }}
                    >
                        Nạp tiền
                    </Button>,
                ]}
            >
                <div style={{ marginTop: '1rem', color: "#2A388F" }}>
                    <Text strong style={{ color: "#2A388F" }}>Chọn số tiền:</Text>
                    <Row gutter={[16, 16]} style={{ marginTop: '1rem' }}>
                        {topupOptions.map((amount) => (
                            <Col span={8} key={amount}>
                                <Card
                                    hoverable
                                    style={{
                                        textAlign: 'center',
                                        border: topupAmount === amount ? '2px solid #FFB400' : '1px solid #d9d9d9',
                                        color: "#2A388F"
                                    }}
                                    onClick={() => setTopupAmount(amount)}
                                >
                                    <Text strong style={{ color: "#2A388F" }}>{amount.toLocaleString()} VND</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default Wallet;