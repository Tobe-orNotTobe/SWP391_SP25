import { useState, useEffect , useRef} from "react"

import {
    GetVaccineComboDetail, TopUseVaccine,
    VaccinationSchedule,
    VaccineDetail,
    VaccineIntro,
    VaccineInventoryStock
} from "../interfaces/Vaccine";
import {
    apiGetComboVaccineDetail,
    apiGetVaccineDetail,
    apiGetVaccineIntro,
    apiGetComBoVaccineById,
    apiGetVaccinationSchedule,
    apiGetVaccineDetailById,
    apiGetVaccinationScheduleById,
    apiGetVaccineInventoryStock, apiGetStockByVaccineInventoryId
} from "../apis/apiVaccine";
import {apiTopUseVaccine} from "../apis/apiAdmin.ts";

export const useVaccineIntro = () =>{
    const[vaccineIntro, setVaccineIntro] = useState<VaccineIntro[]>([]);
    const[loading, setLoading] = useState<boolean>(false);
    const[error, setError] = useState<string>("");

    useEffect(() =>{
        const fetchVaccineIntro = async () =>{
            setLoading(true);
            try{
                const data = await apiGetVaccineIntro();
                setVaccineIntro(data);
            }catch (err){
                setError("Error Fetching Vaccine Intro Data");
                console.error(err)
            }finally{
                setLoading(false);
            }
        };

        fetchVaccineIntro();
    }, []);

    return {vaccineIntro, loading, error};   
}

export const useVaccineDetail = () => {
    const [vaccineDetail, setVaccineDetail] = useState<VaccineDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const hasFetched = useRef(false); // Biến kiểm tra đã gọi API hay chưa

    useEffect(() => {
        if (hasFetched.current) return; // Nếu đã gọi API trước đó thì không gọi lại

        const fetchVaccineDetail = async () => {
            setLoading(true);
            try {
                const data = await apiGetVaccineDetail();
                if (data && data.result) {
                    setVaccineDetail(data.result);
                }
            } catch (err) {
                console.error(err);
                setError("Error Fetching Vaccine Detail Data");
            } finally {
                setLoading(false);
            }
        };

        fetchVaccineDetail();
        hasFetched.current = true; // Đánh dấu là đã gọi API
    }, []);

    return { vaccineDetail, loading, error };
};

export const useComboVaccineDetail = () => {
    const [comboVaccineDetail, setComboVaccineDetail] = useState<GetVaccineComboDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComboVaccineDetail = async () => {
            try {
                const data = await apiGetComboVaccineDetail();
                if (data?.result) {
                    setComboVaccineDetail(data.result);
                } else {
                    setError("Dữ liệu không hợp lệ");
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách combo vaccine:", err);
                setError("Lỗi tải dữ liệu Combo Vaccine");
            } finally {
                setLoading(false);
            }
        };

        fetchComboVaccineDetail();
    }, []); 

    return { comboVaccineDetail, loading, error };
}

export const useComboVaccineDetailById = (id: number | null) => {
    const [comboVaccineDetail, setComboVaccineDetail] = useState<GetVaccineComboDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        const fetchComboVaccineDetail = async () => {
            setLoading(true);
            try {
                const data = await apiGetComBoVaccineById(id);
                if (data && data.result) {
                    setComboVaccineDetail(data.result);
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải thông tin combo vaccine");
            } finally {
                setLoading(false);
            }
        };

        fetchComboVaccineDetail();
    }, [id]);

    return { comboVaccineDetail, loading, error };
};

export const useVaccinationScheduleDetail = () => {
    const [vaccinationSchedule, setVaccinationSchedule] = useState<VaccinationSchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchVaccinationScheduleDetail  = async () =>{
            setLoading(true); 
            setError(null);
            try{
                const data = await apiGetVaccinationSchedule();
                if (data.isSuccess && data.result) {
                    setVaccinationSchedule(data.result);
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải thông tin combo vaccine");
            } finally {
                setLoading(false);
            }
        }; 

        fetchVaccinationScheduleDetail();
    },[])


    return{vaccinationSchedule, loading, error}
}

export const useVaccineDetailById = (id: number | null) => {
    const [vaccineDetail, setVaccineDetail] = useState<VaccineDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!id) return;

        const fetchVaccineDetail = async () => {
            setLoading(true);
            try {
                const data = await apiGetVaccineDetailById(id);
                if(data.isSuccess && data.result) {
                    setVaccineDetail(data.result);
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải thông tin vaccine");
            } finally {
                setLoading(false);
            }
        };

        fetchVaccineDetail();
    }, [id]);

    return { vaccineDetail, loading, error };
};

export const useVaccinationScheduleDetailById = (id: number | null) => {
    const [vaccinationScheduleDetail, setVaccinationScheduleDetail] =  useState<VaccinationSchedule | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchVaccinationScheduleDetail = async () => {
            setLoading(true); 
            setError(null);
            try{
                const data = await apiGetVaccinationScheduleById(id);
                if(data.isSuccess && data.result){
                    setVaccinationScheduleDetail(data.result);
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải thông tin lịch tiêm chủng vaccine");
            } finally {
                setLoading(false);
            }
        };

        fetchVaccinationScheduleDetail();
    }, [id])

    return {vaccinationScheduleDetail, loading, error}
}


export const useVaccineInventoryStockDetail = () => {
    const [vaccineInventoryStockDetail, setVaccineInventoryStockDetail] = useState<VaccineInventoryStock[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVaccineInventoryScheduleDetail = async () => {
            setLoading(true);
            setError(null);

           try{
               const response = await apiGetVaccineInventoryStock();
               if(response.isSuccess && response.result){
                   setVaccineInventoryStockDetail(response.result);
               }
           }catch (err){
               console.error(err);
               setError("Lỗi Khi Tải danh sách vaccine trong kho");
           } finally {
               setLoading(false);
           }
        };
        fetchVaccineInventoryScheduleDetail();
    }, [])
    return {vaccineInventoryStockDetail, loading, error}
}

export const useVaccineInventoryDetailByVaccineInventoryId = (vaccineId: number ) => {

    const [vaccineInventoryDetailById, setVaccineInventoryDetailById] = useState<VaccineInventoryStock | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVaccineInventoryDetail = async () => {
            setLoading(true);
            setError(null);
            try{
                const data= await apiGetStockByVaccineInventoryId(vaccineId);
                if(data.isSuccess && data.result){
                    setVaccineInventoryDetailById(data.result);
                }
            }catch (err){
                console.error(err);
                setError("Lỗi Khi Tải danh sách vaccine trong kho");
            }finally {
                setLoading(false);
            }
        }
        fetchVaccineInventoryDetail();
    }, [vaccineId]);

    return{vaccineInventoryDetailById, loading, error};
}
export const useTopUsedVaccine =  () => {
    const [topUseVaccine, setTopUseVaccine] = useState<TopUseVaccine[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopUseVaccine = async () => {
            setLoading(true);
            setError(null);
            try{
                const response = await apiTopUseVaccine();
                if (response && Array.isArray(response.result)) {
                    setTopUseVaccine(response.result)
                }
            }catch (err){
                console.error(err);
                setError("Err")
            }finally {
                setLoading(false)
            }
        }
        fetchTopUseVaccine();
    },[])
    return{topUseVaccine, loading, error}
}

