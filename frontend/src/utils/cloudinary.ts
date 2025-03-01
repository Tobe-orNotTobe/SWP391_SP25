import axios from "axios";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../config/cloudinaryConfig";


export const uploadImageToCloudinary = async (file: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  try {
    const response = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    if (response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error("Upload failed.");
    }
  } catch (error) {
    console.error(" Upload error:", error);
    throw new Error("Image upload failed.");
  }
};
