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
    injectionsCount : number
    preserve: string;
    isParentId: number; // ID của vaccine cha (nếu là vaccine kết hợp)
    isIncompatibility: boolean; // Vaccine có tương kỵ với loại nào khác không
}


export interface GetVaccineComboDetail {
    comboId: number;
    comboName: string;
    description: string;
    totalPrice: number;
    isActive: boolean;
    vaccines: VaccineDetailOnCombo[];
}

export interface VaccineDetailOnCombo {
    order: number;
    intervalDays: number;
    vaccine: VaccineIntro;
}

export interface PostVaccineComboDetail {
    comboName: string;
    description: string;
    totalPrice: number;
    isActive: boolean;
    vaccines: PostVaccineOnComBo[];
}

export  interface  PostVaccineOnComBo {
    vaccineId: number,
    order: number,
    intervalDays: number,
}

export interface InjectionSchedule {
    injectionNumber: number;
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
    manufacturingDate : Date;
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
  
export interface ExportedVaccine {
    vaccineId: number;
    name: string;
    manufacturer: string;
    batchNumber: string;
    manufacturingDate : string;
    expiryDate : string;
    supplier: string;
    initialQuantity: number;
    quantityInStock : number;
    returnedQuantity : number;
    totalQuantity : number
    status: boolean;
}

export interface TopUseVaccine {
    vaccineId: number;
    vaccineName: string;
    count :number;
}