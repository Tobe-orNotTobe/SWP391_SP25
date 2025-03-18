import React, { useEffect, useState } from "react";
import "./Transaction.scss";
import vnpayLogo from "../../assets/Payment/vnpay-logo.png";
import ewaletLogo from "../../assets/Payment/ewalet_logo.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  apiGetVaccineDetailById,
  apiGetComBoVaccineById,
  // Thêm API để lấy thông tin booking theo ID
} from "../../apis/apiVaccine";
import {
  Booking,
  BookingResult,
  Vaccine,
  VaccinePackage,
} from "../../interfaces/VaccineRegistration.ts";
import {
  apiPostVNPayTransaction,
  apiPostWaletTransaction,
} from "../../apis/apiTransaction.ts";
import { toast } from "react-toastify";

import { apiGetBookingById } from "../../apis/apiBooking.ts";
import { AxiosError } from "axios";

const Payment: React.FC = () => {
  const location = useLocation();
  const { bookingResult } = location.state || {};

  const [totalPrice, setTotalPrice] = useState(0);
  const [vaccineDetails, setVaccineDetails] = useState([]);
  const [comboDetails, setComboDetails] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("VNPay");
  const [currentBookingResult, setCurrentBookingResult] =
    useState<BookingResult | null>(null);

  const navigate = useNavigate();

  const { bookingId } = useParams();

  const isPedingFromHistoryPage = Boolean(bookingId);

  const handlePayment = async (
    bookingResult: BookingResult,
    method: string
  ) => {
    try {
      let paymentResponse;
      const bookingID =
        isPedingFromHistoryPage && bookingId
          ? Number(bookingId)
          : bookingResult.bookingId;

      if (method === "VNPay") {
        paymentResponse = await apiPostVNPayTransaction(bookingID);
      } else if (method === "Wallet") {
        paymentResponse = await apiPostWaletTransaction(bookingID);
      } else {
        throw new Error("Phương thức thanh toán không hợp lệ");
      }

      console.log(paymentResponse);

      if (method === "VNPay") {
        window.location.href = paymentResponse.result?.paymentUrl || "";
      } else {
        toast.success("Thanh toán thành công qua ví!");
        navigate("/booking-history");
        console.log("Gọi API xác nhận thanh toán thành công");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.errorMessages}`);
      } else {
        toast.error("Đã Có Lỗi Xảy Ra");
      }
    }
  };

  // Hàm tính tổng tiền
  const calculateTotalPrice = async (bookingDetails: Booking) => {
    let total = 0;

    for (const detail of bookingDetails) {
      if (detail.vaccineId !== null) {
        const vaccine = await apiGetVaccineDetailById(detail.vaccineId);
        if (vaccine && vaccine.result) {
          total += vaccine.result.price;
        }
      } else if (detail.comboVaccineId !== null) {
        const comboVaccine = await apiGetComBoVaccineById(
          detail.comboVaccineId
        );
        if (comboVaccine && comboVaccine.result) {
          total += comboVaccine.result.totalPrice;
        }
      }
    }

    return total;
  };

  // Hàm lấy thông tin vaccine và combo vaccine
  const getVaccineAndComboDetails = async (bookingDetails: Booking) => {
    const vaccineDetails = [];
    const comboDetails = [];

    for (const detail of bookingDetails) {
      if (detail.vaccineId !== null && detail.vaccineId !== undefined) {
        const vaccine = await apiGetVaccineDetailById(detail.vaccineId);
        if (vaccine && vaccine.result) {
          vaccineDetails.push(vaccine.result);
          console.log(detail);
        }
      } else if (
        detail.comboVaccineId !== null &&
        detail.comboVaccineId !== undefined
      ) {
        const comboVaccine = await apiGetComBoVaccineById(
          detail.comboVaccineId
        );
        console.log(comboVaccine);
        if (comboVaccine && comboVaccine.result) {
          comboDetails.push(comboVaccine.result);
        }
      }
    }

    return { vaccineDetails, comboDetails };
  };

  // Hàm lấy thông tin booking từ ID
  const fetchBookingById = async (id: number) => {
    try {
      const response = await apiGetBookingById(id);
      if (response && response.isSuccess && response.result) {
        setCurrentBookingResult(response.result);
        return response.result;
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin booking:", error);
      toast.error("Không thể lấy thông tin đơn hàng");
    }
    return null;
  };

  // Sử dụng useEffect để xử lý cả trường hợp có bookingId từ URL và bookingResult từ state
  useEffect(() => {
    const fetchData = async () => {
      let bookingData = null;

      // Nếu có bookingId từ URL, ưu tiên lấy dữ liệu từ API
      if (bookingId) {
        bookingData = await fetchBookingById(Number(bookingId));
      }
      // Nếu không có bookingId từ URL hoặc không lấy được dữ liệu, sử dụng bookingResult từ state
      else if (bookingResult) {
        bookingData = bookingResult;
        setCurrentBookingResult(bookingResult);
      }

      // Nếu có dữ liệu booking, tiến hành tính giá và lấy thông tin chi tiết
      if (bookingData && bookingData.bookingDetails) {
        const total = await calculateTotalPrice(bookingData.bookingDetails);
        setTotalPrice(total);

        const { vaccineDetails, comboDetails } =
          await getVaccineAndComboDetails(bookingData.bookingDetails);
        setVaccineDetails(vaccineDetails);
        setComboDetails(comboDetails);
      }
    };

    fetchData();
  }, [bookingId, bookingResult]);

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setSelectedMethod(method);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Sử dụng currentBookingResult thay vì bookingResult để đảm bảo dữ liệu đã được cập nhật
    handlePayment(currentBookingResult || bookingResult, selectedMethod);
  };

  return (
    <div className="transaction-wraper">
      <section className="payment-section">
        <div className="container">
          <div className="center-align">
            <h1>Thanh toán</h1>
          </div>
          <div className="payment-wrapper">
            {/* Phần bên trái */}
            <div className="payment-left">
              <div className="payment-header">
                <div className="payment-header-title">Chi tiết hóa đơn </div>
              </div>

              <div className="payment-content">
                <div className="payment-body">
                  {/* Hiển thị danh sách vaccine */}
                  <h3>Vacxin/ Combo vacxin:</h3>
                  {vaccineDetails.map((vaccine: Vaccine) => (
                    <div
                      key={vaccine.vaccineId}
                      className="payment-summary-item"
                    >
                      <div className="payment-summary-name">{vaccine.name}</div>
                      <div className="payment-summary-price">
                        {vaccine.price?.toLocaleString()} vnđ
                      </div>
                    </div>
                  ))}
                  {comboDetails.map((combo: VaccinePackage) => (
                    <div key={combo.comboId} className="combo-item">
                      <h4>{combo.comboName}</h4>
                      {/* <p>Total Price: {combo.totalPrice} VNĐ</p> */}
                      <div className="combo-vaccines">
                        <h5>Vacxin trong combo:</h5>
                        {combo.vaccines.map((vaccine) => (
                          <div
                            key={vaccine.vaccine.id}
                            className="payment-summary-item"
                          >
                            <p>{vaccine.vaccine.name}</p>
                            {vaccine.vaccine.price && (
                              <p className="price">
                                {vaccine.price.toLocaleString()} vnđ
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Phần tổng kết thanh toán */}
                  <div className="payment-summary-item payment-summary-total">
                    <div className="payment-summary-name">Tổng</div>
                    <div className="payment-summary-price">
                      {totalPrice.toLocaleString()} VNĐ
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Phần bên phải */}
            <div className="payment-right">
              <form onSubmit={handleSubmit} className="payment-form">
                <h1 className="payment-title">Chọn hình thức thanh toán</h1>

                {/* Phần phương thức thanh toán */}
                <div className="payment-method">
                  <input
                    type="radio"
                    name="payment-method"
                    id="method-1"
                    checked={selectedMethod === "VNPay"}
                    onChange={() => handlePaymentMethodChange("VNPay")}
                  />
                  <label htmlFor="method-1" className="payment-method-item">
                    <img src={vnpayLogo} alt="VnPay" />
                    <span>VnPay</span>
                  </label>
                  <input
                    type="radio"
                    name="payment-method"
                    id="method-2"
                    checked={selectedMethod === "Wallet"}
                    onChange={() => handlePaymentMethodChange("Wallet")}
                  />
                  <label htmlFor="method-2" className="payment-method-item">
                    <img src={ewaletLogo} alt="EWalet" />
                    <span>Ví điện tử</span>
                  </label>
                </div>

                {/* Nút thanh toán */}
                <button type="submit" className="payment-form-submit-button">
                  <i className="ri-wallet-line"></i> Thanh Toán
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;
