import { useState } from "react";
import { Vaccine, VaccinePackage } from "../types/VaccineRegistration";

const useVaccineSelection = () => {
  const [vaccineType, setVaccineType] = useState<"Gói" | "Lẻ">("Gói");
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleVaccineTypeChange = (type: "Gói" | "Lẻ") => {
    setVaccineType(type);
    setSelectedVaccines([]);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedVaccines((prev) =>
      prev.includes(id) ? prev.filter((vaccineId) => vaccineId !== id) : [...prev, id]
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const vaccinePackages: VaccinePackage[] = [
    {
      category: "Vắc xin cho trẻ em / 0-9 Tháng",
      vaccines: [
        { id: "1", name: "Gói Hexaxim – Rotarix – Varilrix", price: "13,434,900 đ" },
        { id: "2", name: "Gói Hexaxim – Rotateq – Varilrix", price: "18,287,136 đ" },
      ],
    },
    {
      category: "Vắc xin cho trẻ em / 0-12 Tháng",
      vaccines: [
        { id: "3", name: "Gói Infanrix Hexa – Rotateq – Varilrix", price: "18,175,464 đ" },
      ],
    },
    {
      category: "Vắc xin cho người trưởng thành / Gói 2 - 10 mũi",
      vaccines: [
        { id: "4", name: "Gói vắc xin tổng hợp", price: "20,000,000 đ" },
      ],
    },
  ];

  const singleVaccines: Vaccine[] = [
    { id: "60ebaa66", name: "VẮC XIN CÚM TỨ GIÁ VAXIGRIP TETRA", price: "356,000 đ" },
    { id: "602f3f38", name: "VẮC XIN CÚM TỨ GIÁ INFLUVAC TETRA", price: "356,000 đ" },
  ];

  return {
    vaccineType,
    selectedVaccines,
    expandedCategory,
    vaccinePackages,
    singleVaccines,
    handleVaccineTypeChange,
    handleCheckboxChange,
    toggleCategory,
  };
};

export default useVaccineSelection;