import React from "react";
import "./UserProfile.scss";
import { useUserProfileDetail } from "./useUserProfile.ts";

const UserProfile: React.FC = () => {
    const { userProfile } = useUserProfileDetail();

    if (!userProfile) {
        return <div className="user-profile">Loading...</div>;
    }

    return (
        <div className="user-profile">
            <div className="profile-container">
                <div className="profile-left">
                    <img src={userProfile.imageUrl} alt="Profile" className="profile-image" />
                </div>
                <div className="profile-right">
                    <h2 className="profile-name">{userProfile.fullName}</h2>
                    <div className="profile-details">
                        <div className="profile-item"><strong>Username:</strong> <span>{userProfile.userName}</span></div>
                        <div className="profile-item"><strong>Fullname:</strong> <span>{userProfile.fullName}</span></div>
                        <div className="profile-item"><strong>Email:</strong> <span>{userProfile.email}</span></div>
                        <div className="profile-item"><strong>Phone:</strong> <span>{userProfile.phoneNumber}</span></div>
                        <div className="profile-item"><strong>Address:</strong> <span>{userProfile.address}</span></div>
                        <div className="profile-item"><strong>Date of Birth:</strong> <span>{new Date(userProfile.dateOfBirth).toLocaleDateString()}</span></div>
                    </div>
                    <div className="profile-actions">
                        <button className="edit-button">Chỉnh sửa thông tin</button>
                        <button className="change-password-button">Thay đổi mật khẩu</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
