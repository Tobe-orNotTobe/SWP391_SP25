import { useState, useEffect } from "react"

import { VaccineDetail, VaccineIntro, VaccineService } from "../types/Vaccine";
import { apiGetVaccineDetail, apiGetVaccineIntro, apiGetVaccineServiceIntro } from "../apis/apiVaccine";


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

export const useVaccineServiceIntro  = () => {
    const [vaccineServiceIntro, setVaccineServiceItnro] = useState<VaccineService[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() =>{
        const fetchVaccinceServiceIntro = async () => {
            setLoading(true);
            try{
                const data = await apiGetVaccineServiceIntro();
                setVaccineServiceItnro(data);
            }catch (err) {
                console.log(err)
                setError("Error Fetching Vaccine Package Intro Data")
            }finally{
                setLoading(false)
            }

        };

        fetchVaccinceServiceIntro();

    }, []);
    
    return {vaccineServiceIntro, loading, error};
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
                setVaccineDetail(data);
            }catch (err){
                console.log(err);
                setError("Error Fetching Vaccine Package Intro Data");
            }finally {
                setLoading(false);
            }
        };

        fetchVaccineDetail();
    }, [])

    return {vaccineDetail, loading, error}
}