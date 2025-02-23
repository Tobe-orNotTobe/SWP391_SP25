import { useState, useEffect } from "react"

import { GetVaccineComboDetail, VaccineDetail, VaccineIntro } from "../interfaces/Vaccine";
import { apiGetComboVaccineDetail, apiGetVaccineDetail, apiGetVaccineIntro, apiGetComBoVaccineById} from "../apis/apiVaccine";


export const useVaccineIntro = () =>{
    const[vaccineIntro, setVaccineIntro] = useState<VaccineIntro[]>([]);
    const[loading, setLoading] = useState<boolean>(false);
    const[error, setError] = useState<string>("");

    useEffect(() =>{
        const fetchVaccineIntro = async () =>{
            setLoading(true);
            try{
                const data = await apiGetVaccineIntro();
                setVaccineIntro(data);
            }catch (err){
                setError("Error Fetching Vaccine Intro Data");
                console.error(err)
            }finally{
                setLoading(false);
            }
        };

        fetchVaccineIntro();
    }, []);

    return {vaccineIntro, loading, error};   
}

export const useVaccineDetail = () => {
    const [vaccineDetail, setVaccineDetail] = useState<VaccineDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect ( () => {
        const fetchVaccineDetail = async () => {
            setLoading(true);
            try{
                const data = await apiGetVaccineDetail();
                if (data && data.result) {
                    setVaccineDetail(data.result);
                }
            }catch (err){
                console.log(err);
                setError("Error Fetching Vaccine Detail Data");
            }finally {
                setLoading(false);
            }
        };

        fetchVaccineDetail();
    }, [])

    return {vaccineDetail, loading, error}
}

export const useComboVaccineDetail = () => {
    const [comboVaccineDetail, setComboVaccineDetail] = useState<GetVaccineComboDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComboVaccineDetail = async () => {
            try {
                const data = await apiGetComboVaccineDetail();
                if (data?.result) {
                    setComboVaccineDetail(data.result);
                } else {
                    setError("Dữ liệu không hợp lệ");
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách combo vaccine:", err);
                setError("Lỗi tải dữ liệu Combo Vaccine");
            } finally {
                setLoading(false);
            }
        };

        fetchComboVaccineDetail();
    }, []); 

    return { comboVaccineDetail, loading, error };
}

export const useComboVaccineDetailById = (id: number | null) => {
    const [comboVaccineDetail, setComboVaccineDetail] = useState<GetVaccineComboDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        const fetchComboVaccineDetail = async () => {
            setLoading(true);
            try {
                const data = await apiGetComBoVaccineById(id);
                if (data && data.result) {
                    setComboVaccineDetail(data.result);
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải thông tin combo vaccine");
            } finally {
                setLoading(false);
            }
        };

        fetchComboVaccineDetail();
    }, [id]);

    return { comboVaccineDetail, loading, error };
};