
import { useState, useEffect } from "react";
import { ImgCarousel, BriefContent, VaccineService, NewsIntro } from "../../interfaces/Decorative";
import {  apiGetBrieftContent, apiGetImgCarousel, apiGetNewsIntro, apiGetVaccineServiceIntro} from "../../apis/apiDecorative";
import {IsLoginSuccessFully} from "../../validations/IsLogginSuccessfully.ts";


export const useImgCarousel = () =>{
    const[imgCarousel, setImgCarousel] = useState<ImgCarousel[]>([]);
    const[loading, setLoading] = useState<boolean>(false);
    const[error, setError] = useState<string>("");

    const {sub} =IsLoginSuccessFully();

    console.log(sub);

     useEffect(() =>{
            const fetchVaccineIntro = async () =>{
                setLoading(true);
                try{
                    const data = await apiGetImgCarousel();
                    setImgCarousel(data);
                }catch (err){
                    setError("Error Fetching Vaccine Intro Data");
                    console.error(err)
                }finally{
                    setLoading(false);
                }
            };
    
            fetchVaccineIntro();
        }, []);
    
        return {imgCarousel, loading, error};  
}

export const useBriefContent = () =>{
    const[briefContent, setBriefContent] = useState<BriefContent[]>([]);
    const[loading, setLoading] = useState<boolean>(false);
    const[error, setError] = useState<string>("");

     useEffect(() =>{
            const fetchVaccineIntro = async () =>{
                setLoading(true);
                try{
                    const data = await apiGetBrieftContent();
                    setBriefContent(data);
                }catch (err){
                    setError("Error Fetching Vaccine Intro Data");
                    console.error(err)
                }finally{
                    setLoading(false);
                }
            };
    
            fetchVaccineIntro();
        }, []);
    
        return {briefContent, loading, error};  
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

export const useNewsIntro = () => {
    const [newsIntro, setNewsIntro] = useState<NewsIntro[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchBlogIntro = async () =>{
            setLoading(true)
            try{
                const data = await apiGetNewsIntro();
                setNewsIntro(data);
            } catch (err) {
                setError("Error fetching Blog Intro Data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchBlogIntro();
    }, []);

    return {newsIntro, loading, error};
}

