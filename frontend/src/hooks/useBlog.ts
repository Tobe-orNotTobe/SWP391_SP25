import {useEffect, useState} from "react";
import {BlogResponse} from "../interfaces/Blog.ts";
import {apiGetAll, apiGetAllBlog, apiGetAllNews, apiGetBlogById} from "../apis/apiBlog.ts";
import {NewsResponse} from "../interfaces/Blog.ts";

export const useGetAllBlog = () => {
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [news, setNews] = useState<NewsResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllBlog = async (isActive: boolean, blogType: string) => {
        setLoading(true);

        try {
            let response;
            if (blogType === "all") {
                response = await apiGetAll(isActive);
            }else if (blogType === "blog") {
                response = await apiGetAllBlog(isActive);
            }else {
                response = await apiGetAllNews(isActive);
            }
            if (response && response.result) {
                if (blogType === "news") {
                    setNews(response.result);
                }else {
                    setBlogs(response.result);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All Blog Data");
        } finally {
            setLoading(false);
        }
    };

    return { blogs, news, loading, error, fetchAllBlog};
};

export const useBlogByAuthor = (author: string) => {
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllBlog = async () => {
        setLoading(true);
        try {
            const response = await apiGetAll(true);
            if (response && response.result) {
                const filteredBlogs = response.result.filter(
                    (blog: BlogResponse) => blog.authorName === author
                );
                setBlogs(filteredBlogs);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All Blog Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBlog(); // Mặc định lấy blog active
    }, [author]); // Khi `author` thay đổi, fetch lại dữ liệu

    return { blogs, loading, error, fetchAllBlog };
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

export const useGetNewsDetailById = () => {
    const [newsDetail, setNewsDetail] = useState<NewsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchNewsDetail = async (newsId: number) => {
        setLoading(true);

        try {
            const response = await apiGetBlogById(newsId);
            if (response && response.result) {
                setNewsDetail(response.result);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching News Detail");
        } finally {
            setLoading(false);
        }
    };

    return { newsDetail, loading, error, fetchNewsDetail };
};

export const useRandomBlogs = () => {

    const handleGetRandomBlogs = (num: number, blogs: BlogResponse[]): BlogResponse[] => {
        const result = new Set<BlogResponse>();
        while (result.size < num && blogs.length > 0) {
            const randomIndex = Math.floor(Math.random() * blogs.length);
            result.add(blogs[randomIndex]);
        }
        return Array.from(result);
    };

    const handleGetRandomNews = (num: number, news: NewsResponse[]): NewsResponse[] => {
        const result = new Set<NewsResponse>();
        while (result.size < num && news.length > 0) {
            const randomIndex = Math.floor(Math.random() * news.length);
            result.add(news[randomIndex]);
        }
        return Array.from(result);
    }

    return {handleGetRandomBlogs, handleGetRandomNews}
};