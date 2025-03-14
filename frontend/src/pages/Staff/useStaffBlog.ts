import {useEffect, useState} from "react";
import {apiCreateBlog, apiDeleteBlog, apiGetBlogById, apiUpdateBlog} from "../../apis/apiBlog.ts";
import {BlogRequest, BlogResponse, UpdateBlogRequest} from "../../interfaces/Blog.ts";
import {notification} from "antd";
import {useForm} from "antd/es/form/Form";
import {useNavigate, useParams} from "react-router-dom";
import {decodeToken} from "../../utils/decodeToken.ts";

export const useDeleteBlog = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (blogId: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await apiDeleteBlog(blogId);
            if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi xảy ra, vui lòng thử lại.");
            notification.success({ message: "Xóa thành công!" });

        }catch (err: any) {
            notification.error({ message: "Lỗi", description: err.message || "Có lỗi xảy ra, vui lòng thử lại." });
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {handleDelete, isLoading, error}
}


export const useBlogForm = () => {
    const [form] = useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            apiGetBlogById(Number(id))
                .then((response) => {
                    if (response?.result) {
                        form.setFieldsValue({
                            ...response.result,
                        });
                        setEditorContent(response.result.content || "");
                        if (response.result.imageUrl) {
                            setImageUrl(response.result.imageUrl);
                        }
                    }
                })
                .catch(() => {
                    notification.error({ message: "Lỗi", description: "Không thể tải dữ liệu blogs." });
                })
                .finally(() => setLoading(false));
        }
    }, [id, form, isEditMode]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            if (isEditMode) {
                const updateBlogData: UpdateBlogRequest = {
                    ...values,
                };
                const response = await apiUpdateBlog(id, updateBlogData);
                if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi cập nhật blog");
                notification.success({ message: "Cập nhật thành công!" });
            } else {
                const newBlogData: BlogRequest = {
                    ...values,
                    authorName: decodeToken(localStorage.getItem("token"))?.
                   ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
                };
                const response = await apiCreateBlog(newBlogData);
                if (!response.isSuccess) throw new Error(response.errorMessages || "Lỗi tạo blog");
                notification.success({ message: "Tạo blog thành công!" });
            }
            navigate("/admin/blog");
        } catch (error: any) {
            notification.error({ message: "Lỗi", description: error.message || "Có lỗi xảy ra, vui lòng thử lại." });
        } finally {
            setLoading(false);
        }
    };
    return { form, isEditMode, handleSubmit, loading, editorContent, setEditorContent, imageUrl, setImageUrl };
};