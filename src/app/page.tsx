"use client";
import { useEffect } from 'react';
import HeroNavBar from './components/Hero/HeroNavBar';
import HeroPrimary from './components/Hero/HeroPrimary';


export default function Home() {

    useEffect(() => {}, []);

    return (
       
        <main>
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-1 shadow-lg">
                <p className="text-sm text-center">
                    Made with ❤️ by <a href="https://lambdalabs.com/" target="_blank" rel="noopener noreferrer"
className="text-blue-400 hover:text-blue-600 hover:no-underline transition-colors duration-300">
    Lambda Labs
</a>
                </p>
            </div>

            <HeroNavBar />
            <HeroPrimary />
        </main>

    );

}