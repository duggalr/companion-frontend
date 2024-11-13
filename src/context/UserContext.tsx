"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
// import { getUserAccessToken } from '@/lib/getUserAccessToken';
import { getUserAccessToken } from '@/lib/internal/getUserAccessToken';


interface UserContextType {
    isAuthenticated: boolean;
    userAccessToken: string;
    login: (name: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider component
export const InternalUserProvider = ({ children }: { children: ReactNode }) => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userAccessToken, setUserAccessToken] = useState(null);

    const _handleUserAccessTokenFetch = async() => {

        let user_access_token = await getUserAccessToken();

        if (user_access_token !== undefined && user_access_token !== null) { 
            setIsAuthenticated(true);
            setUserAccessToken(user_access_token);
        }

    }

    _handleUserAccessTokenFetch();


    return (
        <UserContext.Provider value={{ isAuthenticated, userAccessToken }}>
            {children}
        </UserContext.Provider>
    );
};

// // Custom hook to use the UserContext
// export const useUser = () => {
//     const context = useContext(UserContext);
//     if (!context) throw new Error("useUser must be used within a UserProvider");
//     return context;
// };