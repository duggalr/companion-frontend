"use client";
import React, { useEffect } from 'react';
import StartLayout from "@/app/components/Experimental/StartLayout";


export default function Home() {

    // Update page title
    useEffect(() => {
        document.title = "Learn Python with an AI"; 
    }, []);

    return (

        <main className="h-screen">
            <StartLayout />
        </main>

    );
}