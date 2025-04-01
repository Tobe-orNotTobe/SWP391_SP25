export interface Booking {
  childId: number;
  notes: string;
  bookingDetails: BookingDetail[];
}

export interface BookingDetail {
  vaccineId: number | null;
  comboVaccineId: number | null;
  vaccineName: string | null;
  comboVaccineName: string | null;
  price: string | null;
  injectionDate: string | null
}

export interface BookingUser {
  bookingId: number;
  userId: string;
  childId: number;
  childName: string;
  bookingType: string;
  bookingDate: string;
  totalPrice: number;
  notes: string;
  status: string;
  bookingDetails: BookingDetail[];
}

export interface BookingResponse {
  bookingId: number;
  userId: string;
  childId: number;
  childName: string;
  bookingType: string;
  bookingDate: string;
  totalPrice: number;
  notes: string;
  status: string;
  bookingDetails: BookingDetailResponse[];
}

export interface BookingDetailResponse {
  bookingDetailId: number;
  childName: string;
  bookingDate: string;
  injectionDate: string;
  bookingType: string;
  price: string;
  note: string;
  status: string;
  vaccineId: number | null;
  comboVaccineId: number | null;
  vaccineName: string | null;
  comboVaccineName: string | null;
}

export interface BookingResult {
  bookingId: number;
  userId: string;
  childId: number;
  childName: string;
  bookingType: string;
  bookingDate: string;
  totalPrice: number;
  notes: string;
  status: string;
  bookingDetails: BookingDetail[];
}
