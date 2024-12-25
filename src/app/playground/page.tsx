"use client";
import { useEffect } from 'react';
// import { UserContext } from '@/context/UserContext';
import { PlaygroundProvider } from '@/context/PlaygroundContext';
import { SubmissionProvider } from '@/context/SubmissionContext';
import TopNavBar from '@/app/components/Utils/TopNavBar';
import Layout from '@/app/components/Playground/Layout';


export default function Home() {

    // const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Companion | Playground";
    }, []);

    return (

        <PlaygroundProvider>
            <SubmissionProvider>
                <main className="h-screen">
                    <TopNavBar />
                    <Layout />
                </main>
            </SubmissionProvider>
        </PlaygroundProvider>

    );
}