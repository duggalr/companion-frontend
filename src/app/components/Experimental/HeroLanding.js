import React, { useState, useEffect } from "react";
import { Pacifico } from 'next/font/google';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faUserPlus, faArrowRightFromBracket, faSquareCaretRight, faSchool, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import ThemeToggle from "@/app/components/Utils/ThemeToggle";
import NewHeroNavbar from "./NewHeroNavbar";
import { AuroraText } from "@/components/ui/aurora-text";


const pacifico_font = Pacifico({
    subsets: ['latin'],
    weight: ['400']
});

const HeroLanding = () => {

    const DISCORD_CHANNEL_URL = process.env.NEXT_PUBLIC_DISCORD_CHAT_URL;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const _handleStartBtnClick = () => {
        window.location.href = '/learn-python/start';
    }

    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });
    }, []);

    return (

        <main>

            {/* Hero Navbar */}
            <NewHeroNavbar />

            {/* Hero Main */}
            <div className="flex flex-col items-center mt-32 pb-16">

                {/* SVG One */}
                <div className="absolute bottom-1/3 left-16 -rotate-12 xl:block hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="50" height="50">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m6 0h3" />
                    </svg>
                </div>

                {/* SVG Two */}
                <div className="absolute top-1/4 right-24 rotate-12 xl:block hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>

                <h1 className="mb-0 text-[46px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-300" data-aos="fade-down">
                    {/* Learn Python with an <span className="text-blue-600 dark:text-blue-500">AI Teacher</span>. */}
                    {/* Let An <span className="text-blue-600 dark:text-blue-500">AI Teach You</span> Python. */}
                    {/* Let An <AuroraText>AI Teach You</AuroraText> Python. */}
                </h1>

                <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                    Let An <AuroraText>AI Teach</AuroraText> You Python.
                </h1>

                <p className="mb-0 pt-6 text-[23px] font-normal tracking-normal text-gray-500 dark:text-gray-400" data-aos="fade-down">
                    Have an AI teach you Python, by designing a personalized Python course tailored to the project you have in mind.
                    {/* Let an AI teach you Python by designing a personalized Python course tailored to your goals and projects. */}
                    {/* Say goodbye to boring tutorials. Let AI design a personalized Python course tailored to your goals and projects. */}
                    {/* Let an AI teach you Python, by generating a personalized course based on a project you want to create. */}
                    {/* Let an AI generate a personalized course based on your goals. */}
                </p>

                <InteractiveHoverButton text="Start" className="mt-8 text-[18.5px] py-2.5" data-aos="fade-in" onClick={_handleStartBtnClick}/>
                <span className="text-gray-400 dark:text-gray-400 pt-2 text-[11.5px] tracking-normal">
                    No Login Required. 100% Free.
                </span>

                <div className="relative mt-10 w-3/4" data-aos="fade-in">
                    <HeroVideoDialog
                        className="dark:hidden block"
                        animationStyle="from-center"
                        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                        thumbnailAlt="Hero Video"
                    />
                    <HeroVideoDialog
                        className="hidden dark:block"
                        animationStyle="from-center"
                        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                        thumbnailAlt="Hero Video"
                    />
                </div>


            </div>

        </main>

    )

}

export default HeroLanding;
