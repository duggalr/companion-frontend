"use client";
import { useEffect, useState, useRef, useContext } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import HeroNavBar from './components/Hero/HeroNavBar';
import HeroPrimary from './components/Hero/HeroPrimary';

// import { validAuthenticatedUser } from '../lib/checkAuthenticatedUser';
import { UserContext } from '../context/UserContext';


export default function Home() {
    
    // const { user } = useUser();
    // const [userAccessToken, setUserAccessToken] = useState(null);
    // const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const userContext = useContext(UserContext);
    // console.log('user-context', userContext);

    // Handle case where the context is not provided
    if (!userContext) {
        throw new Error("AuthButtons must be used within an InternalUserProvider");
    }

    // const handleFetchUserData = async () => {

    //     console.log('current-USER:', user);

    //     try {
    //         const res = await fetch('/api/get-access-token', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         const { accessToken } = await res.json();
    //         if (accessToken !== undefined) {
    //             setUserAccessToken(accessToken);
    //             setUserIsAuthenticated(true);
    //             setLoading(true);

    //             // TODO: what if success is false?
    //             let validated_user_response = await validAuthenticatedUser(accessToken);
    //             console.log('validated user response', validated_user_response);

    //         };
    //     } catch (error) {
    //         // console.error("Error fetching access token or data:", error);
    //     }
    // };

    // useEffect(() => {
    //     handleFetchUserData();
    // }, []);


    // Update page title
    useEffect(() => {
        document.title = "Playground";
    }, []);
    

    return (
       
        <main>
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-1 shadow-lg">
                <p className="text-sm text-center">
                    Made with ❤️ by <a href="https://lambdalabs.com/" target="_blank" rel="noopener noreferrer"
className="text-blue-400 hover:text-blue-600 hover:no-underline transition-colors duration-300">
    Lambda
</a>
                </p>
            </div>

            <HeroNavBar accessToken={userContext.userAccessToken} userAuthenticated={userContext.isAuthenticated} pageLoading={loading} />
            <HeroPrimary />

        </main>

    );

}