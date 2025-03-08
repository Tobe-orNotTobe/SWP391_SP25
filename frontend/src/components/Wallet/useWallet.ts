import {useEffect, useState} from "react";
import {WalletHistoryUserDetail, WalletUser} from "../../interfaces/Account.ts";
import {apiGetUserWallet} from "../../apis/apiAccount.ts";
import {apiDepositeUserToWallet} from "../../apis/apiTransaction.ts";
import {toast} from "react-toastify";
import {AxiosError} from "axios";


export const useWalletUserDetail = () => {
    const [walletData, setWalletData] = useState<WalletUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await apiGetUserWallet();
                if(data.isSuccess){
                    setWalletData(data.result);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
                setWalletData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWalletData();
    }, []);

    return { walletData, isLoading, error };
};

export const useRecentTransactions = () => {
    const [transactions, setTransactions] = useState<WalletHistoryUserDetail[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setError(null);
            setIsLoading(true);
            try {
                setIsLoading(true);
                const data = await apiGetUserWallet();
                if (data.isSuccess && data.result?.recentTransactions) {
                    setTransactions(data.result.recentTransactions);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));

            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return { transactions, isLoading, error };
};

// export const useRefundUserDetail = () => {
//     const [refundDetail, setRefundDetail] = useState<| null>(null);
// }


export const useWalletLogic = () => {
    const { walletData, isLoading: isLoadingWallet } = useWalletUserDetail();
    const { transactions, isLoading: isLoadingTransactions } = useRecentTransactions();

    const [activeTransactionTab, setActiveTransactionTab] = useState("All");
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [topupAmount, setTopupAmount] = useState< number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    // Filter transactions based on selected tab
    const filteredTransactions = activeTransactionTab === "All"
        ? transactions
        : transactions.filter(tx => tx.transactionType === activeTransactionTab);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' VND';
    };

    const getTransactionTagColor = (type: string) => {
        switch (type) {
            case 'Deposit':
                return 'green';
            case 'Withdrawal':
                return 'red';
            case 'Transfer':
                return 'blue';
            case 'Refund':
                return 'gold';
            default:
                return 'default';
        }
    };

    const getTransactionTypeName = (type: string) => {
        switch (type) {
            case 'Deposit':
                return 'Nạp tiền';
            case 'Withdrawal':
                return 'Rút tiền';
            case 'Transfer':
                return 'Chuyển tiền';
            case 'Refund':
                return 'Hoàn tiền';
            default:
                return type;
        }
    };

    const handleTopup = () => {
        setShowTopupModal(false);
        setTopupAmount(0);
    };

    const handleAddFundToUseWallet = async () => {

        try {
            const response = await apiDepositeUserToWallet(topupAmount);
            if(response.isSuccess){
                toast.success(response.result?.message);
                setShowTopupModal(false);
                window.location.href = response.result.paymentUrl;
            }

        }catch (error) {
            if (error instanceof AxiosError) {
                toast.error(`${error.response?.data?.errors?.Amount}`);
            }
        }
    }

    return {
        walletData,
        isLoadingWallet,
        transactions,
        isLoadingTransactions,
        activeTransactionTab,
        setActiveTransactionTab,
        showTopupModal,
        setShowTopupModal,
        topupAmount,
        setTopupAmount,
        currentPage,
        setCurrentPage,
        pageSize,
        filteredTransactions,
        formatDate,
        formatCurrency,
        getTransactionTagColor,
        getTransactionTypeName,
        handleTopup,
        handleAddFundToUseWallet
    };
};