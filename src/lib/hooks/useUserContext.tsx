import { useContext } from "react";
import { UserContext } from '@/context/UserContext';


export default function useUserContext() {

    const userContext = useContext(UserContext) || { isAuthenticated: false, userAccessToken: null };
    return userContext;
    // const userData = useContext(UserContext);
    // if (userData){
    //     return userData;
    // }

}