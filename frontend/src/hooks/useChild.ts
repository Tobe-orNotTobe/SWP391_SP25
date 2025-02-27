import {useEffect, useState} from "react";
import {ChildDetailResponse, MyChildResponse} from "../interfaces/Child.ts";
import {apiGetMyChilds} from "../apis/apiChild.ts";

export const useMyChilds = () =>{
    const[myChilds, setMyChilds] = useState<ChildDetailResponse[]>([]);
    const[loading, setLoading] = useState<boolean>(false);
    const[error, setError] = useState<string>("");

    useEffect(() =>{
        const fetchMyChilds = async () =>{
            setLoading(true);
            try{
                const data: MyChildResponse = await apiGetMyChilds();
                if (data.isSuccess) {
                    setMyChilds(data.result);
                }
            }catch (err){
                setError("Error Fetching My Children Data");
                console.error(err)
            }finally{
                setLoading(false);
            }
        };

        fetchMyChilds();
    }, []);

    return {myChilds, loading, error};
}