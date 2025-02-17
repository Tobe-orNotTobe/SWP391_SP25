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
    id: string;
    name: string;
    price: string;
  }
  
  // Kiểu dữ liệu cho gói vắc xin
  export interface VaccinePackage {
    category: string;
    vaccines: Vaccine[];
  }