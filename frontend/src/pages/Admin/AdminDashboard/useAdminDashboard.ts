import {useEffect, useState} from "react";
import {apiDashBoardFeedBack, apiDashBoardTotalRevenue, apiDashBoardRevenueLast10days} from "../../../apis/apiAdmin.ts";


interface Feedback{
    id: string;
    rating : number;
    comment: string;// Tren revenue thi hien thi 5 chu la dc r
    userName : string;
}

interface RevenueLast10Days {
    date: string;
    totalRevenue: number;
}

export const useRevenueLast10Days = () => {
    const [revenue, setRevenueLast10Days ] = useState<RevenueLast10Days[]>([]);
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

