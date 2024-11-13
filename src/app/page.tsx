"use client";
import { useEffect, useState, useRef, useContext } from "react";
import HeroNavBar from './components/Hero/HeroNavBar';
import HeroPrimary from './components/Hero/HeroPrimary';
import { UserContext } from '../context/UserContext';


export default function Home() {
    
    const [loading, setLoading] = useState(true);

    const userContext = useContext(UserContext);

    // Handle case where the context is not provided
    if (!userContext) {
        throw new Error("Internal Error");
    }

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