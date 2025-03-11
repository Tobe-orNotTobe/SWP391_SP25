export interface VaccineRecord {
    vaccineName: string;
    doseAmount: number;
    price: number;
    nextDoseDate: string | null;
    batchNumber: string;
    status: string;
    notes: string;
  }
  
  export interface VaccineRecordResponse {
    statusCode: string;
    isSuccess: boolean;
    errorMessages: string[];
    result: {
      vaccinationRecordId: number;
      bookingId: number;
      fullName: string;
      dateOfBirth: string;
      height: number;
      weight: number;
      vaccineRecords: VaccineRecord[];
      message: string;
    };
  }
  
  export interface UpdateVaccineRecordRequest {
    notes: string;
    status: string;
    nextDoseDate: string;
  }
  