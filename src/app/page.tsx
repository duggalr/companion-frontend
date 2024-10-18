"use client";  // Add this at the top
import { useEffect } from 'react';
import HeroNavBar from './components/Hero/HeroNavBar';
import HeroPrimary from './components/Hero/HeroPrimary';

export default function Home() {

    useEffect(() => {}, []);

    return (
       
        <main>
            <HeroNavBar />
            <HeroPrimary />
        </main>

    );

}