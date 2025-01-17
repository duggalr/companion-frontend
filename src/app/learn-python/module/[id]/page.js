"use client";
import React, { useEffect } from 'react';
// import ModuleLayout from "@/app/components/Experimental/ModuleLayout";
import NewModuleLayout from "@/app/components/Experimental/NewModuleLayout";


// learn-python/course/module/[id]
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
            {/* <ModuleLayout module_id={id} /> */}
            <NewModuleLayout module_id={id} />
        </main>

    );
}