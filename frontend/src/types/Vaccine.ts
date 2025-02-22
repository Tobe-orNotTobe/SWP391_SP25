export interface VaccineIntro{
    id: number;
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
    vaccineId: number;
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
}

export interface GetVaccineResponse {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: string[];
    result: VaccineDetail[];
}
