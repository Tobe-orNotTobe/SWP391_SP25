export interface BookingResponse {
    bookingId: number;
    userId: string;
    childId: number;
    childName: string | null;
    bookingType: string;
    bookingDate: Date;
    totalPrice: number;
    notes: string;
    status: string;
    bookingDetails: BookingDetailResponse[];
}

export interface BookingDetailResponse {
    vaccineId: number | null;
    comboVaccineId: number | null;
    vaccineName: string | null;
    comboVaccineName: string | null;
}