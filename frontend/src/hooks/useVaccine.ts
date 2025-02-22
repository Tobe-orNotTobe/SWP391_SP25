import { useState, useEffect } from "react"

import { GetVaccineComboDetail, VaccineDetail, VaccineIntro } from "../interfaces/Vaccine";
import { apiGetComboVaccineDetail, apiGetVaccineDetail, apiGetVaccineIntro} from "../apis/apiVaccine";


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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] =useState<string | null>(null);

    useEffect(() => {
        const fetchComboVaccineDetail = async () => {
            try{
                const data = await apiGetComboVaccineDetail();
                if(data && data.result) {
                    setComboVaccineDetail(data.result);
                }
            }catch(err){
                console.log(err);
                setError("Error Fetching Combo Vaccine Data");
            }finally{
                setLoading(false);
            }
        };
        
        fetchComboVaccineDetail();
    })

    return {comboVaccineDetail, loading, error}
}