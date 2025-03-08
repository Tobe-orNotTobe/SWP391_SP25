import React from "react";
import {Table, Modal, Button, Tag, Card, Typography, Tabs, InputNumber} from "antd";

import { WalletHistoryUserDetail } from "../../interfaces/Account";
import {useWalletLogic} from "./useWallet.ts";
import "./Wallet.scss"
const { Title, Text } = Typography;

const Wallet: React.FC = () => {
    const {
        walletData,
        isLoadingTransactions,
        activeTransactionTab,
        setActiveTransactionTab,
        showTopupModal,
        setShowTopupModal,
        topupAmount,
        setTopupAmount,
        currentPage,
        setCurrentPage,
        pageSize,
        filteredTransactions,
        formatDate,
        formatCurrency,
        getTransactionTagColor,
        getTransactionTypeName,
        handleTopup,
        handleAddFundToUseWallet,
    } = useWalletLogic();

    // Define columns in the component file as requested
    const columns = [
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
            render: (type: string) => (
                <Tag color={getTransactionTagColor(type)}>
                    {getTransactionTypeName(type)}
                </Tag>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record: WalletHistoryUserDetail) => {
                const isPositive = record.transactionType === "Deposit" || record.transactionType === "Refund";
                return (
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: isPositive ? '#28a745' : '#dc3545'
                        }}
                    >
                        {(isPositive ? "+" : "-") + formatCurrency(amount)}
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

    const tabItems = [
        {
            key: "All",
            label: "Tất cả",
        },
        {
            key: "Deposit",
            label: "Nạp tiền",
        },
        {
            key: "Transfer",
            label: "Chuyển tiền",
        },
        {
            key: "Refund",
            label: "Hoàn tiền",
        },
    ];

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
                                {walletData ? formatCurrency(walletData.balance) : '0 VND'}
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
                        items={tabItems}
                    />

                    <Table
                        dataSource={filteredTransactions}
                        columns={columns}
                        rowKey="walletTransactionId"
                        loading={isLoadingTransactions}
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
                        Lịch sử refund
                    </Title>
                </Card>


            </div>

            <Modal
                title="Nạp tiền vào ví"
                open={showTopupModal}
                onCancel={() => setShowTopupModal(false)}
                onOk={handleTopup}
                footer={[
                    <Button key="cancel" onClick={() => setShowTopupModal(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAddFundToUseWallet}
                        style={{ backgroundColor: '#FFB400', color: '#343a40', border: 'none' }}
                    >
                        Nạp tiền
                    </Button>,
                ]}
            >
                <div style={{ marginTop: '1rem' }}>
                    <Text strong>Số tiền:</Text>
                    <InputNumber
                        value={topupAmount}
                        onChange={(value) => setTopupAmount(value ?? 0)}
                        placeholder="Nhập số tiền"
                        style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}
                        required
                    />

                </div>
            </Modal>
        </div>
    );
};

export default Wallet;