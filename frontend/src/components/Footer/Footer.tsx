import React from 'react';
import styles from './Footer.module.css';

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { FaTelegramPlane } from "react-icons/fa";

const Footer : React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3 className={styles.footerSectionTitle}>Về Side_Effect</h3>
                    <ul className={styles.footerList}>
                        <li className={styles.footerListItem}>CÔNG TY CỔ PHẦN Children Vaccination</li>
                        <li className={styles.footerListItem}>Email: ChildVaccaSWP391_SP25@gmail.com</li>  
                        <li className={styles.footerListItem}>Chịu trách nhiệm nội dung: TEAM SWP391_SP25</li>
                        <li className={styles.footerListItem}>Bản quyền ©2024 thuộc về TEAM SWP391_SP25</li>                           
                    </ul>
                </div>
                <div className={`${styles.footerSection} ${styles.contactSection}`}>
                    <h3 className={styles.footerSectionTitle}>Liên hệ với chúng tôi</h3>
                    <ul className={styles.footerList}>
                        <li className={styles.footerListItem}>
                            <span>Hotline: Koikungcenter@gmail.com</span>
                        </li>
                        <li className={styles.footerListItem}>                           
                            <span>Số điện thoại: 091 222 4434</span>
                        </li>
                        <li className={styles.footerListItem}>                            
                            <span> Lô E2a-7, Đường D1, Long Thạnh Mỹ, Thủ Đức, TP.HCM</span>
                        </li>
                    </ul>
                </div>

                {/* Phần Google Maps */}
                <div className={styles.mapSection}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105370124!2d106.80730807480579!3d10.841127589311634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1728661899242!5m2!1sen!2s"
                        width="300"
                        height="200"
                        style={{border: "0"}}
                        loading="lazy"
                        title="Google Map"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            {/* Phần mạng xã hội */}
            <div className={styles.socialMedia}>
                <a href="#" className={styles.socialIcon}><FaFacebookF size={24}/></a>
                <a href="#" className={styles.socialIcon}><FaInstagram size={24}/></a>
                <a href="#" className={styles.socialIcon}><SiZalo size={30}/></a>
                <a href="#" className={styles.socialIcon}><FaTelegramPlane size={24}/></a>
            </div>
        </footer>
  );
};

export default Footer;
