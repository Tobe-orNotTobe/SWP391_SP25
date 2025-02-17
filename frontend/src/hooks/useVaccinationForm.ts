import { useState } from "react";
import { FormData, Parent, Child } from "../types/VaccineRegistration";

const useVaccinationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    birthDate: "",
    gender: "Nam",
    customerCode: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    contactName: "",
    relationship: "",
    contactPhone: "",
    vaccineType: "",
    vnvcCenter: "",
    vaccinationDate: "",
  });

  const [isFormSplit, setIsFormSplit] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [parentInfo, setParentInfo] = useState<Parent | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showNewChildForm, setShowNewChildForm] = useState(false);

  // Dữ liệu mẫu phụ huynh
  const mockParents: Parent[] = [
    {
      customerCode: "KH1",
      parentName: "Nguyễn Văn Bố",
      children: [
        { id: 1, name: "Nguyễn Văn A", birthDate: "2020-01-01", gender: "Nam" },
        { id: 2, name: "Nguyễn Thị B", birthDate: "2019-05-15", gender: "Nữ" },
      ],
    },
    {
      customerCode: "KH2",
      parentName: "Trần Thị Mẹ",
      children: [
        { id: 3, name: "Trần Văn C", birthDate: "2018-03-10", gender: "Nam" },
      ],
    },
  ];

  // const handleSelectChild = (child) => {
  //   setSelectedChild(child);
  //   setIsFormSplit(true); // Kích hoạt chia form
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenderChange = (selectedGender: string) => {
    setFormData({ ...formData, gender: selectedGender });
  };

  const handleSearch = () => {
    const foundParent = mockParents.find(
      (parent) => parent.customerCode === searchInput
    );

    if (foundParent) {
      setParentInfo(foundParent);
      setSelectedChild(null);
    } else {
      setParentInfo(null);
      alert("Không tìm thấy thông tin phụ huynh.");
    }
  };

const handleSelectChild = (child: Child | null) => {
  if (child === null) {
    // Nếu bỏ chọn, đặt lại selectedChild và tắt chế độ chia form
    setSelectedChild(null);
    setIsFormSplit(false);
    setFormData({
      ...formData,
      fullName: "",
      birthDate: "",
      gender: "",
    });
  } else {
    // Nếu chọn một trẻ, cập nhật selectedChild và bật chế độ chia form
    setSelectedChild(child);
    setFormData({
      ...formData,
      fullName: child.name,
      birthDate: child.birthDate,
      gender: child.gender,
    });
    setIsFormSplit(true);
    setShowNewChildForm(false);
  }
};

  const handleAddNewChild = () => {
    setShowNewChildForm(true);
    setSelectedChild(null);
  };

  return {
    formData,
    searchInput,
    parentInfo,
    selectedChild,
    showNewChildForm,
    isFormSplit,
    setSearchInput,
    handleChange,
    handleGenderChange,
    handleSearch,
    handleSelectChild,
    handleAddNewChild,
  };
};

export default useVaccinationForm;