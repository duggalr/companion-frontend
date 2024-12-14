"use client";
import { createContext, useState, ReactNode, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/utils/localStorageUtils';
import LoadingScreen from '@/app/components/ui/Loading';
import { validateAnonUser } from '@/lib/backend_api/validateAnonUser';
import generateAnonUserID from '@/lib/utils/generateAnonUserID';
import { createAnonUser } from '@/lib/backend_api/createAnonUser'


interface UserContextType {
    isAuthenticated: boolean;
    userAccessToken: string | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider component
export const InternalUserProvider = ({ children }: { children: ReactNode }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userAccessToken, setUserAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const _handleAnonUserValidation = async () => {

        let current_user_id = getFromLocalStorage('user_id');
        console.log('current-user_id:', current_user_id);

        if (current_user_id){
            // User already has ID created
            // Pass to Backend to save if isn't saved already
            let validation_response = await validateAnonUser(current_user_id);
            if (validation_response['success'] == false){
                // TODO: how to handle here when user ID given is not valid?
            }
            setLoading(false);

        } else {

            let rnd_user_id = await generateAnonUserID();
            saveToLocalStorage('user_id', rnd_user_id);
            createAnonUser(rnd_user_id);
            setLoading(false);

        }

    }

    useEffect(() => {
        _handleAnonUserValidation();
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