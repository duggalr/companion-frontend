"use client";
import { useEffect } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
import MainLayout from '../components/PlaygroundLayout/MainLayout';
import Head from 'next/head';


export default function Home() {

    // useEffect(() => {}, []);
    useEffect(() => {
        document.title = "Playground"; // Fallback in case the Head component doesn't work
      }, []);

    return (
       
        <>
            <Head>
                <title>Playground</title>
            </Head>
            <main>
                <TopNavBar />
                <MainLayout />
            </main>
        </>

    );

}