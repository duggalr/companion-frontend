"use client";
import React, { useEffect } from 'react';
import ExperimentalLayout from '@/app/components/Experimental/Layout';

export default function Home() {

    // Update page title
    useEffect(() => {

        // TODO: change this after finalized
        document.title = "Companion | Experimental"; 
        
    }, []);

    return (

        <main className="h-screen">
            <ExperimentalLayout/>
        </main>

    );
}