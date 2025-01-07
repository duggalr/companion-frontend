"use client";
import React, { useEffect } from "react";
import useUserContext from "@/lib/hooks/useUserContext";
import HeroNavBar from './components/Hero/HeroNavBar';
// import HeroPrimary from "./components/Hero/HeroPrimary";
import HeroPrimary from "./components/Hero/HeroPrimary";
// import { useUser } from "@auth0/nextjs-auth0/client";


export default function Home() {

    const userContext = useUserContext();
    // const { user, isLoading, error } = useUser();

    // Update page title
    useEffect(() => {
        document.title = "Companion | Learn With AI";
    }, []);

    return (

        <>
            {/* Top Lambda Banner */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-1 shadow-lg">
                <p className="text-sm text-center">
                    Made with ❤️ by <a href="https://lambdalabs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 hover:no-underline transition-colors duration-300">Lambda</a>
                </p>
            </div>

            <HeroNavBar userAuthenticated={userContext?.isAuthenticated} />
            <HeroPrimary userAuthenticated={userContext?.isAuthenticated}/>
        </>

    );

}