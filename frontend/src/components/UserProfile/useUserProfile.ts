import {useEffect, useState} from "react";
import {UserProfile} from "../../interfaces/Account.ts";
import {apiGetProfileUser} from "../../apis/apiAccount.ts";


export const useUserProfileDetail = () =>{
    const  [userProfile, setUserProfile] = useState<UserProfile>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true)
            try{
                const data = await apiGetProfileUser();
                // console.log(data)
                if(data.isSuccess && data.result) {
                    setUserProfile(data.result);
                }
            }catch (error){
                setError("Error Fetching User Profile");
                console.error(error);
            }finally {
                setLoading(false);
            }

        }
        fetchUserProfile();
    }, []);

    return{userProfile, loading, error};
}
