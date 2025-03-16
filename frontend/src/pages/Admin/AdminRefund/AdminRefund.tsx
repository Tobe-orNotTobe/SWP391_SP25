import React, { useState } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {Button, Table, Modal, Row, Col, Tag, InputNumber} from "antd";
import { IoMdAdd } from "react-icons/io";
import "./AdminRefund.scss";
import { useRefundUserListAdmin } from "./useAdminRefund.ts";
import { RefundUserList } from "../../../interfaces/Transaction.ts";
import { TbListDetails } from "react-icons/tb";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import {useWalletUserDetail} from "../../../components/Wallet/useWallet.ts";
import {apiRefundApprove, apiRefundReject} from "../../../apis/apiTransaction.ts";
import {toast} from "react-toastify";
import {AxiosError} from "axios";
import TextArea from "antd/es/input/TextArea";
import {apiAdminAddFund} from "../../../apis/apiAdmin.ts";

const AdminRefund: React.FC = () => {
    const {walletData} = useWalletUserDetail()
    const { refundUserList } = useRefundUserListAdmin();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<RefundUserList | null>(null);


    const [isRefundModal, setIsRefundModal] = useState<boolean>(false);

    const [adminNote, setAdminNote] = useState<string>("");

    const[refundId, setRefundId] = useState<number>(0);

    const [adminAmount, setAdminAmount]= useState<number>(0);
    const [modalAddFund, setModalAddFund] = useState<boolean>(false);


    const showDetailModal = (record: RefundUserList) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };



    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
    };

    const handleOpenRefundModel = (id : number) => {
        setIsRefundModal(true);
        setRefundId(id);
    }

    const handleCloseRefundModal = () =>{
        setIsRefundModal(false);
        setAdminNote("");
    }

    const handleOpenAddRefundModal = () => {
        setModalAddFund(true);
        setAdminAmount(10000);
    }

    const handleCloseAddRefund = () =>{
        setModalAddFund(false);
        setAdminAmount(0);
    }

    // Handle approve refund
    const handleApproveRefund = async (id: number) => {
        try{
            const response = await apiRefundApprove(id);
            if(response.isSuccess){
                toast.success("Đã Chấp Nhận Đơn Yêu Cầu Refund của người dùng");
            }
        }catch (err){
            if(err instanceof AxiosError){
                toast.error(`${err.response?.data?.errorMessages}`);
            }else{
                toast.error("Lỗi không Xác Định")
            }
        }
    };


    const handleRejectRefund = async () => {
        try{
            const response = await apiRefundReject(refundId, adminNote);
            if(response.isSuccess){
                toast.success("Đã Từ Chối Đơn Yêu Cầu Refund của người dùng");
            }
        }catch (err){
            if(err instanceof AxiosError){
                toast.error(`${err.response?.data?.errorMessages}`);
            }else{
                toast.error("Lỗi không Xác Định")
            }
        }
    };

    const handelAddFundToAdminWallet = async () =>{
        try {
            const response = await apiAdminAddFund(adminAmount);
            if(response.isSuccess){
                toast.success("Thêm Tiền Vào Ví Admin Thành Công")
                setModalAddFund(false);
                setTimeout(() =>{
                    window.location.reload();
                })
            }
        }catch (err){
            if(err instanceof  AxiosError){
                toast.error(`${err.response?.data?.errorMessages}`);
            }else{
                toast.error("Lỗi không Xác Định")
            }
        }
    }

    // Function to render status tag with appropriate color
    const renderStatus = (status: string) => {
        let color = "";
        switch (status) {
            case "Đang chờ xử lý":
                color = "#faad14";
                break;
            case "Đã chấp nhận":
                color = "#52c41a";
                break;
            case "Bị từ chối":
                color = "#ff4d4f";
                break;
            default:
                color = "#1890ff";
        }

        return <Tag color={color}>{status}</Tag>;
    };

    const columns = [
        {
            title: "Refund Id",
            dataIndex: "refundRequestId",
            key: "refundRequestId",
        },
        {
            title: "Booking Id",
            dataIndex: "bookingId",
            key: "bookingId",
        },
        {
            title: "User Id",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "User Name",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (value: number) => new Intl.NumberFormat("vi-VN").format(value) + " VNĐ"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => renderStatus(status),
        },
        {
            title: "Created At",
            dataIndex: "createAt",
            key: "createAt",
            render: (value: string) => new Date(value).toLocaleString(),
        },
        {
            title: "Hành Động",
            key: "actions",
            render: (_: undefined, record: RefundUserList) => (
                <div className="refund-action-buttons">
                    <Button className="detail-button" onClick={() => showDetailModal(record)}>
                        <TbListDetails /> Chi tiết
                    </Button>
                    {record.status === "Đang chờ xử lý" && (
                        <>
                            <Button className="approve-button" onClick={() => handleApproveRefund(record.refundRequestId)}>
                                <FaRegCircleCheck /> Chấp Nhận
                            </Button>
                            <Button className="reject-button" onClick={() => handleOpenRefundModel(record.refundRequestId)}>
                                <MdOutlineDoNotDisturbOn /> Từ Chối
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminLayout>
                <div className="admin-refund-page-container">
                    <div className="page-header">
                        <h1>Quản lý Đơn Refund</h1>
                        <div className="admin-wallet">
                            <span>Ví của Admin:</span>
                            <span className="wallet-amount">
                                {walletData?.balance
                                    ? new Intl.NumberFormat("vi-VN").format(walletData.balance) + " VNĐ"
                                    : "0 VNĐ"}
                            </span>
                            <Button
                                type="primary"
                                icon={<IoMdAdd/>}
                                className="add-fund-admin"
                                onClick={() => handleOpenAddRefundModal()}
                            >
                                Nạp Tiền
                            </Button>
                        </div>
                    </div>
                    <Table dataSource={refundUserList} columns={columns} rowKey="refundRequestId"/>

                    {/* Using Ant Design Modal */}
                    <Modal
                        title="Chi tiết yêu cầu hoàn tiền"
                        open={isModalVisible}
                        onCancel={handleModalClose}
                        footer={[
                            <Button key="close" onClick={handleModalClose}>
                                Đóng
                            </Button>,
                        ]}
                        width={700}
                    >
                        {selectedRecord && (
                            <div className="refund-detail-containerm">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>Refund ID:</strong> {selectedRecord.refundRequestId}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>Booking ID:</strong> {selectedRecord.bookingId}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>User ID:</strong> {selectedRecord.userId}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>User Name:</strong> {selectedRecord.userName}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>Amount:</strong> ${selectedRecord.amount}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>Status:</strong> {renderStatus(selectedRecord.status)}
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <div className="detail-item">
                                            <strong>Reason:</strong> {selectedRecord.reason || "No reason provided"}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>Created
                                                At:</strong> {new Date(selectedRecord.createAt).toLocaleString()}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>Processed At:</strong>{" "}
                                            {selectedRecord.processAt ? new Date(selectedRecord.processAt).toLocaleString() : "N/A"}
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className="detail-item">
                                            <strong>Processed By:</strong> {selectedRecord.processedBy || "N/A"}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Modal>
                    {/* cái này là modal cho admin từ chối refund kèm lí do*/}
                    <Modal
                        title="Note"
                        open={isRefundModal}
                        onCancel={handleCloseRefundModal}
                        onOk={handleRejectRefund}
                    >
                        <TextArea
                            rows={4}
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Nhập ghi chú..."
                        />
                    </Modal>

                    {/*Cái này là modal cho admin nạp tiền vào*/}
                    <Modal
                        title = "Số tiền"
                        open={modalAddFund}
                        onCancel={handleCloseAddRefund}
                        onOk={handelAddFundToAdminWallet}
                    >
                        <InputNumber
                            width={200}
                            value={adminAmount}
                            onChange={(value) => setAdminAmount(value ?? 0)}
                            placeholder="Nhập số tiền mong muốn của bạn"
                        />



                    </Modal>
                </div>
            </AdminLayout>
        </>
    );
};

export default AdminRefund;