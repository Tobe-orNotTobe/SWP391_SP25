import { useState } from "react";
import axios from "axios";
import {
  FormData,
  Parent,
  Child,
  BookingDetailItem,
} from "../types/VaccineRegistration"; // Đảm bảo import đúng types

const useVaccinationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    birthDate: "",
    gender: "",
    customerCode: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    contactName: "",
    relationship: "",
    contactPhone: "",
    vaccineType: "",
    vnvcCenter: "",
    vaccinationDate: "",
  });

  const [isFormSplit, setIsFormSplit] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [parentInfo, setParentInfo] = useState<Parent | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showNewChildForm, setShowNewChildForm] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [error, setError] = useState<string | null>(null); // Thêm state error

  // Hàm fetchChildren để lấy dữ liệu từ API
  const fetchChildren = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5260/api/Children/user/${userId}`
      );
      const data = response.data;

      if (data.isSuccess) {
        const children: Child[] = data.result.map((child: any) => ({
          id: child.childId,
          name: child.fullName,
          birthDate: child.dateOfBirth.split("T")[0],
          gender: child.gender === "Female" ? "Nữ" : "Nam",
        }));
        setParentInfo({
          customerCode: userId,
          parentName: userId, // Cập nhật tên phụ huynh từ API nếu có
          children,
        });
      } else {
        alert("Không tìm thấy thông tin phụ huynh.");
      }
    } catch (error) {
      console.error("Error fetching children data:", error);
      alert("Có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    const userId = searchInput;
    if (userId) {
      fetchChildren(userId);
    } else {
      alert("Vui lòng nhập mã khách hàng.");
    }
  };

  // Hàm xử lý chọn trẻ
  const handleSelectChild = (child: Child | null) => {
    if (child === null) {
      setSelectedChild(null);
      setIsFormSplit(false);
      setFormData({
        ...formData,
        fullName: "",
        birthDate: "",
        gender: "",
      });
    } else {
      setSelectedChild(child);
      console.log(selectedChild);
      setFormData({
        ...formData,
        fullName: child.name,
        birthDate: child.birthDate,
        gender: child.gender,
      });
      setIsFormSplit(true);
      setShowNewChildForm(false);
    }
  };

  // Hàm xử lý thêm trẻ mới
  const handleAddNewChild = () => {
    setShowNewChildForm(true);
    setSelectedChild(null);
  };

  // Hàm xử lý thay đổi giá trị trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý thay đổi giới tính
  const handleGenderChange = (selectedGender: string) => {
    setFormData({ ...formData, gender: selectedGender });
  };

  // Hàm gửi dữ liệu đặt lịch tiêm chủng
  const submitBooking = async (bookingDate: string, bookingDetails: BookingDetailItem) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:5260/api/Booking?userId=${parentInfo?.customerCode}`,
        {
          childId: selectedChild?.id,
          bookingDate: bookingDate, // Ngày đặt lịch hiện tại
          notes: "Ghi chú đặt lịch", // Ghi chú tùy chọn
          bookingDetails: bookingDetails,
        }
      );

      if (response.status === 201) {
        const data = response.data;
        if (data.isSuccess) {
          alert("Đặt lịch thành công!");
        } else {
          setError(data.error.errorMessages.join(", ")); // Hiển thị thông báo lỗi từ API
        }
      } else {
        setError("Có lỗi xảy ra khi đặt lịch.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError("Có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      console.log({
        childId: selectedChild?.id,
        bookingDate: new Date().toISOString(), // Ngày đặt lịch hiện tại
        notes: "Ghi chú đặt lịch", // Ghi chú tùy chọn
        bookingDetails: bookingDetails,
      });
      setLoading(false);
    }
  };

  return {
    formData,
    searchInput,
    parentInfo,
    selectedChild,
    showNewChildForm,
    isFormSplit,
    loading,
    error,
    setSearchInput,
    handleChange,
    handleGenderChange,
    handleSearch,
    handleSelectChild,
    handleAddNewChild,
    submitBooking, // Thêm hàm submitBooking vào return
  };
};

export default useVaccinationForm;
