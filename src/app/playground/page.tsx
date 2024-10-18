"use client";  // Add this at the top
import { useEffect } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
import MainLayout from '../components/PlaygroundLayout/MainLayout';


export default function Home() {

    useEffect(() => {}, []);

    return (
       
        <main>
            <TopNavBar />
            <MainLayout />
        </main>

    );

}