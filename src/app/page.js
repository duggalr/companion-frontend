"use client";
import React, { useEffect } from 'react';
// import StartLayout from "@/app/components/Experimental/StartLayout";
import HeroLanding from "@/app/components/Experimental/HeroLanding";


export default function Home() {

    // Update page title
    useEffect(() => {
        document.title = "Learn Python with an AI"; 
    }, []);

    return (

        <main className="h-screen">
            {/* <StartLayout /> */}
            
            {/* Top Lambda Banner */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-1 shadow-lg">
                <p className="text-sm text-center">
                    Made with ❤️ by <a href="https://lambdalabs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 hover:no-underline transition-colors duration-300">Lambda</a>
                </p>
            </div>

            <HeroLanding />
        </main>

    );
}