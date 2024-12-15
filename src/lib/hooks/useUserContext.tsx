import { useContext } from "react";
import { UserContext } from '@/context/UserContext';


export default function useUserContext() {

    const userData = useContext(UserContext);
    return userData;

}