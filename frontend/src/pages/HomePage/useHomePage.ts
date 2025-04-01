
import { useState, useEffect } from "react";

import {
     apiGetBlogBasic,
    apiGetBrieftContent,
    apiGetImgCarousel,
    apiGetVaccineServiceIntro
} from "../../apis/apiBlog.ts";

import {BlogIntro} from "../../interfaces/Blog.ts";

export interface ImgCarousel{
    image: string;
}

export interface BriefContent{
    image: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
}

export interface VaccineService {
    id: string;
    name: string;
    image: string;
}

export const useNewIntro = () => {
    const [news, setNews] = useState<BlogIntro[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllNewsIntro = async () => {

            setLoading(true);
            setError(null);
            try {
                const response = await apiGetBlogBasic();
                if (response && Array.isArray(response)) {
                    // Lọc chỉ lấy blog có type === "Blog"
                    const filteredBlogs = response.filter((blog: BlogIntro) => blog.type === "News");
                    setNews(filteredBlogs);
                }
            }catch (err){
                setError("Error Fetching Blog Intro Data");
                console.error(err);
            }finally{
                setLoading(false)
            }
        }
        fetchAllNewsIntro();
    }, []);

    return { news, loading, error };

}
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



export const useBlogIntro = () => {
    const [blogs, setBlogs] = useState<BlogIntro[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllBlogIntro = async () => {

            setLoading(true);
            setError(null);
            try {
                const response = await apiGetBlogBasic();
                if (response && Array.isArray(response)) {
                    // Lọc chỉ lấy blog có type === "Blog"
                    const filteredBlogs = response.filter((blog: BlogIntro) => blog.type === "Blog");
                    setBlogs(filteredBlogs);
                }
            }catch (err){
                setError("Error Fetching Blog Intro Data");
                console.error(err);
            }finally{
                setLoading(false)
            }
        }
        fetchAllBlogIntro();
    }, []);

    return { blogs, loading, error };
};




