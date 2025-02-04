import React, { useState, useEffect } from "react";
import "./FloatingButtons.scss";
import { FaArrowUp, FaFacebookMessenger, FaPhoneAlt } from "react-icons/fa";

const FloatingButtons: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200); // Hiện nút khi cuộn quá 200px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="floatingButtons">
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <div className="buttonWrapper">
          <div className="buttonText">Lên đầu trang</div>
          <button className="scrollToTop" onClick={scrollToTop} aria-label="Scroll to top">
            <FaArrowUp />
          </button>
        </div>
      )}

      {/* Messenger Button */}
      <div className="buttonWrapper">
        <div className="buttonText">Messenger - Chat với chúng tôi</div>
        <a href="https://www.facebook.com/profile.php?id=100035700756928"
          target="_blank" rel="noopener noreferrer"
          className="messenger" aria-label="Chat with us on Messenger">
          <FaFacebookMessenger size={30}/>
        </a>
      </div>

      {/* Zalo Button */}
      <div className="buttonWrapper">
        <div className="buttonText">Zalo - Hỗ trợ khách hàng</div>
        <a href="https://zalo.me/0816518989"
          target="_blank" rel="noopener noreferrer"
          className="zalo" aria-label="Chat with us on Zalo">
          <FaPhoneAlt size={30}/>
        </a>
      </div>
    </div>
  );
};

export default FloatingButtons;
