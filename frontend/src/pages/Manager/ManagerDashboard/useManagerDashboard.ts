import {useEffect, useState} from "react";
import {ExportedVaccine} from "../../../interfaces/Vaccine.ts";
import {apiAdminExportedVaccine} from "../../../apis/apiAdmin.ts";

export const useExportedVaccines = () => {

    const [exportVaccine, setExportedVaccine] = useState<ExportedVaccine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExportedVaccines = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiAdminExportedVaccine()
                if(response.isSuccess && Array.isArray(response.result)) {
                    setExportedVaccine(response.result);
                }
            }catch (err){
                setError("Error Fetching ExportedVaccine");
                console.log(err);
            }finally {
                setLoading(false);
            }
        };
        fetchExportedVaccines()
    },[])
    return {exportVaccine, loading, error};
}