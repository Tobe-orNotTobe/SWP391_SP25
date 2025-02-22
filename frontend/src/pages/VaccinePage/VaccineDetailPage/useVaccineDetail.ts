import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGetVaccineDetailById } from "../../../apis/apiVaccine";
import { VaccineDetail } from "../../../interfaces/Vaccine";



export const useVaccineDetailById = () => {
    const { id } = useParams<{ id: string }>();
    const [vaccine, setVaccine] = useState<VaccineDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchVaccineDetail = async () => {
        
          const response = await apiGetVaccineDetailById(Number(id));
          if (response.isSuccess) {
            setVaccine(response.result);
          } else {
            setError("Không tìm thấy thông tin vaccine.");
          }
       
          setLoading(false);
        }
      
  
      if (id) {
        fetchVaccineDetail();
      }
    }, [id]);
  
    return { vaccine, loading, error };
  };