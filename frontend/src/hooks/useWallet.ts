import {useEffect, useState} from "react";
import {WalletUser} from "../interfaces/Account.ts";
import {apiGetUserWallet} from "../apis/apiWaller.ts";

export const useWalletUserDetail = () => {
    const [walletDetail, setWalletDetail] = useState<WalletUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWallet = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiGetUserWallet();
                if(response.isSuccess && response.result) {
                    setWalletDetail(response.result);
                }
            }catch (err){
                setError("Error Fetching User Wallet");
                console.log(err);
            }finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, [])

    return {walletDetail, loading, error};
}