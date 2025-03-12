import { useState } from "react";
import { NewsResponse } from "../interfaces/News.ts";
import { apiGetAllNews, apiGetBlogById, apiGetNewsById } from "../apis/apiBlog.ts";

export const useGetAllNews = () => {
    const [news, setNews] = useState<NewsResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllNews = async (isActive: boolean) => {
        setLoading(true);

        try {
            const response = await apiGetAllNews();
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
