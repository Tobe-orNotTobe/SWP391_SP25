import React, { useState, useEffect } from "react";
import "./FloatingButtons.scss";
import { FaArrowUp, FaCalendarAlt, FaFacebookMessenger, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const FloatingButtons: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    const smoothScrollToTop = () => {
        const startPosition = window.scrollY;
        const startTime = performance.now();
        const duration = 800; // Thời gian cuộn (ms)

        const easeOutCubic = (t: any) => 1 - Math.pow(1 - t, 3);

        const animateScroll = (currentTime: any) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easedProgress = easeOutCubic(progress);
            window.scrollTo(0, startPosition * (1 - easedProgress));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };


    return (
    <div className="floatingButtons">
      {showScrollButton && (
        <button className="scrollToTop" onClick={smoothScrollToTop} aria-label="Scroll to top">
          <FaArrowUp size={30} />
        </button>
      )}

      <div className="buttonWrapper">
        <Link to="/booking"
          target="_blank" rel="noopener noreferrer"
          className="booking" aria-label="Đăng Ký Tiêm Ngay">
          <FaCalendarAlt size={24} /> <span>Đăng Kí Tiêm Ngay</span>
        </Link>
      </div>

      <div className="buttonWrapper">
        <Link to="https://www.facebook.com/profile.php?id=100035700756928"
          target="_blank" rel="noopener noreferrer"
          className="messenger-icon" aria-label="Chat với chúng tôi">
          <FaFacebookMessenger size={30} />
        </Link>
      </div>

      <div className="buttonWrapper">
        <Link to="https://zalo.me/0816518989"
          target="_blank" rel="noopener noreferrer"
          className="phone-icon" aria-label="Hỗ Trợ Khách Hàng">
          <FaPhoneAlt size={30} />
        </Link>
      </div>
      {/* Nút đăng ký tiêm giữ nguyên */}
      
    </div>
    
  );
};

export default FloatingButtons;
