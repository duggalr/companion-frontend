"use client";
import { useEffect, useRef, useState } from "react";
import HeroNavBar from './components/Hero/HeroNavBar';
import HeroPrimary from './components/Hero/HeroPrimary';
import { validAuthenticatedUser } from '@/lib/api/checkAuthenticatedUser';
import useUserContext from "../lib/hooks/useUserContext";


export default function Home() {
    
    // const [initialPageLoad, setInitialPageLoad] = useState(true);
    // const loadingRef = useRef(true);

    // const userContext = useContext(UserContext);

    // TODO: use this now to render this page and it's components, go from there
    // const { isAuthenticated, isReady } = useUserContext();
    const userContext = useUserContext();

    // Update page title
    useEffect(() => {
        document.title = "Companion | Learn With AI";
    }, []);

    // const _handleUserValidation = async() => {

    //     const user_access_token = userContext?.userAccessToken;
    //     await validAuthenticatedUser(user_access_token);

    // }

    // // TODO: start with completing task 1 and go from there
    // useEffect(() => {

    //     if (userContext && userContext.loading === false){
    //         setInitialPageLoad(false);
    //         if (userContext.isAuthenticated === true){
    //             _handleUserValidation();
    //         }
    //     };

    // }, [userContext]);


    // useEffect(() => {

    //     console.log('Current Status -->', isAuthenticated, isReady);

    // }, [isAuthenticated, isReady])


    return (

        <>
            {/* Top Lambda Banner */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-1 shadow-lg">
                <p className="text-sm text-center">
                    Made with ❤️ by <a href="https://lambdalabs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 hover:no-underline transition-colors duration-300">Lambda</a>
                </p>
            </div>

            <HeroNavBar />
            <HeroPrimary />
        </>

            
        // <>
        //     <main>
        //         {initialPageLoad ? (
        //             <div>Loading...</div>
        //         ) : (
            //         <>
            //             {/* Top Lambda Banner */}
            //             <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-1 shadow-lg">
            //                 <p className="text-sm text-center">
            //                     Made with ❤️ by <a href="https://lambdalabs.com/" target="_blank" rel="noopener noreferrer"
            // className="text-blue-400 hover:text-blue-600 hover:no-underline transition-colors duration-300">
            //     Lambda
            // </a>
            //                 </p>
            //             </div>

            //             <HeroNavBar userAuthenticated={userContext?.isAuthenticated} pageLoading={loadingRef.current} />
            //             <HeroPrimary userAuthenticated={userContext?.isAuthenticated}/>
            //         </>
        //         )}
        //     </main>
        // </>

    );

}