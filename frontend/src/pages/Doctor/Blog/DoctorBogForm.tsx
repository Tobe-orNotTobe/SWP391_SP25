import React, { useState, useEffect } from "react";
import {Form, Input, Upload, Button, notification, Select} from "antd";
import { useBlogForm } from "../useDoctorBlog.ts";
import { Editor } from "@tinymce/tinymce-react";
import { uploadImageToCloudinary } from "../../../utils/cloudinary.ts";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {TinyMCEE_API_KEY} from "../../../config/cloudinaryConfig.ts"


const DoctorBlogForm: React.FC = () => {
    const { form, isEditMode, handleSubmit, loading, editorContent, setEditorContent, imageUrl } = useBlogForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [content, setContent] = useState<string>(""); // Nội dung TinyMCE
    // const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const navigate = useNavigate();

    // Cập nhật nội dung khi chỉnh sửa
    useEffect(() => {
        const initialContent = form.getFieldValue("content");
        if (initialContent) setContent(initialContent);

        const initialImageUrl = form.getFieldValue("imageUrl");
        if (initialImageUrl) setPreviewUrl(initialImageUrl);
    }, [form]);


    // // Xử lý chọn ảnh
    // const handleImageChange = (info: any) => {
    //     const file = info.file.originFileObj;
    //     if (file) {
    //         setImageFile(file);
    //         setPreviewUrl(URL.createObjectURL(file)); // Tạo URL xem trước
    //     }
    // };
    //
    // // Xử lý thay đổi nội dung TinyMCE
    // const handleEditorChange = (newContent: string) => {
    //     setContent(newContent);
    //     form.setFieldsValue({ content: newContent });
    // };

    // Kiểm tra nội dung bài viết trước khi submit
    const validateContent = (): boolean => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        const hasH1 = doc.querySelector("h1") !== null;
        const hasImage = doc.querySelectorAll("img").length > 0;
        const textContent = doc.body.textContent;
        const hasText = textContent !== null && textContent.trim().length >= 100;
        const imageCount = doc.querySelectorAll("img").length;
        const hasParagraph = doc.querySelector("p") !== null;

        if (!hasH1) {
            notification.error({ message: "Lỗi", description: "Bài viết phải có ít nhất một tiêu đề chính (H1)." });
            return false;
        }
        if (!hasImage) {
            notification.error({ message: "Lỗi", description: "Bài viết phải có ít nhất một hình ảnh." });
            return false;
        }
        if (!hasText) {
            notification.error({ message: "Lỗi", description: "Bài viết phải có ít nhất 100 ký tự nội dung." });
            return false;
        }
        if (imageCount > 10) {
            notification.error({ message: "Lỗi", description: "Bài viết không được chứa quá 10 hình ảnh." });
            return false;
        }
        if (!hasParagraph) {
            notification.error({ message: "Lỗi", description: "Bài viết phải có ít nhất một đoạn mô tả." });
            return false;
        }
        return true;
    };

    // Xử lý upload ảnh từ TinyMCE
    const imageUploadHandler = async (blobInfo: any): Promise<string> => {
        try {
            const imageUrl = await uploadImageToCloudinary(blobInfo.blob());
            // setUploadedImages((prevImages) => [...prevImages, imageUrl]);
            if (imageUrl) {
                return imageUrl;
            }
            notification.error({ message: "Lỗi", description: "Lỗi upload hình ảnh." });
            return "";
        } catch (error) {
            console.error("Image upload failed:", error);
            throw error;
        }
    };

    // Xử lý submit form
    const onFinish = async (values: any) => {
        if (!validateContent()) return;

        let imageUrl = values.imageUrl;
        if (imageFile) {
            try {
                imageUrl = await uploadImageToCloudinary(imageFile);
            } catch (error) {
                notification.error({ message: "Lỗi", description: "Tải ảnh thất bại." });
                return;
            }
        }

        const formData = { ...values, content, imageUrl };
        await handleSubmit(formData);
    };


    return (
            <div style={{padding: "20px"}}>
                <div className="form-header">
                    <Button
                        icon={<ArrowLeftOutlined/>}
                        onClick={() => navigate("/staff/blogManager")}
                        className="back-button"
                    >
                        Quay lại danh sách
                    </Button>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="account-form"
                >
                    <h2 style={{ paddingTop: "10px" }} className="blog-form-title">
                        {isEditMode ? "Chỉnh sửa Blog" : "Tạo Blog"}
                    </h2>

                    <Form.Item name="title" label="Đề mục:"
                               rules={[{ required: true, message: "Vui lòng nhập đề mục." }]}
                    >
                        <Input placeholder="Nhập tiêu đề blog" />
                    </Form.Item>

                    <Form.Item name="type" label="Loại">
                        <Select placeholder="Chọn quyền">
                            <Select.Option value="Blog">Blog</Select.Option>
                            <Select.Option value="News">News</Select.Option>
                        </Select>
                    </Form.Item>
                    {isEditMode && (
                        <Form.Item name="isActive" label="Trạng thái">
                            <Select placeholder="Trạng thái" defaultValue={true}>
                                <Select.Option value={true}>Active</Select.Option>
                                <Select.Option value={false}>Deactive</Select.Option>
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item name="imageUrl" label="Ảnh minh họa:">
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                setImageFile(file);
                                setPreviewUrl(URL.createObjectURL(file));
                                return false; // Ngăn không cho upload tự động
                            }}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Xem trước" style={{ width: "100%" }} />
                            ) : isEditMode ? (
                                <img src={imageUrl} alt="Xem trước" style={{ width: "100%" }} />
                            ) : (
                                "+ Upload"
                            )}
                        </Upload>
                    </Form.Item>

                    <div>
                        <h2>Text Editor</h2>
                        <Editor
                            apiKey={TinyMCEE_API_KEY}
                            value={editorContent}
                            onEditorChange={(newContent) => {
                                setEditorContent(newContent);
                                setContent(newContent); // Đồng bộ nội dung
                            }}
                            init={{
                                height: 500,
                                menubar: true,
                                plugins: "image lists link table code",
                                toolbar:
                                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | image",
                                images_upload_handler: imageUploadHandler,
                                automatic_uploads: true,
                                file_picker_types: "image",
                            }}
                        />
                    </div>

                    <Form.Item style={{ display: "flex", justifyContent: "end" }}>
                        <Button htmlType="submit" loading={loading} style={{ marginTop: "20px" }}>
                            {isEditMode ? "Cập nhật" : "Đăng bài"}
                        </Button>
                    </Form.Item>
                </Form>

            </div>
    );
};

export default DoctorBlogForm;
