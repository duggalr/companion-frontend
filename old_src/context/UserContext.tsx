"use client";
import { createContext, useState, ReactNode } from 'react';
import { getUserAccessToken } from '@/lib/internal/getUserAccessToken';


interface UserContextType {
    isAuthenticated: boolean;
    userAccessToken: string | null;
    loading: boolean;
    // login: (name: string) => void;
    // logout: () => void;
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
                setIsAuthenticated(true);
                setUserAccessToken(user_access_token);                

            }
        }
        catch (error) {
            console.error("Error fetching user access token:", error);
        }
        finally {
            setLoading(false); // Set loading to false after the fetch completes
        }

    }

    _handleUserAccessTokenFetch();

    return (
        <UserContext.Provider value={{ isAuthenticated, userAccessToken, loading }}>
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