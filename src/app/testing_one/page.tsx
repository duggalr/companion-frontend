"use client";
import { useEffect } from 'react';
// import { UserContext } from '@/context/UserContext';
import { PlaygroundProvider } from '@/context/PlaygroundContext';


export default function TestingOne() {

    // Update page title
    useEffect(() => {
        document.title = "Companion | Problem Set";
    }, []);

    return (

        <PlaygroundProvider>
            <main className="h-screen">
                <a href="/playground?psid=9293b0a2-66af-45ef-9c3a-736609f2b21b">
                    Problem Set 1
                </a>
            </main>
        </PlaygroundProvider>

    );
}