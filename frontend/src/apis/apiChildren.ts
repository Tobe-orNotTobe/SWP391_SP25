// import axios from "axios";
// import { Child } from "../types/VaccineRegistration";

  
// export const  getChildren = async (userId: string) => {
//     try {
//       const response = await axios.get(
//         `https://localhost:7134/api/Children?userId=${userId}`
//       );
//       const data = response.data;

//       if (data.isSuccess) {
//         // const children: Child[] = data.result.map((child: any) => ({
//         //   id: child.childId,
//         //   name: child.fullName,
//         //   birthDate: child.dateOfBirth.split("T")[0],
//         //   gender: child.gender === "Female" ? "Nữ" : "Nam",
//         // }));
//         // setParentInfo({
//         //   customerCode: userId,
//         //   parentName: userId, // Cập nhật tên phụ huynh từ API nếu có
//         //   children,
//         // });
//         return response.data
//       } else {
//         alert("Không tìm thấy thông tin phụ huynh.");
//       }
//     } catch (error) {
//       console.error("Error fetching children data:", error);
//       alert("Có lỗi xảy ra khi tải dữ liệu.");
//     }
//   };
import axios from "axios";
// import { Child } from "../types/VaccineRegistration";

export const getChildren = async (userId: string) => {
    try {
        const response = await axios.get(
            `https://localhost:7134/api/Children/user/${userId}`
        );
        const data = response.data;
        console.log(data)

        if (data.isSuccess) {
          console.log(data)
            return {
                isSuccess: true,
                result: data.result // Trả về danh sách trẻ em thô từ API
            };
        } else {
            return {
                isSuccess: false,
                result: null
            };
        }
    } catch (error) {
        console.error("Error fetching children data:", error);
        return {
            isSuccess: false,
            result: null,
            error: "Có lỗi xảy ra khi tải dữ liệu."
        };
    }
};