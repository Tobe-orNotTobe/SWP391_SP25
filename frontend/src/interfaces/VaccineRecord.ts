export interface VaccineRecord {
  vaccinationRecordId: string;
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
  vaccineName?: string;
  doseAmount?: number;
  price?: number;
  nextDoseDate: string | null;
  batchNumber?: string;
  status: string;
  notes: string;
}

export interface VaccineRecordUser {
    bookingId : number;
    fullName : string;
    dateOfBirth : string;
    height: number;
    weight: number;
    vaccineRecords: VaccineRecord[];
}

export interface CreateVaccineRecordResponse {
  statusCode: string; // Mã trạng thái phản hồi (VD: "OK", "ERROR")
  isSuccess: boolean; // Trạng thái thành công hay thất bại
  errorMessages: string[]; // Danh sách lỗi nếu có
  result: {
    vaccinationRecordId: number; // ID của bản ghi vaccine được tạo
    bookingId: number; // ID của lịch hẹn liên quan
    fullName: string; // Tên người đăng ký
    dateOfBirth: string; // Ngày sinh (ISO 8601 format)
    height: number; // Chiều cao (cm)
    weight: number; // Cân nặng (kg)
    vaccineRecords: VaccineRecord[]; // Danh sách các vaccine đã đăng ký
    message: string; // Thông báo từ API
  };
}
