"use client";
import React, { useEffect } from 'react';
import ExampleLayout from '@/app/components/Experimental/ExampleLayout';


export default function Home() {

    // Update page title
    useEffect(() => {

        // TODO: change this after finalized
        document.title = "Companion | Experimental"; 
        
    }, []);

    return (

        <main className="h-screen">
            <ExampleLayout />
        </main>

    );
}