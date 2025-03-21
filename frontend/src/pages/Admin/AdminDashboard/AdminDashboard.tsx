import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Select, Table, Rate } from "antd";
// import {TeamOutlined, SolutionOutlined, CrownOutlined, SafetyOutlined } from '@ant-design/icons';
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {useFeedbackDetail, useRevenueLast10Days, useRevenueTotal} from "./useAdminDashboard.ts";
import { Chart, registerables, ChartType } from 'chart.js';
import './AdminDashboard.scss';

import {useTopUsedVaccine} from "../../../hooks/useVaccine.ts";
// import {useGetAllUser} from "../AdminAccount/useAdminAccount.ts";

// Register Chart.js components
Chart.register(...registerables);

const AdminDashboardPage: React.FC = () => {
    // const {users} = useGetAllUser();

    const { revenue } = useRevenueLast10Days();
    const { feedback } = useFeedbackDetail();
    const { topUseVaccine } = useTopUsedVaccine();
    const {revenue : revenueTotal} = useRevenueTotal()
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<ChartType> | null>(null);


    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [filteredRevenue, setFilteredRevenue] = useState(revenue);


    const handleYearChange = (year: number) => {
        setSelectedYear(year);
    };


    useEffect(() => {
        const filteredData = revenue.filter(item => new Date(item.date).getFullYear() === selectedYear);
        setFilteredRevenue(filteredData);
    }, [selectedYear, revenue]);


    const formatDateString = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };


    useEffect(() => {
        if (chartRef.current) {
            // Destroy previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }


            const labels = filteredRevenue.map(item => formatDateString(item.date));
            const data = filteredRevenue.map(item => item.totalRevenue);


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
    }, [filteredRevenue]);

    const years = Array.from(new Set(revenue.map(item => new Date(item.date).getFullYear())));

    const sortedFeedback = feedback.sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 3);

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
                    {/* User Statistics Section */}
                    {/*<Col span={24}>*/}
                    {/*    <Row gutter={[16, 16]} className="user-statistics">*/}
                    {/*        <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>*/}
                    {/*            <div className="stat-card">*/}
                    {/*                <TeamOutlined className="stat-icon" />*/}
                    {/*                <div className="stat-content">*/}
                    {/*                    <div className="stat-title">Tổng Customer</div>*/}
                    {/*                    <div className="stat-value">{users?.filter(user => user.role === 'CUSTOMER').length || 0}</div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </Col>*/}

                    {/*        <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>*/}
                    {/*            <div className="stat-card">*/}
                    {/*                <SolutionOutlined className="stat-icon" />*/}
                    {/*                <div className="stat-content">*/}
                    {/*                    <div className="stat-title">Tổng Staff</div>*/}
                    {/*                    <div className="stat-value">{users?.filter(user => user.role === 'STAFF').length || 0}</div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </Col>*/}

                    {/*        <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>*/}
                    {/*            <div className="stat-card">*/}
                    {/*                <CrownOutlined className="stat-icon" />*/}
                    {/*                <div className="stat-content">*/}
                    {/*                    <div className="stat-title">Tổng Manager</div>*/}
                    {/*                    <div className="stat-value">{users?.filter(user => user.role === 'MANAGER').length || 0}</div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </Col>*/}

                    {/*        <Col xs={24} sm={12} md={8} lg={6} xl={4.8}>*/}
                    {/*            <div className="stat-card">*/}
                    {/*                <SafetyOutlined className="stat-icon" />*/}
                    {/*                <div className="stat-content">*/}
                    {/*                    <div className="stat-title">Tổng Admin</div>*/}
                    {/*                    <div className="stat-value">{users?.filter(user => user.role === 'ADMIN').length || 0}</div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </Col>*/}
                    {/*    </Row>*/}
                    {/*</Col>*/}

                    {/* Revenue Chart Section */}
                    <Col span={24}>
                        <div className="chart-container">
                            <h1 className="title">Biểu đồ doanh thu của SideEffect </h1>
                            <h1 className="title" style={{color : "#FFB400"}}>Tổng Doanh Thu: {revenueTotal.toLocaleString("vi-VN")} VND</h1>
                            {/* Year Filter */}
                            <div className="year-filter">
                                <Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    style={{width: 100}}
                                    options={years.map(year => ({label: year.toString(), value: year}))}
                                />
                            </div>
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
                                        rowKey="id"
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
                                        rowKey="name"
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