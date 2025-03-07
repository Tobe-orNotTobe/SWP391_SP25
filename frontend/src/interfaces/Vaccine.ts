export interface VaccineIntro{
    id: string;
    name: string;
    manufacturer: string;
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


export interface GetVaccineComboDetail {
    comboId: number;
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
    vaccineName : string;
    injectionSchedules: InjectionSchedule[];
  }
  
export interface VaccinationSchedule {
    scheduleId: number;
    ageRangeStart: number;
    ageRangeEnd: number;
    notes: string;
    vaccineScheduleDetails: VaccineScheduleDetail[];
}

export interface VaccineInventoryStock {
    vaccineInventoryId : number;
    vaccineId: number;
    name: string;
    manufacturer: string;
    batchNumber: string;
    manfacturingDate : Date;
    expiryDate : Date;
    supplier: string;
    initialQuantity : number;
    quantityInStock : number;
    totalQuantity: number,
    status: boolean;
}

export interface VaccineInventoryResponse {
    statusCode: string;
    isSuccess: boolean;
    errorMessages: string[];
    result: VaccineInventoryStock[];
}

export interface  VaccineInventory {
    vaccineId: number;
    batchNumber: string;
    manufacturingDate : string;
    expiryDate : string;
    initialQuantity: number;
    supplier: string;
}
  
export interface ComboDetailOfBoookingDetails {
    id: string;
    name: string;
    totalPrice: number;
  };

export interface VaccineDetailOfBoookingDetails {
    id: string;
    name: string;
    price: number;
  };
  