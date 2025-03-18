import React, { useEffect, useState, useRef } from "react";
import CustomerNavbar from "../../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import Footer from "../../../components/Footer/Footer.tsx";
import FloatingButtons from "../../../components/FloatingButton/FloatingButtons.tsx";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    getFilteredRowModel
} from "@tanstack/react-table";
import "./VaccinePackagePage.scss";
import {GetVaccineComboDetail, VaccineScheduleDetail} from "../../../interfaces/Vaccine.ts";
import { apiGetComboVaccineDetail } from "../../../apis/apiVaccine.ts";
import {Link, useNavigate} from "react-router-dom";
import { FaSortAlphaDown, FaSortAlphaUp, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Select, Button, Tooltip } from "antd";
import DOMPurify from "dompurify";
import { useVaccinationScheduleDetail } from "../../../hooks/useVaccine.ts";


const ageColumns = [
    { month: 0, label: 'Sơ sinh\n0 tháng' },
    { month: 2, label: '2 tháng\n2 tháng' },
    { month: 3, label: '3 tháng\n3 tháng' },
    { month: 4, label: '4 tháng\n4 tháng' },
    { month: 12, label: '12 tháng\n1 tuổi' },
    { month: 18, label: '18 tháng\n1 tuổi' },
    { month: 48, label: '4 tuổi\n4 tuổi' },
    { month: 72, label: '6 tuổi\n6 tuổi' }
];

const VaccinePackagePage: React.FC = () => {

    const navigate = useNavigate();

    const columns = [
        {
            header: "Số thứ tự",
            accessorKey: "comboId",
        },
        {
            header: "Gói combo",
            accessorKey: "comboName",
        },
        {
            header: "Giới thiệu",
            accessorKey: "description",
        },
        {
            header: "Tổng giá (VNĐ)",
            accessorKey: "totalPrice",
            cell: (info: any) => new Intl.NumberFormat("vi-VN").format(info.getValue()),
        },
        {
            header: "Vaccines",
            accessorKey: "vaccines",
            cell: (info: any) => {
                const vaccines = info.getValue();
                return (
                    <div>
                        {vaccines.map((vaccineObj: any, index : number) => (
                            <div className="vaccine-buttons">
                                <button key={index} className="vaccine-button"
                                        onClick={() => navigate(`/vaccines-list/${vaccineObj.vaccine.id}`)}>
                                    ({vaccineObj.order}) {vaccineObj.vaccine.name} (tiêm
                                    sau {vaccineObj.intervalDays} ngày)
                                </button>
                            </div>
                            ))}
                    </div>
                );
            },
            },

            ];

            const [comboVaccines, setComboVaccines] = useState<GetVaccineComboDetail[]>([]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [sortColumn, setSortColumn] = useState<string>("comboId");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [filtering, setFiltering] = useState("");
    const { vaccinationSchedule } = useVaccinationScheduleDetail();

    // References and state for horizontal scrolling
    const scheduleWrapperRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchComboVaccines = async () => {
            try {
                const response = await apiGetComboVaccineDetail();
                if (response) {
                    setComboVaccines(response.result);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu vaccine:", error);
            }
        };

        fetchComboVaccines();
    }, []);

    useEffect(() => {
        if (sortColumn) {
            setSorting([{ id: sortColumn, desc: sortDirection === "desc" }]);
        }
    }, [sortColumn, sortDirection]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFiltering(filtering);
        }, 300);
        return () => clearTimeout(timeout);
    }, [filtering]);

    // Check scroll capabilities when wrapper is rendered
    useEffect(() => {
        const checkScroll = () => {
            if (scheduleWrapperRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scheduleWrapperRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
            }
        };

        // Initial check
        checkScroll();

        // Add event listener for scroll
        const wrapperElement = scheduleWrapperRef.current;
        if (wrapperElement) {
            wrapperElement.addEventListener('scroll', checkScroll);

            // Cleanup
            return () => wrapperElement.removeEventListener('scroll', checkScroll);
        }
    }, [vaccinationSchedule]);

    // Handle horizontal scrolling
    const scrollLeft = () => {
        if (scheduleWrapperRef.current) {
            scheduleWrapperRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scheduleWrapperRef.current) {
            scheduleWrapperRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const table = useReactTable({
        data: comboVaccines,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    });


    // Cái hàm này dùng để lấy danh sách vaccine dựa trên vaccinationschedule để không bị trùng lặp
    const getAllVaccines = () => {
        const vaccines: VaccineScheduleDetail[] = [];

        vaccinationSchedule.forEach(schedule => {
            schedule.vaccineScheduleDetails.forEach(detail => {
                const existingVaccine = vaccines.find(v => v.vaccineId === detail.vaccineId);
                if (!existingVaccine) {
                    vaccines.push(detail);
                }
            });
        });

        return vaccines;
    };

    //Gọi 1 biến để sử dụng hàm ở trên
    const allVaccines = getAllVaccines();

    //hàm này sử dụng để tìm thông tin mũi tiêm ở 1 độ tuổi cụ thể
    const findInjection = (vaccineId: number, month: number) => {
        for (const schedule of vaccinationSchedule) {
            const vaccineDetail = schedule.vaccineScheduleDetails.find(
                detail => detail.vaccineId === vaccineId
            );

            if (vaccineDetail) {
                const injection = vaccineDetail.injectionSchedules.find(
                    inj => inj.injectionMonth === month
                );

                if (injection) {
                    return injection;
                }
            }
        }

        return null;
    };


    //Cái này kiểm tra xem vaccine nó có bắt buộc hay khong để hiển thị trên cột
    const isVaccineRequired = (vaccineId: number): boolean => {
        for (const schedule of vaccinationSchedule) {
            const vaccine = schedule.vaccineScheduleDetails.find(v => v.vaccineId === vaccineId);
            if (vaccine && vaccine.injectionSchedules.some(inj => inj.isRequired)) {
                return true;
            }
        }
        return false;
    };

    return (
        <>
            <CustomerNavbar />

            <div className="table-container">
               <span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link><span
                   className="separator"> » </span><span
                   className="last">Gói Vaccine</span>
               </span>

                <div style={{paddingTop: "20px"}} className="introductionTitle">
                    <h1 className="gt-title">Gói Vaccine</h1>
                </div>

                {/* Search and filter controls */}
                <div className="controls-row" style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={filtering}
                            onChange={(e) => setFiltering(e.target.value)}
                            className="search-box"
                        />
                    </div>

                    <div className="sorting-controls">
                        <Select
                            placeholder="Chọn cột"
                            value={sortColumn}
                            onChange={setSortColumn}
                            style={{width: 150, marginRight: "10px"}}
                        >
                            <Select.Option value="comboId">Số thứ tự</Select.Option>
                            <Select.Option value="comboName">Gói combo</Select.Option>
                            <Select.Option value="description">Giới thiệu</Select.Option>
                            <Select.Option value="totalPrice">Tổng giá</Select.Option>
                        </Select>

                        <Select
                            placeholder="Sắp xếp"
                            value={sortDirection}
                            onChange={(value) => setSortDirection(value as "asc" | "desc")}
                            style={{width: 150}}
                        >
                            <Select.Option value="asc">Tăng dần (A → Z)</Select.Option>
                            <Select.Option value="desc">Giảm dần (Z → A)</Select.Option>
                        </Select>
                    </div>
                </div>

                {/* Vaccine Combo Table */}
                <table className="combo-table">
                    <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                    <div className="th-content">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === "asc"
                                            ? <FaSortAlphaDown style={{marginLeft: "5px"}}/>
                                            : header.column.getIsSorted() === "desc"
                                                ? <FaSortAlphaUp style={{marginLeft: "5px"}}/>
                                                : ""}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {cell.column.id === "description" ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(String(cell.getValue())),
                                            }}
                                        />
                                    ) : (
                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Vaccination Schedule Section with Toolbar */}
                <div className="vaccination-schedule">
                    <div className="schedule-header">
                        <div style={{paddingTop: "20px"}} className="introductionTitle">
                            <h1 className="gt-title">Lịch tiêm chủng của vaccine</h1>
                            <hr/>
                        </div>
                        <div className="schedule-toolbar">
                            <Tooltip title="Cuộn sang trái">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<FaArrowLeft/>}
                                    onClick={scrollLeft}
                                    disabled={!canScrollLeft}
                                    className="scroll-button"
                                />
                            </Tooltip>
                            <Tooltip title="Cuộn sang phải">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<FaArrowRight/>}
                                    onClick={scrollRight}
                                    disabled={!canScrollRight}
                                    className="scroll-button"
                                />
                            </Tooltip>
                        </div>
                    </div>

                    <div className="schedule-wrapper" ref={scheduleWrapperRef}>
                        <table className="schedule-table">
                        <thead>
                            <tr>
                                <th className="vaccine-column">Vaccine</th>
                                {ageColumns.map((col) => (
                                    <th key={col.month} className="age-column">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                            <tbody>
                            {allVaccines.map((vaccine) => (
                                <tr key={vaccine.vaccineId}>
                                    <td className="vaccine-name">
                                        <div className="vaccine-label">
                                            {vaccine.vaccineName}
                                            {isVaccineRequired(vaccine.vaccineId) ? (
                                                <span className="required-badge">
                                                        Bắt buộc
                                                    </span>
                                            ) : (
                                                <span className="optional-badge">
                                                        Tùy chọn
                                                    </span>
                                            )}
                                        </div>
                                    </td>

                                    {ageColumns.map((col) => {
                                        const injection = findInjection(vaccine.vaccineId, col.month);
                                        return (
                                            <td key={`${vaccine.vaccineId}-${col.month}`} className="dose-cell">
                                                {injection && (
                                                    <div className="dose-number">
                                                        {injection.injectionNumber}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer/>
            <FloatingButtons/>
        </>
    );
};

export default VaccinePackagePage;