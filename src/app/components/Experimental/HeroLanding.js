import React, { useEffect, useState } from "react";
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import NewHeroNavbar from "./NewHeroNavbar";
import { AuroraText } from "@/components/ui/aurora-text";
import {  getFromLocalStorage } from '@/lib/utils/localStorageUtils';


const HeroLanding = () => {

    const [showStartButton, setShowStartButton] = useState(true);

    const _handleStartBtnClick = () => {
        window.location.href = '/learn-python/start';
    }

    const _handleHomeBtnClick = () => {
        window.location.href = '/learn-python/home';
    }

    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });
    }, []);

    useEffect(() => {

        let user_course_state_dict = getFromLocalStorage('user_course_state_dict');
        if (user_course_state_dict){
            setShowStartButton(false);
        }

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

                <p className="mb-0 pt-6 text-[21px] font-normal tracking-normal text-gray-500 dark:text-gray-400" data-aos="fade-down">
                    Have an AI teach you Python, by designing a personalized Python course and exercises tailored to the project you have in mind.
                    {/* Let an AI teach you Python by designing a personalized Python course tailored to your goals and projects. */}
                    {/* Say goodbye to boring tutorials. Let AI design a personalized Python course tailored to your goals and projects. */}
                    {/* Let an AI teach you Python, by generating a personalized course based on a project you want to create. */}
                    {/* Let an AI generate a personalized course based on your goals. */}
                </p>

                { (showStartButton === true) ? (
                    <InteractiveHoverButton text="Start" className="mt-8 text-[18.5px] py-2.5" data-aos="fade-up" onClick={_handleStartBtnClick}/>
                ) : (
                    <InteractiveHoverButton text="Home" className="mt-8 text-[18.5px] py-2.5" data-aos="fade-up" onClick={_handleHomeBtnClick}/>
                )}
                
                <span className="text-gray-400 dark:text-gray-400 pt-2 text-[11.5px] tracking-normal" data-aos="fade-up">
                    No Login Required. 100% Free.
                </span>

                <div className="relative mt-10 w-3/4" data-aos="fade-up">
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

            {/* Footer */}
            {/* TODO: start here */}
            <footer className="w-full py-4 text-center text-[14px] text-gray-400 pt-12">
                <p>Contact: <a href="mailto:duggalr42@gmail.com" className="text-blue-400">duggalr42@gmail.com</a></p>
            </footer>

        </main>

    )

}

export default HeroLanding;