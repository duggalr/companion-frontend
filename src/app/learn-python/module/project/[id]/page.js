"use client";
import React, { useEffect } from 'react';
import ModuleProjectLayout from "@/app/components/Experimental/ModuleProjectLayout";


// learn-python/module/projet/[id]
export default function Home({ params }) {

    const { id } = params; // 'id' is automatically pulled from the dynamic route
    console.log('ID:', id);

    // Update page title
    useEffect(() => {

        // TODO: change this after finalized
        document.title = "Companion | Module"; 

    }, []);

    return (

        <main className="h-screen">
            <ModuleProjectLayout module_id={id} />
        </main>

    );

}