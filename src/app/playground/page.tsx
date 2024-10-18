"use client";  // Add this at the top
import { useEffect, useState } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
import MainLayout from '../components/PlaygroundLayout/MainLayout';


export default function Home() {

    const [theme, setTheme] = useState('light');

    useEffect(() => {}, []);

    return (
       
        <main>
            <TopNavBar />
            <MainLayout />
        </main>

    );

}