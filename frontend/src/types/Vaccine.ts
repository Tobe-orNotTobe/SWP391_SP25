export interface VaccineIntro{
    id: string;
    name: string;
    manufacturer: string;
    image: string;
}

export interface VaccineService {
    id: string;
    name: string;
    image: string; 
}

export interface VaccineDetail {
    id: number;
    name: string;
    description: string;
    manufacturer: string;
    sideEffect: string;
    diseasePrevented: string;
    price: number;
    status: boolean;
    isNecessary: boolean;
    image: string;
    injectionSite: string;
    notes: string;
    vaccineInteractions: string;
    undesirableEffects: string;
    preserve: string;
    injectionsCount: number;
    distance: number;
    scheduleId: number;
}