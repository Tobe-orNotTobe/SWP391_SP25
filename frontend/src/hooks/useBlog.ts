import {useState} from "react";
import {BlogResponse} from "../interfaces/Blog.ts";
import {apiGetAllBlog} from "../apis/apiBlog.ts";

export const useGetAllBlog = () => {
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllBlog = async (isActive: boolean) => {
        setLoading(true);
        setError("");

        try {
            const response = await apiGetAllBlog(isActive);
            if (response.result && Array.isArray(response.result)) {

                // Lọc chỉ lấy blog có type === "Blog"
                const filteredBlogs = response.result.filter((blog: BlogResponse) => blog.type === "Blog");
                setBlogs(filteredBlogs);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error Fetching All Blog Data");
        } finally {
            setLoading(false);
        }
    };

    return { blogs, loading, error, fetchAllBlog };
};
