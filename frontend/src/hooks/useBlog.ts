import {useState} from "react";
import {BlogResponse} from "../interfaces/Blog.ts";
import {apiGetAllBlog, apiGetBlogById} from "../apis/apiBlog.ts";

export const useGetAllBlog = () => {
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllBlog = async (isActive: boolean) => {
        setLoading(true);

        try {
            const response = await apiGetAllBlog(isActive);
            if (response && response.result) {
                setBlogs(response.result);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All Blog Data");
        } finally {
            setLoading(false);
        }
    };

    return { blogs, loading, error, fetchAllBlog};
};

export const useGetBlogDetailById = () => {
    const [blog, setBlog] = useState<BlogResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchBlogDetail = async (blogId: number) => {
        setLoading(true);

        try {
            const response = await apiGetBlogById(blogId);
            if (response && response.result) {
                setBlog(response.result);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All Blog Data");
        } finally {
            setLoading(false);
        }
    };

    return { blog, loading, error, fetchBlogDetail};
}