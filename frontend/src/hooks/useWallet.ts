import {useEffect, useState} from "react";
import {WalletDetail} from "../interfaces/Account.ts";
import {apiGetWalletUserByUserId} from "../apis/apiTransaction.ts";

export const useWalletUserDetail = () => {
    const [walletDetail, setWalletDetail] = useState<WalletDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWallet = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGetWalletUserByUserId();
                console.log("Data: ", data);
                if (data.isSuccess) {
                    setWalletDetail(data.result);
                }
            } catch (error) {
                console.error(error);
                setError("Errrr");
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    return {walletDetail, loading, error};
}


