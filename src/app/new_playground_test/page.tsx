"use client";
import { useEffect, useState, useContext } from 'react';
import { PlaygroundProvider } from '../../context/PlaygroundContext';
import TopNavBar from '../components/Utils/TopNavBar';
import NewPlaygroundLayout from '../components/Playground/PlaygroundLayout';


export default function PlaygroundLayout() {

    // Update page title
    useEffect(() => {
        document.title = "Companion | Playground";
    }, []);

    return (

        <PlaygroundProvider>
            <main className="h-screen">
                <TopNavBar />
                <NewPlaygroundLayout/>
            </main>
        </PlaygroundProvider>

        // // overflow-auto no-scrollbar
        // <main className="h-screen">

        //     {/* className='h-screen overflow-hidden' */}
        //     {loading ? (
        //         // Loading indicator while page is loading
        //         <div>Loading...</div>
        //     ) : (

        //         <div>

        //             <TopNavBar userAuthenticated={userContext?.isAuthenticated} />
        //             <NewPlaygroundLayout
        //                 accessToken={userContext?.userAccessToken}
        //                 userAuthenticated={userContext?.isAuthenticated}
        //                 pageLoading={loading}
        //             />

        //         </div>

        //     )}

        // </main>
    );
}