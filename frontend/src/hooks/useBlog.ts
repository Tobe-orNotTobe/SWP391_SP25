import {useState} from "react";
import {BlogResponse} from "../interfaces/Blog.ts";
import {apiGetAllBlog, apiGetAllNews, apiGetBlogById} from "../apis/apiBlog.ts";
import {NewsResponse} from "../interfaces/Blog.ts";

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

export const useGetAllNews = () => {
    const [news, setNews] = useState<NewsResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllNews = async (isActive: boolean) => {
        setLoading(true);

        try {
            const response = await apiGetAllNews(isActive);
            if (response && response.result) {
                setNews(response.result);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All News Data");
        } finally {
            setLoading(false);
        }
    };

    return { news, loading, error, fetchAllNews };
};

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