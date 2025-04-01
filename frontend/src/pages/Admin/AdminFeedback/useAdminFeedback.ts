import {useEffect, useState} from "react";
import {FeedbackResponse} from "../../../interfaces/Feedback.ts";
import {apiGetAllFeedback} from "../../../apis/apiFeedback.ts";

export const useGetAllFeedback = () => {
    const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchAllFeedback = async () => {
        setLoading(true);

        try {
            const response = await apiGetAllFeedback();
            if (response && response.result) {
                // console.log("cac: " + response)
                setFeedbacks(response.result);
            }
        } catch (err) {
            console.error(err);
            setError("Error Fetching All Blog Data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllFeedback();
    }, []);

    return { feedbacks, loading, error, fetchAllFeedback};
};