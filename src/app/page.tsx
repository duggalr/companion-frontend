"use client";
import { useEffect, useRef, useContext, useState } from "react";
import HeroNavBar from './components/Hero/HeroNavBar';
import HeroPrimary from './components/Hero/HeroPrimary';
import { UserContext } from '../context/UserContext';
import { validAuthenticatedUser } from '@/lib/api/checkAuthenticatedUser';


export default function Home() {
    
    const [initialPageLoad, setInitialPageLoad] = useState(true);
    const loadingRef = useRef(true);
    
    const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Playground";
    }, []);

    const _handleUserValidation = async() => {

        const user_access_token = userContext?.userAccessToken;
        await validAuthenticatedUser(user_access_token);

    }

    useEffect(() => {

        if (userContext && userContext.loading === false){
            setInitialPageLoad(false);
            if (userContext.isAuthenticated === true){
                _handleUserValidation();
            }
        };

    }, [userContext]);


    return (
    
        <>
            <main>
                {initialPageLoad ? (
                    // Loading indicator while page is loading
                    <div>Loading...</div>
                ) : (
                    // Render components only after loading completes
                    <>
                        {/* Top Banner */}
                        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-1 shadow-lg">
                            <p className="text-sm text-center">
                                Made with ❤️ by <a href="https://lambdalabs.com/" target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 hover:no-underline transition-colors duration-300">
                Lambda
            </a>
                            </p>
                        </div>

                        <HeroNavBar userAuthenticated={userContext?.isAuthenticated} pageLoading={loadingRef.current} />
                        <HeroPrimary />
                    </>
                )}
            </main>
        </>

    );

}