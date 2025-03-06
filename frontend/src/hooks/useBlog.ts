import {useEffect, useRef, useState} from "react";
import {BlogResponse} from "../interfaces/Blog.ts";
import {apiGetAllBlog} from "../apis/apiBlog.ts";

export const useGetAllBlog = () => {
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const hasFetched = useRef(false); // Biến kiểm tra đã gọi API hay chưa

    const fetchAllBlog = async () => {
        setLoading(true);

        try {
            const response = await apiGetAllBlog(true);
            if (response && response.result) {
                console.log("cac: " + response)
                setBlogs(response.result);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All Blog Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return; // Nếu đã gọi API trước đó thì không gọi lại
        fetchAllBlog();
        hasFetched.current = true; // Đánh dấu là đã gọi API
    }, []);

    return { blogs, loading, error, fetchAllBlog};
};