"use client";
import React, { useEffect } from 'react';
import TopNavBar from '@/app/components/Utils/TopNavBar';


export default function Home() {

    // const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Companion | Playground";
    }, []);

    return (

        <main className="h-screen">
            <TopNavBar />
            <h1>Testing</h1>
        </main>

    );
}