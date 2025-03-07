import React, { useEffect, useState } from "react";
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
import { GetVaccineComboDetail } from "../../../interfaces/Vaccine.ts";
import { apiGetComboVaccineDetail } from "../../../apis/apiVaccine.ts";
import {Link} from "react-router-dom";
import { FaSortAlphaDown } from "react-icons/fa";
import { FaSortAlphaUp } from "react-icons/fa";
import {Select} from "antd";
import DOMPurify from "dompurify";

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
        cell: (info: any) => new Intl.NumberFormat("vi-VN").format(info.getValue()), // Format tiền tệ
    },
    {
        header: "Vaccines",
        accessorKey: "vaccines",
        cell: (info: any) => (
            <div className="vaccine-buttons">
                {info.getValue().map((vaccine: any, index: number) => (
                    <button key={index} className="vaccine-button">
                        {vaccine.name}
                    </button>
                ))}
            </div>
        ),
    },

];

const VaccinePackagePage: React.FC = () => {

    const [comboVaccines, setComboVaccines] = useState<GetVaccineComboDetail[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [sortColumn, setSortColumn] = useState<string>("comboId"); // Lưu cột cần sắp xếp
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Lưu thứ tự sắp xếp
    const [filtering, setFiltering] = useState("");

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
    }, [sortColumn, sortDirection, setSorting]); // Tự động cập nhật khi có thay đổi

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFiltering(filtering); // Cập nhật filter
        }, 300);
        return () => clearTimeout(timeout);
    }, [filtering]); // Không cần `onFilter`

    const table = useReactTable({
        data: comboVaccines,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //  Thêm bộ lọc
        state: {
            sorting,
            globalFilter: filtering, // Truyền filter vào bảng
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    });

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

                <div style={{display: "flex", alignItems: "center"}}>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={filtering}
                            onChange={(e) => setFiltering(e.target.value)} // 🆕 Xóa onFilter, chỉ cập nhật state
                            className="search-box"
                        />
                    </div>


                    <div className="sorting-controls">

                        <Select
                            placeholder="Chọn cột"
                            value={sortColumn}
                            onChange={setSortColumn}
                            style={{width: 150, paddingRight: "10px"}}
                        >
                            <Select.Option value="comboId">Số thứ tự</Select.Option>
                            <Select.Option value="comboName">Gói combo</Select.Option>
                            <Select.Option value="description">Giới thiệu</Select.Option>
                            <Select.Option value="totalPrice">Tổng giá</Select.Option>
                        </Select>

                        {/* Chọn thứ tự sắp xếp */}
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

                <table>
                    <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                    <div className={"th-content"}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === "asc"
                                            ? <FaSortAlphaDown style={{paddingLeft: "5px"}}/>
                                            : header.column.getIsSorted() === "desc"
                                                ? <FaSortAlphaUp style={{paddingLeft: "5px"}}/>
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
            </div>

            <Footer/>
            <FloatingButtons/>
        </>
    );
};

export default VaccinePackagePage;
