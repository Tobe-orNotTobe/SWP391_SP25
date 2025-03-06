// import React, { useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import { Button } from "antd";
// import { uploadImageToCloudinary } from "../../utils/cloudinary";

// const TinyMCEEditor: React.FC = () => {
//   const [content, setContent] = useState<string>(""); // Nội dung soạn thảo
//   // const [savedContent, setSavedContent] = useState<string>(""); // Nội dung đã lưu
//   // const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Danh sách ảnh tải lên

//   const handleEditorChange = (newContent: string) => {
//     setContent(newContent);
//   };

//   // Kiểm tra nội dung bài viết trước khi lưu
//   const validateContent = (): boolean => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(content, "text/html");

//     const hasH1 = doc.querySelector("h1") !== null;
//     const hasImage = doc.querySelectorAll("img").length > 0;
//     const textContent = doc.body.textContent;
//     const hasText = textContent !== null && textContent.trim().length >= 100;
//     const imageCount = doc.querySelectorAll("img").length;
//     const hasParagraph = doc.querySelector("p") !== null;

//     if (!hasH1) {
//       alert("Bài viết phải có ít nhất một tiêu đề chính (H1).");
//       return false;
//     }
//     if (!hasImage) {
//       alert("Bài viết phải có ít nhất một hình ảnh.");
//       return false;
//     }
//     if (!hasText) {
//       alert("Bài viết phải có ít nhất 100 ký tự nội dung.");
//       return false;
//     }
//     if (imageCount > 10) {
//       alert("Bài viết không được chứa quá 10 hình ảnh.");
//       return false;
//     }
//     if (!hasParagraph) {
//       alert("Bài viết phải có ít nhất một đoạn mô tả.");
//       return false;
//     }
//     return true;
//   };

//   // Hàm lưu bài viết xuống backend
//   const saveContent = async (): Promise<void> => {
//     if (!validateContent()) return;

//     try {
//       const response = await fetch("http://localhost:5000/save", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ content }),
//       });

//       const result = await response.json();
//       setSavedContent(content); // Cập nhật nội dung đã lưu
//       alert(result.message);
//     } catch (error) {
//       console.error("Error saving content:", error);
//       alert("Failed to save content.");
//     }
//   };

//   // Xử lý upload ảnh khi người dùng chọn ảnh từ TinyMCE
//   const imageUploadHandler = async (blobInfo: any): Promise<string> => {
//     try {
//       const imageUrl = await uploadImageToCloudinary(blobInfo.blob());
//       setUploadedImages((prevImages) => [...prevImages, imageUrl]);
//       return imageUrl; // Trả về URL ảnh để TinyMCE hiển thị
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       throw error;
//     }
//   };

//   return (
//     <div>
//       <h2>Text Editor</h2>
//       <Editor
//         apiKey="yhjx8d5ag43egl95r02jer0oxpjs86mwew5zas5vvwwc2x5b"
//         value={content}
//         onEditorChange={handleEditorChange}
//         init={{
//           height: 500,
//           menubar: true,
//           plugins: "image lists link table code",
//           toolbar:
//             "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | image",
//           images_upload_handler: imageUploadHandler, // Gọi hàm upload ảnh
//           automatic_uploads: true,
//           file_picker_types: "image",
//         }}
//       />

//       <Button onClick={saveContent} style={{ marginTop: "20px" }}>
//         Save Content
//       </Button>
//     </div>
//   );
// };

// export default TinyMCEEditor;
