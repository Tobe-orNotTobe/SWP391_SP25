import { useState, useEffect } from "react";
import { Vaccine, VaccinePackage, BookingDetailItem } from "../types/VaccineRegistration";

// Định nghĩa type cho booking detail item

const useVaccineSelection = () => {
  const [vaccineType, setVaccineType] = useState<"Gói" | "Lẻ">("Gói");
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [vaccinePackages, setVaccinePackages] = useState<VaccinePackage[]>([]);
  const [singleVaccines, setSingleVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Thêm state bookingDetails
  const [bookingDetails, setBookingDetails] = useState<BookingDetailItem[]>([]);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [vaccinesRes, comboRes] = await Promise.all([
          fetch("http://localhost:5260/api/Vaccine"),
          fetch("http://localhost:5260/api/ComboVaccine"),
        ]);
        
        if (!vaccinesRes.ok || !comboRes.ok) {
          throw new Error("Lỗi khi lấy dữ liệu từ API");
        }

        const vaccinesData = await vaccinesRes.json();
        const comboData = await comboRes.json();

        setSingleVaccines(vaccinesData.result);
        console.log(vaccinesData.result);
        setVaccinePackages(comboData.result);
        console.log(comboData.result);
      } catch (err) {
        setError("Không thể tải dữ liệu vắc xin. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);

  // Thêm useEffect để cập nhật bookingDetails khi selectedVaccines hoặc vaccineType thay đổi
  useEffect(() => {
    const newBookingDetails = selectedVaccines.map((id) => ({
      vaccineId: vaccineType === "Lẻ" ? Number(id) : null,
      comboVaccineId: vaccineType === "Gói" ? Number(id) : null
    }));
    setBookingDetails(newBookingDetails);
  }, [selectedVaccines, vaccineType]);

  const handleVaccineTypeChange = (type: "Gói" | "Lẻ") => {
    setVaccineType(type);
    setSelectedVaccines([]);
  };

  const handleSelectVaccine = (vaccineId: string) => {
    setSelectedVaccines((prevSelected) => {
      let updatedSelection;
      if (prevSelected.includes(vaccineId)) {
        updatedSelection = prevSelected.filter((id) => id !== vaccineId);
      } else {
        updatedSelection = [...prevSelected, vaccineId];
      }

      console.log("Vắc xin đã chọn:", updatedSelection);
      console.log(bookingDetails)
      console.log()
      return updatedSelection;
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

const handleSelectBookingDate = (bookingDate: Date) => {
  if (!(bookingDate instanceof Date) || isNaN(bookingDate.getTime())) {
    throw new Error("Invalid date provided");
  }
  setBookingDate(bookingDate.toISOString()); // Lưu dạng ISO 8601
};
  

  const getBookingDetails = () => {
    return {
      bookingDetails: bookingDetails
    };
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
    bookingDetails, // Thêm vào object return
    handleVaccineTypeChange,
    handleSelectVaccine,
    toggleCategory,
    getBookingDetails,
    handleSelectBookingDate,
  };
};

export default useVaccineSelection;