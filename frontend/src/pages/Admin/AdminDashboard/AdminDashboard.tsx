import React, {useEffect, useRef, useState} from "react";
import {Row, Col, Table, Rate, DatePicker} from "antd";
import {TeamOutlined, SolutionOutlined, CrownOutlined, SafetyOutlined } from '@ant-design/icons';
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {
    Revenue,
    useFeedbackDetail,
    useRevenueBydate,
    useRevenueLast10Days,
    useRevenueTotal
} from "./useAdminDashboard.ts";
import { Chart, registerables, ChartType } from 'chart.js';
import './AdminDashboard.scss';

import {useTopUsedVaccine} from "../../../hooks/useVaccine.ts";
import {useGetAllUser} from "../AdminAccount/useAdminAccount.ts";

Chart.register(...registerables);

const AdminDashboardPage: React.FC = () => {
    const {users, fetchAllUser} = useGetAllUser();

    useEffect(() => {
        fetchAllUser()
    }, []);

    // console.log(users)
    const { revenue } = useRevenueLast10Days();

    const [selectedDate, setSelectedDate] = useState<string>("");
    const {revenueByDate} = useRevenueBydate(selectedDate);


    const { feedback } = useFeedbackDetail();
    const { topUseVaccine } = useTopUsedVaccine();
    const {revenue : revenueTotal} = useRevenueTotal()

    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<ChartType> | null>(null);


    const formatDateString = (dateString: string | null | undefined): string => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateString);
            return "N/A";
        }

        return date.toISOString().split("T")[0];
    };




    useEffect(() => {
        if (chartRef.current) {
            // Destroy previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const revenueData: Revenue[] = selectedDate && revenueByDate ? [revenueByDate] : revenue;
            if (!revenueData || revenueData.length === 0) {
                return;
            }

            const labels = revenueData.map(item => formatDateString(item.date));
            const data = revenueData.map(item => item.totalRevenue);


            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Doanh thu (VND)',
                            data: data,
                            backgroundColor: '#2A388F',
                            barThickness: 40,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Ngày'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Doanh thu (VND)'
                                },
                                ticks: {
                                    callback: function(value) {
                                        return new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                            maximumFractionDigits: 0
                                        }).format(value as number);
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                            maximumFractionDigits: 0
                                        }).format(context.raw as number);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // Clean up function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [selectedDate, revenueByDate, revenue]);

    const sortedFeedback = feedback.sort((a, b) => parseInt(b.feedbackId) - parseInt(a.feedbackId)).slice(0, 3);

    const sortedVaccines = topUseVaccine.sort((a, b) => b.count - a.count).slice(0, 3);

    const feedbackColumns = [
        {
            title: "Tên người dùng",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rates: number) => <Rate disabled defaultValue={rates} style={{color:'#FFD700'} }/>,
        },
        {
            title: "Bình luận",
            dataIndex: "comment",
            key: "comment",
            render: (comment: string) => comment.substring(0, 15) + '...', // Show first 15 chars
        }
    ];

    // Table columns for vaccines
    const vaccineColumns = [
        {
            title: "Tên vaccine",
            dataIndex: "vaccineName",
            key: "vaccineName",
        },
        {
            title: "Số lượng",
            dataIndex: "count",
            key: "count",
        }
    ];

    return (
        <AdminLayout>
            <div className="admin-dashboard-container">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Row gutter={[16, 16]} className="user-statistics">
                            <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>
                                <div className="stat-card">
                                    <TeamOutlined className="stat-icon" />
                                    <div className="stat-content">
                                        <div className="stat-title">Tổng Customer</div>
                                        <div className="stat-value">{users?.filter(user => user.roles[0] === 'Customer').length || 0}</div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>
                                <div className="stat-card">
                                    <SolutionOutlined className="stat-icon" />
                                    <div className="stat-content">
                                        <div className="stat-title">Tổng Staff</div>
                                        <div className="stat-value">{users?.filter(user => user.roles[0]=== 'Staff').length || 0}</div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>
                                <div className="stat-card">
                                    <CrownOutlined className="stat-icon" />
                                    <div className="stat-content">
                                        <div className="stat-title">Tổng Manager</div>
                                        <div className="stat-value">{users?.filter(user => user.roles[0] === 'Manager').length || 0}</div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>
                                <div className="stat-card">
                                    <SafetyOutlined className="stat-icon" />
                                    <div className="stat-content">
                                        <div className="stat-title">Tổng Admin</div>
                                        <div className="stat-value">{users?.filter(user => user.roles[0] === 'Admin').length || 0}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    {/* Revenue Chart Section */}
                    <Col span={24}>
                        <div className="chart-container">
                            <div className="date-filter">
                                <DatePicker
                                    value={selectedDate}
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                    }}
                                    format="YYYY-MM-DD"
                                    showTime={false}
                                />
                            </div>
                            <h1 className="title">Biểu đồ doanh thu của SideEffect </h1>
                            <h1 className="title" style={{color : "#FFB400"}}>Tổng Doanh Thu: {revenueTotal.toLocaleString("vi-VN")} VND</h1>
                            <div style={{height: '300px', width: '100%'}}>
                                <canvas ref={chartRef}></canvas>
                            </div>
                        </div>
                    </Col>

                    {/* Bottom Section with Feedback and Vaccines */}
                    <Col span={24}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="feedback-cotainer">
                                    <h3 className="title">Feedback từ người dùng</h3>
                                    <Table
                                        dataSource={sortedFeedback}
                                        columns={feedbackColumns}
                                        rowKey="feedbackId"
                                        pagination={false}
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="feedback-cotainer">
                                    <h3 className="title">Danh sách vaccine bán chạy nhất</h3>
                                    <Table
                                        dataSource={sortedVaccines}
                                        columns={vaccineColumns}
                                        rowKey="vaccineId"
                                        pagination={false}
                                    />

                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;