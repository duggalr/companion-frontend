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
            <HeroLanding />
        </main>

    );
}