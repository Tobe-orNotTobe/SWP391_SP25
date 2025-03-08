import {useEffect, useState} from "react";
import {FeedbackDetailByBookingIdResponse} from "../interfaces/Feedback.ts";
import {apiGetFeebBackUserByBookingId} from "../apis/apiBooking.ts";

export const useFeedBackDetailByBookingId = (bookingId: number) => {
    const [feedbackBookingId, setFeedbackBookingId] = useState<FeedbackDetailByBookingIdResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            setError(null);
            setLoading(true);
            try {
                const response = await apiGetFeebBackUserByBookingId(bookingId);
                if (response && response.result) {
                    setFeedbackBookingId(response.result);
                }
            } catch (error) {
                console.error(error);
                setError("Failed to fetch feedback");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchFeedback();
        }
    }, [bookingId]);

    return { feedbackBookingId, loading, error };
};