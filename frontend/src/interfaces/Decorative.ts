
export interface ImgCarousel{
    image: string;
}

export interface BriefContent{
    image: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
}

export interface LoadingRedirectProps {
    message: string;
    delay: number; 
    to: string; 
}

export interface VaccineService {
    id: string;
    name: string;
    image: string; 
}

export interface NewsIntro {
    id: string;
    title: string;
    briefContent : string;
    image : string;
}