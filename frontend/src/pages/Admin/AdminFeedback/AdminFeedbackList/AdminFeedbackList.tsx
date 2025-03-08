import React, {useState} from "react"
import {useGetAllFeedback} from "../useAdminFeedback.ts";
import {Button, Table, Tabs} from "antd";
import {TbListDetails} from "react-icons/tb";
// import {FiEdit2} from "react-icons/fi";
// import {MdDeleteOutline} from "react-icons/md";
import dayjs from "dayjs";
// import {IoMdAdd} from "react-icons/io";
import AdminLayout from "../../../../components/Layout/AdminLayout/AdminLayout.tsx";
import {FeedbackResponse} from "../../../../interfaces/Feedback.ts";
import "./AdminFeedbackList.scss"

const AdminFeedbackListPage: React.FC = () => {
    const { feedbacks, loading, error} = useGetAllFeedback();
    const [ detailFeedback, setDetailFeedback] = useState<FeedbackResponse | null>(null);

    const columns = [
        { title: "ID", dataIndex: "feedbackId", key: "feedbackId" },
        {
            title: "ID người dùng",
            dataIndex: "userId",
            key: "userId",
            render: (userId: string) => userId.length > 10 ? `${userId.slice(0, 15)}...` : userId
        },
        {
            title: "Tên người dùng",
            dataIndex: "userName",
            key: "userName",
            render: (userName: string) => userName.length > 20 ? `${userName.slice(0, 20)}...` : userName
        },
        {
            title: "ID booking",
            dataIndex: "bookingId",
            key: "bookingId",
            render: (bookingId: string) => bookingId.length > 20 ? `${bookingId.slice(0, 20)}...` : bookingId
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            render: (rating: string) => rating.length > 20 ? `${rating.slice(0, 20)}...` : rating
        },
        {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
            render: (comment: string) => comment.length > 20 ? `${comment.slice(0, 20)}...` : comment
        },
        {
            title: "Ngày đăng",
            dataIndex: "dateSubmitted",
            key: "dateSubmitted",
            render: (date: any) => date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Chưa có dữ liệu"
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: undefined, record: FeedbackResponse) => (
                <div className="vaccine-action-buttons">
                    <Button  className="detail-button" onClick={() => openDetailPopup(record)}>
                        <TbListDetails/>Chi tiết
                    </Button>
                    {/*<Button className="delete-button">*/}
                    {/*    <MdDeleteOutline/> Xóa*/}
                    {/*</Button>*/}
                </div>
            ),
        },
    ];

    const openDetailPopup = (feedback: FeedbackResponse) => {
        setDetailFeedback(feedback);
    }

    const closeDetailPopup = () => {
        setDetailFeedback(null);
    }

    return (
      <>
          <AdminLayout>
              <div className="admin-feedback-page-container">
                  {/*<div className="page-header">*/}
                  {/*    <h1>Quản lý Blog</h1>*/}
                  {/*    <button className="addBlogButton" onClick={() => navigate("/admin/feedback/add")}>*/}
                  {/*        <IoMdAdd/> Thêm Blog.*/}
                  {/*    </button>*/}
                  {/*</div>*/}
                  {error && ("Lỗi tải danh sách feedback.")}
                  {loading && ("Loading...")}

                  <Table
                      columns={columns}
                      dataSource={Array.isArray(feedbacks) ? feedbacks.map(feedback => ({
                          ...feedback,
                          id: feedback.feedbackId || Math.random().toString(), // Đảm bảo có `id`
                          userId: feedback.userId || "Chưa có dữ liệu",
                          userName: feedback.userName || "Chưa có dữ liệu",
                          bookingId: feedback.bookingId || "Chưa có dữ liệu",
                          rating: feedback.rating || 0,
                          comment: feedback.comment || "Chưa có dữ liệu",
                          dateSubmitted: feedback.dateSubmitted || "Chưa có dữ liệu",
                      })) : []}
                      rowKey="id"
                      pagination={{pageSize: 8, showSizeChanger: false}}
                      className="account-table"
                  />

                  {detailFeedback && (
                      <div className="popupOverlay" onClick={closeDetailPopup}>
                          <div className="popup" style={{width: "800px"}} onClick={(e) => e.stopPropagation()}>
                              <button className="closeButton" onClick={closeDetailPopup}>×</button>
                              <h2 style={{fontWeight: "bold", fontSize: "18px", position: "absolute", top: "20px"}}>Chi tiết Feedback</h2>

                              <Tabs defaultActiveKey="1">
                                  <Tabs.TabPane tab="Thông tin feedback" key="1">
                                      <div className="feedback-detail-popups">
                                          <div className="feedback-detail-popups-left">
                                              <p><strong style={{paddingRight: "2px"}}>ID:
                                              </strong> {detailFeedback.feedbackId || "Chưa có dữ liệu"}
                                              </p>
                                              <p><strong style={{paddingRight: "2px"}}>ID người dùng:</strong>
                                                  {detailFeedback.userId || "Chưa có dữ liệu."}
                                              </p>
                                              <p><strong style={{paddingRight: "2px"}}>ID booking:</strong>
                                                  {detailFeedback.bookingId || "Chưa có dữ liệu."}
                                              </p>
                                          </div>

                                          <div className="feedback-detail-popups-right">
                                              <p><strong style={{paddingRight: "2px"}}>Tên người dùng:</strong>
                                                  {detailFeedback.userName || "Chưa có dữ liệu."}
                                              </p>
                                              <p><strong style={{paddingRight: "2px"}}>Rating:</strong>
                                                  {detailFeedback.rating || "Chưa có dữ liệu."}
                                              </p>
                                              <p><strong style={{paddingRight: "2px"}}>Comment:</strong>
                                                  {detailFeedback.comment || "Chưa có dữ liệu."}
                                              </p>
                                              <p><strong style={{paddingRight: "2px"}}>Ngày đăng:
                                              </strong> {dayjs(detailFeedback.dateSubmitted).format("DD/MM/YYYY HH:mm") || "Chưa có dữ liệu"}
                                              </p>
                                          </div>
                                      </div>
                                  </Tabs.TabPane>
                              </Tabs>
                          </div>
                      </div>
                  )}

              </div>
          </AdminLayout>
      </>
    );
}

export default AdminFeedbackListPage;