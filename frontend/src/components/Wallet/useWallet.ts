import {useEffect, useState} from "react";
import {RefundListUser, WalletHistoryUserDetail, WalletUser} from "../../interfaces/Account.ts";
import {apiGetUserWallet} from "../../apis/apiAccount.ts";
import {apiDepositeUserToWallet, apiGetUserRefundList} from "../../apis/apiTransaction.ts";
import {toast} from "react-toastify";
import {AxiosError} from "axios";

export const useRefundUserList = () => {
    const [refundUser, setRefundUser] = useState< RefundListUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRefundUserList = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const data = await apiGetUserRefundList()
                if(data.isSuccess){
                    setRefundUser(data.result);
                }
            }catch (err){
                console.log(err)
                setError("Unknown error occurred");
            }
        }

        fetchRefundUserList()
    }, []);

    return {refundUser, isLoading, error};
}

export const useWalletUserDetail = () => {
    const [walletData, setWalletData] = useState<WalletUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchWalletData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiGetUserWallet();
            if (data.isSuccess) {
                setWalletData(data.result);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
            setWalletData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return { walletData, isLoading, error, fetchWalletData };
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

export const useWalletLogic = () => {
    const { walletData,fetchWalletData } = useWalletUserDetail();
    const { transactions} = useRecentTransactions();
    const { refundUser} = useRefundUserList();

    useEffect(() => {
        fetchWalletData()
    }, []);

    const [activeTransactionTab, setActiveTransactionTab] = useState("All");
    const [activeRefundTab, setActiveRefundTab] = useState("All");
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [topupAmount, setTopupAmount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRefundPage, setCurrentRefundPage] = useState(1);
    const pageSize = 4;
    const refundPageSize = 4;

    // Filter transactions based on selected tab
    const filteredTransactions = activeTransactionTab === "All"
        ? transactions
        : transactions.filter(tx => tx.transactionType === activeTransactionTab);

    // Filter refunds based on selected tab
    const filteredRefunds = activeRefundTab === "All"
        ? refundUser
        : refundUser.filter(refund => refund.status === activeRefundTab);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + ' VND';
    };

    const getTransactionTagColor = (type: string, amount: number) => {
        switch (type) {
            case 'Nạp tiền':
                return 'green';
            case 'Hoàn tiền':
                return amount < 0 ? 'red' : 'green';
            default:
                return 'default';
        }
    };

    const getTransactionTypeName = (type: string, amount: number) => {
        switch (type) {
            case 'Nạp tiền':
                return 'Nạp tiền';
            case 'Thanh toán lịch hẹn':
                return amount < 0 ? 'Thanh toán' : '';
            case 'Hoàn tiền':
                return 'Hoàn tiền';
            default:
                return type;
        }
    };

    // Function to get the refund status tag color
    const getRefundStatusTagColor = (status: string) => {
        switch (status) {
            case 'Đang chờ xử lý':
                return 'gold';
            case 'Đã chấp nhận':
                return 'green';
            case 'Bị từ chối':
                return 'red';
            default:
                return 'blue';
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
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(`${error.response?.data?.errors?.Amount}`);
            }
        }
    }

    return {
        walletData,
        transactions,
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

        // Refund related
        refundUser,
        activeRefundTab,
        setActiveRefundTab,
        currentRefundPage,
        setCurrentRefundPage,
        refundPageSize,
        filteredRefunds,
        getRefundStatusTagColor,

        // Common utilities
        formatDate,
        formatCurrency,
        getTransactionTagColor,
        getTransactionTypeName,
        handleTopup,
        handleAddFundToUseWallet
    };
};