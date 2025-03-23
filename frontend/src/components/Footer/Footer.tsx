import React from 'react';
import './Footer.scss';

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { FaTelegramPlane } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footerContainer" id="footer">
      <div className="footerContent">
        <div className="footerSection">
          <h3 className="footerSectionTitle">Về Side_Effect</h3>
          <ul className="footerList">
            <li className="footerListItem">CÔNG TY CỔ PHẦN Children Vaccination</li>
            <li className="footerListItem">Email: childvaccinesystem25@gmail.com</li>
            <li className="footerListItem">Chịu trách nhiệm nội dung: TEAM SWP391_SP25</li>
            <li className="footerListItem">Bản quyền ©2024 thuộc về TEAM SWP391_SP25</li>
          </ul>
        </div>

        <div className="footerSection contactSection">
          <h3 className="footerSectionTitle">Liên hệ với chúng tôi</h3>
          <ul className="footerList">
            <li className="footerListItem">
              <span>Số điện thoại: 091 222 4434</span>
            </li>
            <li className="footerListItem">
              <span> Lô E2a-7, Đường D1, Long Thạnh Mỹ, Thủ Đức, TP.HCM</span>
            </li>
          </ul>
        </div>

        {/* Phần Google Maps */}
        <div className="mapSection">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105370124!2d106.80730807480579!3d10.841127589311634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1728661899242!5m2!1sen!2s"
            width="300"
            height="200"
            style={{ border: "0" }}
            loading="lazy"
            title="Google Map"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Phần mạng xã hội */}
      <div className="socialMedia">
        <a href="#" className="socialIcon">
          <FaFacebookF size={24} />
        </a>
        <a href="#" className="socialIcon">
          <FaInstagram size={24} />
        </a>
        <a href="#" className="socialIcon">
          <SiZalo size={30} />
        </a>
        <a href="#" className="socialIcon">
          <FaTelegramPlane size={24} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
