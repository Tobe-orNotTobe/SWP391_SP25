import React, { useState, useEffect } from "react";
import { Row, Col, Select, Table, Rate } from "antd";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.tsx";
import { useFeedbackDetail, useRevenueDetail, useExportedVaccines } from "./useAdminDashboard.ts";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import './AdminDashboard.scss';

const AdminDashboardPage: React.FC = () => {
    const { revenue } = useRevenueDetail();
    const { feedback } = useFeedbackDetail();
    const { exportedVaccine } = useExportedVaccines(); // Dữ liệu vaccine

    // State to hold the selected year
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [filteredRevenue, setFilteredRevenue] = useState(revenue);

    // Handle year change
    const handleYearChange = (year: number) => {
        setSelectedYear(year);
    };

    // Filter revenue based on the selected year
    useEffect(() => {
        const filteredData = revenue.filter(item => new Date(item.date).getFullYear() === selectedYear);
        setFilteredRevenue(filteredData);
    }, [selectedYear, revenue]);


    const years = Array.from(new Set(revenue.map(item => new Date(item.date).getFullYear())));


    const sortedFeedback = feedback.sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 3);


    const sortedVaccines = exportedVaccine.sort((a, b) => b.quantity - a.quantity).slice(0, 3);

    console.log("Feedback data:", feedback);

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
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        }
    ];

    return (
        <AdminLayout>
            <div className="admin-dashboard-container">
                <Row gutter={[16, 16]}>
                    {/* Phần trên (bên trái) */}
                    <Col span={24}>
                        <div className="chart-container">
                            <h1 className="title">Biểu đồ doanh thu của SideEffect</h1>
                            {/* Year Filter */}
                            <div className="year-filter">
                                <Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    style={{width: 100}}
                                    options={years.map(year => ({label: year.toString(), value: year}))}
                                />
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredRevenue}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="date"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="revenue" fill="#2A388F" barSize={40}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Col>

                    {/* Phần dưới (bên phải, chia nhỏ thành 2 phần) */}
                    <Col span={24}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="feedback-cotainer">
                                    <h3 className="title">Feedback từ người dùng</h3>
                                    <Table
                                        dataSource={sortedFeedback}
                                        columns={feedbackColumns}
                                        rowKey="id"
                                        pagination={false} // Remove pagination if not needed
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
                                        pagination={false} // Remove pagination if not needed
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
