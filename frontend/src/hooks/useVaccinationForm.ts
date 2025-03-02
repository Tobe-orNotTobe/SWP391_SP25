mport { useState, useEffect } from "react";
import {
  Parent,
  Child,
  BookingDetail,
  Booking,
} from "../interfaces/VaccineRegistration.ts";
import { apiBooking } from "../apis/apiBooking"; // Sử dụng hàm apiBooking đã được tách riêng
import { apiPostVNPayTransaction } from "../apis/apiTransaction";
import { Navigate, useNavigate } from "react-router-dom";
import { IsLoginSuccessFully } from "../validations/IsLogginSuccessfully";
import { apiGetChildById, apiGetMyChilds } from "../apis/apiChild.ts";

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
  const Navigate = useNavigate();

  const { username, sub } = IsLoginSuccessFully();

  // Hàm xử lý tìm kiếm thông tin phụ huynh và trẻ
  // const handleSearch = async (searchInput: string) => {
  //   const userId = searchInput; // Giả sử userId là cố định

  //   if (!userId) {
  //     alert("Vui lòng nhập mã khách hàng.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const data = await getChildren(userId);
  //     if (data.isSuccess && data.result) {
  //       const children = data.result.map((child: Child) => ({
  //         childId: child.childId,
  //         fullName: child.fullName,
  //         dateOfBirth: child.dateOfBirth.split("T")[0],
  //         gender: child.gender === "Female" ? "Nữ" : "Nam",
  //       }));

  //       setParentInfo({
  //         customerCode: userId,
  //         parentName: userId, // Có thể thay bằng data.parentName nếu API trả về
  //         children: children,
  //       });
  //     } else {
  //       setError("Không tìm thấy thông tin phụ huynh.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi lấy dữ liệu:", error);
  //     setError("Có lỗi xảy ra khi tải dữ liệu.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchParentAndChildrenInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiGetMyChilds();
        // const data = await getChildren(sub);

        if (data.isSuccess && data.result) {
          const children = data.result.map((child: Child) => ({
            childId: child.childId,
            fullName: child.fullName,
            dateOfBirth: child.dateOfBirth?.split("T")[0] || "",
            gender: child.gender === "Female" ? "Nữ" : "Nam",
          }));

          setParentInfo({
            customerCode: sub,
            parentName: username || "Không rõ", // Kiểm tra nếu API trả về parentName
            children: children,
          });
        } else {
          setError("Không tìm thấy thông tin phụ huynh.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phụ huynh:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (sub) {
      fetchParentAndChildrenInfo();
    }
  }, [sub]); // Chạy khi `userId` thay đổi

  // Hàm xử lý chọn trẻ
  const handleSelectChild = (child: Child | null) => {
    setSelectedChild(child);
    setIsFormSplit(!!child); // Chia form nếu có trẻ được chọn
  };

  // Hàm xử lý thêm trẻ mới
  const handleAddNewChild = () => {
    Navigate("/child-register");
  };

  // Hàm gửi dữ liệu đặt lịch tiêm chủng
  const submitBooking = async (
    bookingDate: string,
    bookingDetails: BookingDetail[]
  ) => {
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
      setBooking(bookingData);

      const status = await apiBooking(parentInfo.customerCode, bookingData);

      const paymentResponse = await apiPostVNPayTransaction(
        status.result?.bookingId
      );

      console.log(paymentResponse);
      if (paymentResponse.isSuccess) {
        window.location.href = paymentResponse.result?.paymentUrl;
      } else {
        setError("Không lấy được đường dẫn thanh toán.");
      }

      // Navigate("/payment", { state: { bookingData } });
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
    handleSelectChild,
    handleAddNewChild,
    submitBooking,
  };
};

export default useVaccinationForm;
