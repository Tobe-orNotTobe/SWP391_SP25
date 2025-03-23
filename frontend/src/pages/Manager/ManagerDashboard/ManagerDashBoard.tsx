import React from "react";
import ManagerLayout from "../../../components/Layout/ManagerLayout/ManagerLayout.tsx";
import { Col, Row } from "antd";
import {
    useComboVaccineDetail,
    useVaccinationScheduleDetail,
    useVaccineDetail,
    useVaccineInventoryStockDetail,
} from "../../../hooks/useVaccine.ts";
import { FaCalendarCheck, FaCapsules, FaSyringe, FaWarehouse } from "react-icons/fa";
import "./ManagerDashboard.scss";
import { useExportedVaccines } from "./useManagerDashboard.ts";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ManagerDashBoard: React.FC = () => {
    const { vaccineInventoryStockDetail } = useVaccineInventoryStockDetail();
    const { vaccineDetail } = useVaccineDetail();
    const { vaccinationSchedule } = useVaccinationScheduleDetail();
    const { comboVaccineDetail } = useComboVaccineDetail();
    const { exportVaccine } = useExportedVaccines();

    const stats = [
        { label: "Tổng số loại Vaccine", value: vaccineDetail?.length ?? 0, icon: <FaSyringe size={30} className="icon" /> },
        { label: "Tổng số Combo Vaccine", value: comboVaccineDetail?.length ?? 0, icon: <FaCapsules size={30} className="icon" /> },
        { label: "Tổng số lịch tiêm cho các vaccine ", value: vaccinationSchedule?.length ?? 0, icon: <FaCalendarCheck size={30} className="icon" /> },
        { label: "Tổng số lô Vaccine trong kho", value: vaccineInventoryStockDetail?.length ?? 0, icon: <FaWarehouse size={30} className="icon" /> },
    ];

    // Tìm giá trị lớn nhất trong dữ liệu để thiết lập giới hạn trục Y
    const findMaxValue = () => {
        if (!exportVaccine || exportVaccine.length === 0) return 100;

        let maxVal = 0;
        exportVaccine.slice(0, 3).forEach(vaccine => {
            maxVal = Math.max(maxVal, vaccine.quantityInStock, vaccine.returnedQuantity, vaccine.totalQuantity);
        });

        // Làm tròn lên giá trị gần nhất (có thể điều chỉnh theo nhu cầu)
        return Math.ceil(maxVal * 1.2); // Thêm 20% không gian trên cùng
    };

    // Prepare data for bar chart
    const chartData = {
        labels: exportVaccine?.slice(0, 3).map(vaccine => vaccine.name) || [],
        datasets: [
            {
                label: 'Còn lại',
                data: exportVaccine?.slice(0, 3).map(vaccine => vaccine.quantityInStock) || [],
                backgroundColor: '#2B388F',
            },
            {
                label: 'Trả lại',
                data: exportVaccine?.slice(0, 3).map(vaccine => vaccine.returnedQuantity) || [],
                backgroundColor: '#FFB400',
            },
            {
                label: 'Đã xuất',
                data: exportVaccine?.slice(0, 3).map(vaccine => vaccine.totalQuantity) || [],
                backgroundColor: '#FF8042',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Thống kê số lượng vaccine',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: findMaxValue(), // Thiết lập giá trị tối đa cho trục Y
                title: {
                    display: true,
                    text: 'Số lượng (liều)'
                },
                ticks: {
                    callback: function(value : any) {
                        return value + ' liều';
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Loại vaccine (tên)'
                }
            }
        },
        barPercentage: 2, // Điều chỉnh độ rộng của cột (0-1)
        categoryPercentage: 0.2, // Điều chỉnh khoảng cách giữa các nhóm cột (0-1)
    };

    return (
        <ManagerLayout>
            <div className="dashboard-container">
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    {stats.map((item, index) => (
                        <Col key={index} span={6}>
                            <div className="stat-box">
                                {item.icon}
                                <div className="stat-info">
                                    <span className="stat-label">{item.label}</span>
                                    <span className="stat-value">{item.value}</span>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[16, 16]} align="middle" justify="center" style={{ marginTop: 20 }}>
                    <Col span={20}>
                        <div className="chart-container" style={{ height: "700px" }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </Col>
                </Row>
            </div>
        </ManagerLayout>
    );
};

export default ManagerDashBoard;