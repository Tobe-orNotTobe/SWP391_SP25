import React, { useState } from "react";
import "./Feedback.scss";
import { CiStar } from "react-icons/ci";

const Feedback: React.FC = () => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [feedbackText, setFeedbackText] = useState<string>("");

    const handleMouseOver = (rating: number) => setHoveredRating(rating);
    const handleMouseLeave = () => setHoveredRating(null);
    const handleClick = (rating: number) => setSelectedRating(rating);
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setFeedbackText(event.target.value);

    return (
        <div className="FeedbackContainer">
            <form className="FeedbackForm">
                <h2 className="FeedbackTitle">Feedback</h2>

                <div className="FeedbackRating">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <span
                            key={value}
                            className={`star ${value <= (hoveredRating || selectedRating || 0) ? "selected" : ""}`}
                            onMouseOver={() => handleMouseOver(value)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(value)}
                        >
                            <CiStar/>
                        </span>
                    ))}
                </div>

                <label className="FeedbackLabel">Nội dung: </label>
                <textarea
                    className="FeedbackTextarea"
                    placeholder="Nhập nội dung phản hồi của bạn..."
                    value={feedbackText}
                    onChange={handleTextChange}
                    rows={5} // Số dòng hiển thị ban đầu
                ></textarea>

                <button className="FeedbackButton" type="submit">Gửi</button>
            </form>
        </div>
    );
};

export default Feedback;
