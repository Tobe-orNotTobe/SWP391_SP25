import {useEffect, useState} from "react";
import {RefundUserList} from "../../../interfaces/Transaction.ts";
import {apiGetRefundList, apiGetRefundRequestById} from "../../../apis/apiAdmin.ts";

export const useRefundUserListAdmin = () => {
    const [refundUserList, setRefundUserList] = useState<RefundUserList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRefundUserList =  async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiGetRefundList();
                if (response.isSuccess) {
                    setRefundUserList(response.result);
                }
            }catch (err){
                setError("Error Fetching RefundUserList");
                console.log(err);
            }finally {
                setLoading(false);
            }
        };

        fetchRefundUserList();
    },[])

    return {refundUserList,loading, error};
}

export const useRefundUserListById = ( id: number) => {
    const [refundUserList, setRefundUserList] = useState<RefundUserList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRefundUserList =  async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiGetRefundRequestById(id);
                if (response.isSuccess) {
                    setRefundUserList(response.result);
                }
            }catch (err){
                setError("Error Fetching RefundUserList");
                console.log(err);
            }finally {
                setLoading(false);
            }
        };

        fetchRefundUserList();
    },[id])

    return {refundUserList,loading, error};
}