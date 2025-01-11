"use client";
import React, { useEffect } from 'react';
import ModuleLayout from '@/app/components/Experimental/ModuleLayout';

export default function Home() {

    // Update page title
    useEffect(() => {

        // TODO: change this after finalized
        document.title = "Companion | Experimental"; 
        
    }, []);

    return (

        <main className="h-screen">
            <ModuleLayout/>
        </main>

    );
}