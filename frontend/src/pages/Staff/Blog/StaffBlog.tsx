import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Tabs, Tag, Input, Space } from "antd";
import { TbListDetails } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useBlogByAuthor } from "../../../hooks/useBlog.ts";
import dayjs from "dayjs";
import { BlogResponse } from "../../../interfaces/Blog.ts";
import Staff1Layout from "../../../components/Layout/StaffLayout/Stafff1Layout/Staff1Layout.tsx";
import "./StaffBlog.scss";
import { IsLoginSuccessFully } from "../../../validations/IsLogginSuccessfully.ts";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const { TabPane } = Tabs;

const StaffBlog: React.FC = () => {
    const navigate = useNavigate();
    const { username } = IsLoginSuccessFully();
    const { blogs, loading, error, fetchAllBlog } = useBlogByAuthor(username);
    const [detailBlog, setDetailBlog] = useState<BlogResponse | null>(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef<any>(null);

    useEffect(() => {
        fetchAllBlog(); // Chỉ lấy blog của user đó (active)
    }, [username]);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps["confirm"],
        dataIndex: string
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex: keyof BlogResponse) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys as string[], confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys as string[], confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value: string | number | boolean, record: BlogResponse) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes(value.toString().toLowerCase()),
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            ...getColumnSearchProps("id"),
            sorter: (a: BlogResponse, b: BlogResponse) => a.id.localeCompare(b.id),
        },
        {
            title: "Đề mục",
            dataIndex: "title",
            key: "title",
            ...getColumnSearchProps("title"),
            sorter: (a: BlogResponse, b: BlogResponse) => a.title.localeCompare(b.title),
            render: (title: string) => (title.length > 10 ? `${title.slice(0, 15)}...` : title),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            ...getColumnSearchProps("content"),
            sorter: (a: BlogResponse, b: BlogResponse) => a.content.localeCompare(b.content),
            render: (content: string) => (content.length > 20 ? `${content.slice(0, 20)}...` : content),
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            filters: [
                { text: "Blog", value: 'Blog' },
                { text: "Tin tức", value: 'News' },
            ],
            onFilter: (value: string, record: BlogResponse) => record.type === value,
            render: (type: string) => (type.length > 20 ? `${type.slice(0, 20)}...` : type),
        },
        {
            title: "Hình minh họa",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (imageUrl: string) =>
                imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Hình minh họa"
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }}
                    />
                ) : (
                    "Chưa có dữ liệu"
                ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a: BlogResponse, b: BlogResponse) =>
                dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            render: (date: any) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Chưa có dữ liệu"),
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            filters: [
                { text: "Đã duyệt", value: true },
                { text: "Đang chờ duyệt", value: false },
            ],
            onFilter: (value: boolean, record: BlogResponse) => record.isActive === value,
            render: (isActive: boolean) =>
                isActive ? <Tag color="green">Đã duyệt</Tag> : <Tag color="orange">Đang chờ duyệt</Tag>,
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: BlogResponse) => (
                <div className="vaccine-action-buttons">
                    <Button className="detail-button" onClick={() => openDetailPopup(record)}>
                        <TbListDetails /> Chi tiết
                    </Button>
                </div>
            ),
        },
    ];

    const openDetailPopup = (blog: BlogResponse) => {
        setDetailBlog(blog);
    };

    const closeDetailPopup = () => {
        setDetailBlog(null);
    };

    return (
        <Staff1Layout>
            <div className="admin-blog-page-container">
                <div className="page-header">
                    <h1>Quản lý Blog của Bạn</h1>
                    <button className="addBlogButton" onClick={() => navigate("/staff/blogPost")}>
                        <IoMdAdd /> Thêm Blog
                    </button>
                </div>
                {error && <p className="error-message">Lỗi tải danh sách blog.</p>}
                {loading && <p className="loading-message">Loading...</p>}

                <Table
                    columns={columns}
                    dataSource={blogs.map((blog) => ({
                        ...blog,
                        id: blog.blogPostId || Math.random().toString(), // Đảm bảo có `id`
                        title: blog.title || "Chưa có dữ liệu",
                        content: blog.content || "Chưa có dữ liệu",
                        imageUrl: blog.imageUrl || "Chưa có dữ liệu",
                        createdAt: blog.createdAt || "",
                        isActive: blog.isActive,
                    }))}
                    rowKey="id"
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    className="account-table"
                />

                {detailBlog && (
                    <div className="popupOverlay" onClick={closeDetailPopup}>
                        <div className="popup" style={{ width: "800px" }} onClick={(e) => e.stopPropagation()}>
                            <button className="closeButton" onClick={closeDetailPopup}>×</button>
                            <h2 style={{ fontWeight: "bold", fontSize: "18px", position: "absolute", top: "20px" }}>
                                Chi tiết blog
                            </h2>

                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Thông tin blog" key="1">
                                    <div className="blog-detail-popups">
                                        <div className="blog-detail-popups-left">
                                            <img
                                                src={detailBlog.imageUrl}
                                                alt={"image"}
                                                style={{ width: "300px", height: "300px" }}
                                            />
                                        </div>

                                        <div className="blog-detail-popups-right">
                                            <p>
                                                <strong>Đề mục:</strong> {detailBlog.title || "Chưa có dữ liệu"}
                                            </p>
                                            <p>
                                                <strong>Nội dung:</strong> {detailBlog.content || "Chưa có dữ liệu."}
                                            </p>
                                            <p>
                                                <strong>Ngày đăng:</strong>{" "}
                                                {dayjs(detailBlog.createdAt).format("DD/MM/YYYY HH:mm") || "Chưa có dữ liệu"}
                                            </p>
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                )}
            </div>
        </Staff1Layout>
    );
};

export default StaffBlog;