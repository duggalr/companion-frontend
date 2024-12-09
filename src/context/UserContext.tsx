"use client";
import { createContext, useState, ReactNode, useEffect } from 'react';
import { getUserAccessToken } from '@/lib/internal/getUserAccessToken';
import { validAuthenticatedUser } from "@/lib/api/checkAuthenticatedUser";
import LoadingScreen from '../app/components/ui/Loading';
import { getFromLocalStorage, saveToLocalStorage } from '../lib/utils/localStorageUtils';
import generateUserID from '../lib/utils/generateAnonUserId';
// import { createAnonUser } from '@/lib/api/createAnonUser';
import { createAnonUser } from '../lib/api/createAnonUser';
import { validateAnonUser } from '../lib/api/validateAnonUser';


interface UserContextType {
    isAuthenticated: boolean;
    userAccessToken: string | null;
    // loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider component
export const InternalUserProvider = ({ children }: { children: ReactNode }) => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userAccessToken, setUserAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const _handleUserAccessTokenFetch = async() => {

        try {
            const user_access_token = await getUserAccessToken();

            if (user_access_token) {
                const user_valid_response = await validAuthenticatedUser(user_access_token);
                if (user_valid_response['success'] === true){
                    setIsAuthenticated(true);
                    setUserAccessToken(user_access_token);
                } else {
                    // TODO: user is not passing valid access token
                }
            }
            else {
                // Not Authenticated as access token is null

                let current_user_id = getFromLocalStorage('user_id');
                console.log('current-user_id:', current_user_id);
                if (current_user_id){                    
                    // User already has ID created
                    // Pass to Backend to save if isn't saved already
                    validateAnonUser(current_user_id);

                } else {

                    let rnd_user_id = await generateUserID();
                    saveToLocalStorage('user_id', rnd_user_id);
                    createAnonUser(rnd_user_id);

                }
            }
        }
        catch (error) {
            // console.error("Error fetching user access token:", error);
        }
        finally {
            setLoading(false); // Set loading to false after the fetch completes
        }

    }

    useEffect(() => {
        _handleUserAccessTokenFetch();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <UserContext.Provider value={{ isAuthenticated, userAccessToken }}>
            {children}
        </UserContext.Provider>
    );

};