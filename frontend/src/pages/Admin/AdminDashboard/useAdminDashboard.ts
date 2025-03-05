import {useEffect, useState} from "react";
import {apiDashBoardFeedBack, apiDashBoardRevenue, apiExportedVaccines} from "../../../apis/apiAdmin.ts";


interface Revenue {
    id: string;
    revenue: number;
    date: string;
}

interface Feedback{
    id: string;
    rates : number;
    comment: string;// Tren revenue thi hien thi 5 chu la dc r
    userName : string;
}

interface ExportedVaccines {
    name: string;
    quantity: number;
}
export const useRevenueDetail = () =>{
    const [revenue, setRevenue] = useState<Revenue[]>([])
    const[loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>{
        const fetchRevenue = async () => {
            setError(null);
            setLoading(true);

            try {
                const data = await apiDashBoardRevenue();
                if (data ) {
                    // setRevernue(data.result);
                    setRevenue(data);
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
                if (response) {
                    console.log(response);
                    setFeedback(response);
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

export const useExportedVaccines = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [exportedVaccine, setExportedVaccine] = useState<ExportedVaccines[]>([]);

    useEffect(() => {
        const fetchVaccine = async () => {
            setLoading(true);
            setError(null);

            try{
                const response = await apiExportedVaccines();
                setExportedVaccine(response);
            }catch (err) {
                setError("ERRRRRRR");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchVaccine();
    }, []);

    return{exportedVaccine, loading, error};
}