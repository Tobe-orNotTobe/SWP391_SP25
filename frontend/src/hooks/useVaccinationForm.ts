import { useState } from "react";
import axios from "axios";
import { Parent, Child, BookingDetail, Booking } from "../types/VaccineRegistration";
import { getChildren } from "../apis/apiChildren";
import { apiBooking } from "../apis/apiBooking"; // Sử dụng hàm apiBooking đã được tách riêng

const useVaccinationForm = () => {
  const [booking, setBooking] = useState<Booking>({
    childId: "",
    bookingDate: "",
    notes: "",
    bookingDetails: [],
  });

  const [isFormSplit, setIsFormSplit] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [parentInfo, setParentInfo] = useState<Parent | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm xử lý tìm kiếm thông tin phụ huynh và trẻ
  const handleSearch = async () => {
    const userId = "f2385d11-1597-4ca9-aa96-b4443076c6c2"; // Giả sử userId là cố định

    if (!userId) {
      alert("Vui lòng nhập mã khách hàng.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getChildren(userId);
      if (data.isSuccess && data.result) {
        const children = data.result.map((child: Child) => ({
          childId: child.childId,
          fullName: child.fullName,
          dateOfBirth: child.dateOfBirth.split("T")[0],
          gender: child.gender === "Female" ? "Nữ" : "Nam",
        }));

        setParentInfo({
          customerCode: userId,
          parentName: userId, // Có thể thay bằng data.parentName nếu API trả về
          children: children,
        });
      } else {
        setError("Không tìm thấy thông tin phụ huynh.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý chọn trẻ
  const handleSelectChild = (child: Child | null) => {
    setSelectedChild(child);
    setIsFormSplit(!!child); // Chia form nếu có trẻ được chọn
  };

  // Hàm xử lý thêm trẻ mới
  const handleAddNewChild = () => {
    setSelectedChild(null); // Bỏ chọn trẻ hiện tại
  };

  // Hàm gửi dữ liệu đặt lịch tiêm chủng
  const submitBooking = async (bookingDate: string, bookingDetails: BookingDetail[]) => {
    if (!selectedChild) {
      alert("Vui lòng chọn trẻ để đặt lịch.");
      return;
    }

    if (!parentInfo?.customerCode) {
      alert("Không tìm thấy thông tin phụ huynh.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingData: Booking = {
        childId: selectedChild.childId,
        bookingDate: bookingDate,
        notes: "Ghi chú đặt lịch", // Có thể thay đổi thành trường nhập liệu
        bookingDetails: bookingDetails,
      };

      const status = await apiBooking(parentInfo.customerCode, bookingData);

      if (status === 201) {
        alert("Đặt lịch thành công!");
      } else {
        setError("Có lỗi xảy ra khi đặt lịch.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError("Có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return {
    searchInput,
    parentInfo,
    selectedChild,
    isFormSplit,
    loading,
    error,
    setSearchInput,
    handleSearch,
    handleSelectChild,
    handleAddNewChild,
    submitBooking,
  };
};

export default useVaccinationForm;