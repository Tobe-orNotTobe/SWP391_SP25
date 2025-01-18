import React, { useState, useEffect } from "react";
import "./FloatingButtons.scss"
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
        <button
          className="scrollToTop"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
      {/* Messenger Button */}
      <a
        href="https://www.messenger.com/t/yourpageid"
        target="_blank"
        rel="noopener noreferrer"
        className="messenger"
        aria-label="Chat with us on Messenger"
      >
        <FaFacebookMessenger />
      </a>

      {/* Zalo Button */}
      <a
        href="https://zalo.me/yourpageid"
        target="_blank"
        rel="noopener noreferrer"
        className="zalo"
        aria-label="Chat with us on Zalo"
      >
        <FaPhoneAlt />
      </a>

    </div>
  );
};

export default FloatingButtons;
