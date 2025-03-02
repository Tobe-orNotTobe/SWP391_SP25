import { useState, useEffect } from "react";
import { Vaccine, VaccinePackage, BookingDetail } from "../interfaces/VaccineRegistration.ts";
import { useVaccineDetail, useComboVaccineDetail } from "./useVaccine";

const useVaccineSelection = () => {
  const [vaccineType, setVaccineType] = useState<"Gói" | "Lẻ">("Gói");
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);

  // Sử dụng hook useVaccineDetail và useComboVaccineDetail để lấy dữ liệu
  const {
    vaccineDetail: singleVaccines,
    loading: vaccineLoading,
    error: vaccineError,
  } = useVaccineDetail();

  const {
    comboVaccineDetail: vaccinePackages,
    loading: comboLoading,
    error: comboError,
  } = useComboVaccineDetail();

  // Cập nhật loading và error state dựa trên kết quả từ hai hook trên
  useEffect(() => {
    if (vaccineLoading || comboLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [vaccineLoading, comboLoading]);

  useEffect(() => {
    if (vaccineError || comboError) {
      setError(vaccineError || comboError);
    }
  }, [vaccineError, comboError]);

  // Cập nhật bookingDetails khi selectedVaccines hoặc vaccineType thay đổi
  useEffect(() => {
    const newBookingDetails = selectedVaccines.map((id) => ({
      vaccineId: vaccineType === "Lẻ" ? Number(id) : null,
      comboVaccineId: vaccineType === "Gói" ? Number(id) : null,
    }));
    setBookingDetails(newBookingDetails);
  }, [selectedVaccines, vaccineType]);

  // Xử lý thay đổi loại vaccine (Gói hoặc Lẻ)
  const handleVaccineTypeChange = (type: "Gói" | "Lẻ") => {
    setVaccineType(type);
    setSelectedVaccines([]); // Reset danh sách vaccine đã chọn khi thay đổi loại
  };

  // Xử lý chọn vaccine
  const handleSelectVaccine = (vaccineId: string) => {
    setSelectedVaccines((prevSelected) => {
      if (prevSelected.includes(vaccineId)) {
        return prevSelected.filter((id) => id !== vaccineId); // Bỏ chọn nếu đã chọn
      } else {
        return [...prevSelected, vaccineId]; // Thêm vào danh sách đã chọn
      }
    });
  };

  // Xử lý mở rộng/thu gọn danh mục
  const toggleCategory = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  // Xử lý chọn ngày đặt lịch
  const handleSelectBookingDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Ngày không hợp lệ");
    }
    setBookingDate(date.toISOString()); // Lưu dưới dạng chuỗi ISO 8601
  };

  // Trả về thông tin bookingDetails
  const getBookingDetails = () => {
    return bookingDetails;
  };

  return {
    vaccineType,
    selectedVaccines,
    expandedCategory,
    vaccinePackages,
    singleVaccines,
    bookingDate,
    loading,
    error,
    bookingDetails,
    handleVaccineTypeChange,
    handleSelectVaccine,
    toggleCategory,
    getBookingDetails,
    handleSelectBookingDate,
  };
};

export default useVaccineSelection;