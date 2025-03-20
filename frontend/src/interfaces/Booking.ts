export interface Booking {
  childId: number;
  bookingDate: string;
  notes: string;
  bookingDetails: BookingDetail[];
}

export interface BookingDetail {
  vaccineId: number | null;
  comboVaccineId: number | null;
  vaccineName: string | null;
  comboVaccineName: string | null;
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
  bookingDetailId: number;
  childName: string;
  bookingDate: string;
  bookingType: string;
  totalPrice: string;
  note: string;
  status: string;
}

export interface BookingDetailResponse {
  bookingDetailId: number;
  childName: string;
  bookingDate: string;
  bookingType: string;
  price: string;
  note: string;
  status: string;
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
