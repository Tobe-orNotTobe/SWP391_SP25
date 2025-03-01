import React, { useEffect, useState } from "react";
import "./Transaction.scss";
import vnpayLogo from "../../assets/Payment/vnpay-logo.png";
import momoLogo from "../../assets/Payment/momo_logo.png";
import { useLocation } from "react-router-dom";
import {
  apiGetVaccineDetailById,
  apiGetComBoVaccineById,
} from "../../apis/apiVaccine";
import { Booking, Vaccine, VaccinePackage } from "../../interfaces/VaccineRegistration.ts";

const Payment: React.FC = () => {
  const location = useLocation();
  const { bookingData } = location.state || {};

  const [totalPrice, setTotalPrice] = useState(0);
  const [vaccineDetails, setVaccineDetails] = useState([]);
  const [comboDetails, setComboDetails] = useState([]);


  // Hàm tính tổng tiền
  const calculateTotalPrice = async (bookingDetails: Booking) => {
    let total = 0;

    for (const detail of bookingDetails) {
      if (detail.vaccineId !== 0) {
        const vaccine = await apiGetVaccineDetailById(detail.vaccineId);
        if (vaccine && vaccine.result) {
          total += vaccine.result.price;
        }
      } else if (detail.comboVaccineId !== 0) {
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
      if (detail.vaccineId !== 0) {
        const vaccine = await apiGetVaccineDetailById(detail.vaccineId);
        if (vaccine && vaccine.result) {
          vaccineDetails.push(vaccine.result);
        }
      } else if (detail.comboVaccineId !== 0) {
        const comboVaccine = await apiGetComBoVaccineById(
          detail.comboVaccineId
        );
        if (comboVaccine && comboVaccine.result) {
          comboDetails.push(comboVaccine.result);
        }
      }
    }

    return { vaccineDetails, comboDetails };
  };

  // Sử dụng useEffect để tính toán và lấy thông tin khi bookingData thay đổi
  useEffect(() => {
    if (bookingData && bookingData.bookingDetails) {
      const fetchData = async () => {
        const total = await calculateTotalPrice(bookingData.bookingDetails);
        setTotalPrice(total);

        const { vaccineDetails, comboDetails } =
          await getVaccineAndComboDetails(bookingData.bookingDetails);
        setVaccineDetails(vaccineDetails);
        setComboDetails(comboDetails);
      };

      fetchData();
    }
  }, [bookingData]);

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-wrapper">
          {/* Phần bên trái */}
          <div className="payment-left">
            <div className="payment-header">
              <div className="payment-header-title">Chi tiết hóa đơn </div>
            </div>

            <div className="payment-content">
              <div className="payment-body">
                {/* Hiển thị danh sách vaccine */}
                <h3>Vaccines</h3>
                {vaccineDetails.map((vaccine: Vaccine) => (
                  <div key={vaccine.vaccineId} className="payment-summary-item">
                    <div className="payment-summary-name">{vaccine.name}</div>
                    <div className="payment-summary-price">
                      {vaccine.price?.toLocaleString()} vnđ
                    </div>
                  </div>
                ))}
                {comboDetails.map((combo: VaccinePackage) => (
                  <div key={combo.comboId} className="combo-item">
                    <h4>{combo.comboName}</h4>
                    <p>Total Price: {combo.totalPrice} VNĐ</p>
                    <div className="combo-vaccines">
                      <h5>Vaccines in Combo:</h5>
                      {combo.vaccines.map((vaccine) => (
                        <div
                          key={vaccine.vaccineId}
                          className="combo-vaccine-item"
                        >
                          <p>{vaccine.name}</p>
                          <p className="price">
                            Giá: {vaccine.price?.toLocaleString()} vnđ
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Hiển thị danh sách combo vaccine */}
                {/* <div className="combo-list">
                  <h3>Combo Vaccines</h3>
                  {comboDetails.map((combo) => (
                    <div key={combo.comboId} className="combo-item">
                      <h4>{combo.comboName}</h4>
                      <p>Total Price: {combo.totalPrice} VNĐ</p>
                      <div className="combo-vaccines">
                        <h5>Vaccines in Combo:</h5>
                        {combo.vaccines.map((vaccine) => (
                          <div key={vaccine.vaccineId} className="combo-vaccine-item">
                            <p>{vaccine.name}</p>
                            <p>Price: {vaccine.price} VNĐ</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div> */}

                {/* Phần tổng kết thanh toán */}
                <div className="payment-summary-item payment-summary-total">
                  <div className="payment-summary-name">Tổng</div>
                  <div className="payment-summary-price">{totalPrice.toLocaleString()} VNĐ</div>
                </div>
              </div>
            </div>
          </div>
          {/* Phần bên phải */}
          <div className="payment-right">
            <form action="" className="payment-form">
              <h1 className="payment-title">Chi tiết thanh toán</h1>

              {/* Phần phương thức thanh toán */}
              <div className="payment-method">
                <input
                  type="radio"
                  name="payment-method"
                  id="method-1"
                  checked
                />
                <label htmlFor="method-1" className="payment-method-item">
                  <img src={vnpayLogo} alt="VnPay" />
                </label>
                <input type="radio" name="payment-method" id="method-2" />
                <label htmlFor="method-2" className="payment-method-item">
                  <img src={momoLogo} alt="MOMO" />
                </label>
              </div>

              {/* Phần nhập thông tin thanh toán */}
              {/* <div className="payment-form-group">
                <input
                  type="email"
                  placeholder=" "
                  className="payment-form-control"
                  id="email"
                />
                <label
                  htmlFor="email"
                  className="payment-form-label payment-form-label-required"
                >
                  Email:
                </label>
              </div>
              <div className="payment-form-group">
                <input
                  type="text"
                  placeholder=" "
                  className="payment-form-control"
                  id="card-number"
                />
                <label
                  htmlFor="card-number"
                  className="payment-form-label payment-form-label-required"
                >
                  Card Number
                </label>
              </div>
              <div className="payment-form-group-flex">
                <div className="payment-form-group">
                  <input
                    type="date"
                    placeholder=" "
                    className="payment-form-control"
                    id="expiry-date"
                  />
                  <label
                    htmlFor="expiry-date"
                    className="payment-form-label payment-form-label-required"
                  >
                    Expiry Date
                  </label>
                </div>
                <div className="payment-form-group">
                  <input
                    type="text"
                    placeholder=" "
                    className="payment-form-control"
                    id="cvv"
                  />
                  <label
                    htmlFor="cvv"
                    className="payment-form-label payment-form-label-required"
                  >
                    CVV
                  </label>
                </div>
              </div> */}

              {/* Nút thanh toán */}
              <button type="submit" className="payment-form-submit-button">
                <i className="ri-wallet-line"></i> Thanh Toán
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
