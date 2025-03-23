import {useEffect, useState} from "react";
import {
    apiDashBoardFeedBack,
    apiDashBoardTotalRevenue,
    apiDashBoardRevenueLast10days,
    apiAdminGetRevenuePerDay
} from "../../../apis/apiAdmin.ts";


export interface Feedback{
    feedbackId: string;
    rating : number;
    comment: string;// Tren revenue thi hien thi 5 chu la dc r
    userName : string;
}

export interface Revenue {
    date: string;
    totalRevenue: number;
}

export const useRevenueLast10Days = () => {
    const [revenue, setRevenueLast10Days ] = useState<Revenue[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchRefundUserList =  async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiDashBoardRevenueLast10days();
                if (data.isSuccess) {
                    setRevenueLast10Days(data.result);
                }
            }catch (err){
                setError("error");
                console.log(err);
            }finally {
                setLoading(false);
            }
        }
        fetchRefundUserList();
    },[])
    return {revenue, loading, error};
}

export const useRevenueTotal = () =>{
    const [revenue, setRevenue] = useState<number>(0)
    const[loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>{
        const fetchRevenue = async () => {
            setError(null);
            setLoading(true);

            try {
                const data = await apiDashBoardTotalRevenue();
                if (data ) {
                    setRevenue(data.result);
                }
            }catch(err){
                setError("Lỗi");
                console.error(err);
            }finally {
                setLoading(false);
            }

        }
        fetchRevenue();
    },[])

    return{revenue, loading, error};
}

export const useFeedbackDetail = () =>{
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>{
        const fetchFeedback = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiDashBoardFeedBack();
                if (response.isSuccess) {

                    setFeedback(response.result);
                }
            } catch (err) {
                setError("Errrr");
                console.error(err);
            } finally {
                setLoading(false)
            }
        }
        fetchFeedback();
    }, [])

    return {feedback, loading, error};
}

export const useRevenueBydate = (date: string) => {
    const [revenueByDate, setRevenueByDate] = useState<Revenue[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (date) {
            const fetchRevenuteByDate = async () => {
                setLoading(true);
                setError(null);

                try {
                    const response = await apiAdminGetRevenuePerDay(date);
                    if (response.isSuccess) {
                        setRevenueByDate(response.result);
                    }
                } catch (err) {
                    setError("Error Fetching RevenueByDate");
                } finally {
                    setLoading(false);
                }
            };
            fetchRevenuteByDate();
        } else {

            setRevenueByDate([]);
            setLoading(false);
            setError(null);
        }
    }, [date]);

    return { revenueByDate, loading, error };
};
