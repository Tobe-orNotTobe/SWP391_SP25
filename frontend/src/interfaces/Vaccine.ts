export interface VaccineIntro{
    id: number;
    name: string;
    manufacturer: string;
    image: string;
}


export interface VaccineDetail {
    vaccineId: string;
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


export interface GetVaccineComboDetail {
    comboId: string;
    comboName: string;
    description: string;
    totalPrice: number;
    isActive: boolean;
    vaccines: VaccineDetail[];
}

export interface PostVaccineComboDetail {
    comboName: string;
    description: string;
    totalPrice: number;
    isActive: boolean;
    vaccineIds: number[];
}


export interface InjectionSchedule {
    doseNumber: number;
    injectionMonth: number;
    isRequired: boolean;
    notes: string;
  }
  
export interface VaccineScheduleDetail {
    vaccineId: number;
    injectionSchedules: InjectionSchedule[];
  }
  
export interface VaccinationSchedule {
    statusCode: string;
    isSuccess: true,
    errorMessages: [];
    scheduleId: number;
    ageRangeStart: number;
    ageRangeEnd: number;
    notes: string;
    vaccineScheduleDetails: VaccineScheduleDetail[];
}
  
  
  
  