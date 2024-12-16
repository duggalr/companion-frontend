"use client";
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { PlaygroundProvider } from '@/context/PlaygroundContext';
import TopNavBar from '@/app/components/Utils/TopNavBar';
import Layout from '@/app/components/Playground/Layout';

// import { UserContext } from '../../context/UserContext';
// import TopNavBar from '../components/Utils/TopNavBar';
// import PlaygroundLayout from '../components/PlaygroundLayout/MainLayout';
// import { validAuthenticatedUser } from '@/lib/api/checkAuthenticatedUser';


// export default function Home({ searchParams }: { searchParams: Record<string, string | string[]> }) {
export default function Home() {

    // const [loading, setLoading] = useState(true);
    const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Companion | Playground";
    }, []);

    // useEffect(() => {
    //     if (userContext && userContext.loading === false){
    //         setLoading(false);
    //     }
    // }, [userContext]);

    return (

        <PlaygroundProvider>
            <main className="h-screen">
                <TopNavBar />
                <Layout />
            </main>
        </PlaygroundProvider>

    );
}