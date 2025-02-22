
import { useState, useEffect } from "react";
import { ImgCarousel, BriefContent, BlogIntro } from "../../types/Decorative";
import { apiGetBlogIntro, apiGetBrieftContent, apiGetImgCarousel } from "../../apis/apiDecorative";



export const useImgCarousel = () =>{
    const[imgCarousel, setImgCarousel] = useState<ImgCarousel[]>([]);
    const[loading, setLoading] = useState<boolean>(false);
    const[error, setError] = useState<string>("");

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
        }, []);// Chạy 1 lần khi component mount
    
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
        }, []);// Chạy 1 lần khi component mount
    
        return {briefContent, loading, error};  
}

export const useNewsIntro = () => {
    const [newsIntro, setNewsIntro] = useState<BlogIntro[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchBlogIntro = async () =>{
            setLoading(true)
            try{
                const data = await apiGetBlogIntro();
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
