"use client";
import { createContext, useState, ReactNode, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/utils/localStorageUtils';
import LoadingScreen from '@/app/components/ui/Loading';
import { validateAnonUser } from '@/lib/backend_api/validateAnonUser';
import generateAnonUserID from '@/lib/utils/generateAnonUserID';
import { createAnonUser } from '@/lib/backend_api/createAnonUser'
import { getUserAccessToken } from '@/lib/backend_api/getUserAccessToken';
import { validateAuthenticatedUser } from '@/lib/backend_api/validateAuthenticatedUser';
import { useUser } from "@auth0/nextjs-auth0/client";


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
    const { user, isLoading, error } = useUser();

    console.log('IS AUTH ZERO LOADING:', isLoading);

    const _handleAnonUserValidation = async () => {

        const current_user_id = await getFromLocalStorage('user_id');

        if (current_user_id !== null){
            const validation_response = await validateAnonUser(current_user_id);

            if ('success' in validation_response){
                if (validation_response['success'] == false){
                    // TODO: how to handle here when user ID given is not valid?
                    console.log('error:', validation_response['error_message']);
                } else {
                    saveToLocalStorage('user_id', validation_response['custom_user_object_dict']['anon_user_id']);
                    setLoading(false);
                }
            }

            setLoading(false);

        } else {

            const rnd_user_id = await generateAnonUserID();
            saveToLocalStorage('user_id', rnd_user_id);
            
            const create_user_response = await createAnonUser(rnd_user_id);

            if ('success' in create_user_response){
                if (create_user_response['success'] == false){
                    // TODO: how to handle here when user ID given is not valid?
                    console.log('error:', create_user_response['error_message']);
                } else {
                    saveToLocalStorage('user_id', create_user_response['custom_user_object_dict']['anon_user_id']);
                    setLoading(false);
                }
            }

            setLoading(false);

        }

    }

    const _handleUserInitialization = async () => {

        try {
            const user_access_token = await getUserAccessToken();
            if (user_access_token) {
                let user_profile_information = {
                    'email': user['email'],
                    'email_verified': user['email_verified'],
                    'sub_id': user['sub'],
                    'given_name': user['given_name'],
                    'family_name': user['family_name'],
                    'full_name': user['name'],
                    'profile_picture_url': user['picture']
                };

                const user_valid_response = await validateAuthenticatedUser(
                    user_access_token,
                    user_profile_information
                );
                if (user_valid_response['success'] === true){
                    setIsAuthenticated(true);
                    setUserAccessToken(user_access_token);
                } else {
                    // TODO: user is not passing valid access token
                }
            }
            else {
                // Not Authenticated as access token is null
                _handleAnonUserValidation();
            }

        }
        catch (error) {
            console.error("Error fetching user access token:", error);
        }
        finally {
            setLoading(false); // Set loading to false after the fetch completes
        }

    }

    useEffect(() => {
        if (isLoading === false){
            _handleUserInitialization();
        }
        // _handleAnonUserValidation();
    }, [isLoading]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <UserContext.Provider value={{ isAuthenticated, userAccessToken }}>
            {children}
        </UserContext.Provider>
    );

};