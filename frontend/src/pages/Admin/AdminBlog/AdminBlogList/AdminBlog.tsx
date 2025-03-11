import React, {useEffect, useState} from "react";
import {Button, Table, Tabs} from "antd";
import {TbListDetails} from "react-icons/tb";
import {FiEdit2} from "react-icons/fi";
import {MdDeleteOutline} from "react-icons/md";
import {IoMdAdd} from "react-icons/io";
import {useDeleteBlog, useUpdateBlogActive} from "../useAdminBlog.ts";
import {useGetAllBlog} from "../../../../hooks/useBlog.ts"
import dayjs from "dayjs";
import {BlogResponse} from "../../../../interfaces/Blog.ts";
import "./AdminBlog.scss"
import {useNavigate} from "react-router-dom";
import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";

const { TabPane } = Tabs;

interface AdminBlogProps {
    isActive?: boolean;
}

const AdminBlogPage: React.FC<AdminBlogProps> = ({isActive = true}) => {

    const navigate = useNavigate();
    const {blogs, loading, error, fetchAllBlog} = useGetAllBlog();
    const [detailBlog, setDetailBlog] = useState<BlogResponse | null>(null);
    const {handleDelete} = useDeleteBlog();
    const {handleUpdateActive} = useUpdateBlogActive();

    // const [searchText, setSearchText] = useState<string>("");
    // const [sortColumn, setSortColumn] = useState<string | null>(null);
    // const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>(null);


    useEffect(() => {
        fetchAllBlog(isActive);
    }, []);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Đề mục",
            dataIndex: "title",
            key: "title",
            render: (title: string) => title.length > 10 ? `${title.slice(0, 15)}...` : title
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            render: (content: string) => content.length > 20 ? `${content.slice(0, 20)}...` : content
        },
        {
            title: "Hình minh họa",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (imageUrl: string) => (
                imageUrl && imageUrl !== "Chưa có dữ liệu" ? (
                    <img
                        src={imageUrl}
                        alt="Hình minh họa"
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }}
                    />
                ) : "Chưa có dữ liệu"
            )
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: any) => date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Chưa có dữ liệu"
        },
        {
            title: "Tác giả",
            dataIndex: "authorName",
            key: "authorName",
            render: (authorName: string) => authorName.length > 10 ? `${authorName.slice(0, 15)}...` : authorName
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: BlogResponse) => (
                <div className="vaccine-action-buttons">
                    <Button className="detail-button" onClick={() => openDetailPopup(record)}>
                        <TbListDetails/>Chi tiết
                    </Button>
                    {!isActive ? (
                        <Button className="edit-button" onClick={() => handleUpdateActive(record).then(() => fetchAllBlog(isActive))}>
                            <FiEdit2/>Duyệt
                        </Button>
                    ): (
                        <div>
                            <Button className="edit-button" onClick={() => navigate(`/admin/blog/edit/${record.blogPostId}`)}>
                                <FiEdit2/>Chỉnh sửa
                            </Button>

                            <Button className="delete-button" onClick={() =>
                                handleDelete(record.blogPostId).then(() => fetchAllBlog(isActive))
                            }>
                                <MdDeleteOutline/> Xóa
                            </Button>

                        </div>
                    )}


                </div>
            ),
        },
    ];

    const openDetailPopup = (blog: BlogResponse) => {
        setDetailBlog(blog);
    }

    const closeDetailPopup = () => {
        setDetailBlog(null);
    }

    return (
        <>
            <AdminLayout>
                <div className="admin-blog-page-container">
                    <div className="page-header">
                        <h1>Quản lý Blog</h1>
                        <button className="addBlogButton" onClick={() => navigate("/admin/blog/add")}>
                            <IoMdAdd/> Thêm Blog.
                        </button>
                    </div>
                    {error && ("Lỗi tải danh sách blog.")}
                    {loading && ("Loading...")}

                    {/*<Select*/}
                    {/*    placeholder="Chọn cột"*/}
                    {/*    // value={sortColumn}*/}
                    {/*    // onChange={setSortColumn}*/}
                    {/*    style={{width: 150}}*/}
                    {/*>*/}
                    {/*    <Select.Option value="comboId">Số thứ tự</Select.Option>*/}
                    {/*    <Select.Option value="comboName">Gói combo</Select.Option>*/}
                    {/*    <Select.Option value="description">Giới thiệu</Select.Option>*/}
                    {/*    <Select.Option value="totalPrice">Tổng giá</Select.Option>*/}
                    {/*</Select>*/}


                    <Table
                        columns={columns}
                        dataSource={Array.isArray(blogs) ? blogs.map(blog => ({
                            ...blog,
                            id: blog.blogPostId || Math.random().toString(), // Đảm bảo có `id`
                            title: blog.title || "Chưa có dữ liệu",
                            content: blog.content || "Chưa có dữ liệu",
                            imageUrl: blog.imageUrl || "Chưa có dữ liệu",
                            createdAt: blog.createdAt || "",
                            authorName: blog.authorName || "Chưa có dữ liệu"
                        })) : []}
                        rowKey="id"
                        pagination={{pageSize: 8, showSizeChanger: false}}
                        className="account-table"
                    />

                    {detailBlog && (
                        <div className="popupOverlay" onClick={closeDetailPopup}>
                            <div className="popup" style={{width: "800px"}} onClick={(e) => e.stopPropagation()}>
                                <button className="closeButton" onClick={closeDetailPopup}>×</button>
                                <h2 style={{fontWeight: "bold", fontSize: "18px", position: "absolute", top: "20px"}}>Chi tiết blog</h2>

                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Thông tin blog" key="1">
                                        <div className="blog-detail-popups">
                                            <div className="blog-detail-popups-left">
                                                <img src={detailBlog.imageUrl} alt={"image"} style={{width: "300px", height: "300px"}}/>
                                            </div>

                                            <div className="blog-detail-popups-right">
                                                <p><strong style={{paddingRight: "2px"}}>Đề mục:
                                                </strong> {detailBlog.title || "Chưa có dữ liệu"}
                                                </p>
                                                {/*<p><strong style={{paddingRight: "2px"}}>Nội dung:</strong>*/}
                                                {/*    {detailBlog.content || "Chưa có dữ liệu."}*/}
                                                {/*</p>*/}
                                                <p><strong style={{paddingRight: "2px"}}>Ngày đăng:
                                                </strong> {dayjs(detailBlog.createdAt).format("DD/MM/YYYY HH:mm") || "Chưa có dữ liệu"}
                                                </p>
                                                <p><strong style={{paddingRight: "2px"}}>Tác giả:
                                                </strong> {detailBlog.authorName || "Chưa có dữ liệu."}
                                                </p>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    )}

                </div>
            </AdminLayout>
        </>
    );
}

export default AdminBlogPage;