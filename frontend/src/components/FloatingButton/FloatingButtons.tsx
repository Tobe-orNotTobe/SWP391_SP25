import React, { useState, useEffect } from "react";
import styles from "./FloatingButtons.module.css";
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
    <div className={styles.floatingButtons}>
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          className={styles.scrollToTop}
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
        className={styles.messenger}
        aria-label="Chat with us on Messenger"
      >
        <FaFacebookMessenger />
      </a>

      {/* Zalo Button */}
      <a
        href="https://zalo.me/yourpageid"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.zalo}
        aria-label="Chat with us on Zalo"
      >
        <FaPhoneAlt />
      </a>

    </div>
  );
};

export default FloatingButtons;
