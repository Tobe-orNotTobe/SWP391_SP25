// Kiểu dữ liệu cho thông tin trẻ
export interface Child {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
}

// Kiểu dữ liệu cho thông tin phụ huynh
export interface Parent {
  customerCode: string;
  parentName: string;
  children: Child[];
}

// Kiểu dữ liệu cho form đăng ký
export interface FormData {
  fullName: string;
  birthDate: string;
  gender: string;
  customerCode: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  contactName: string;
  relationship: string;
  contactPhone: string;
  vaccineType: string;
  vnvcCenter: string;
  vaccinationDate: string;
}

// Kiểu dữ liệu cho vắc xin
export interface Vaccine {
  vaccineId: string;
  name: string;
  description: string;
  manufacturer: string;
  sideEffect: string;
  diseasePrevented: string;
  price: string;
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

// Kiểu dữ liệu cho gói vắc xin
export interface VaccinePackage {
  comboId: string;
  comboName: string;
  description: string;
  totalPrice: string;
  isActive: boolean;
  vaccines: [Vaccine];
}

export interface BookingDetailItem {
  vaccineId: number | null;
  comboVaccineId: number | null;
}
