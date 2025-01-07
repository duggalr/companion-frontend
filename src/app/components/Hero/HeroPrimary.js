import React, { useEffect, useRef, useState } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import SparklesText from "@/components/ui/sparkles-text";
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { MagicCard } from "@/components/ui/magic-card";
import { getFromLocalStorage } from '@/lib/utils/localStorageUtils';


export default function HeroPrimary() {

    const aboutRef = useRef(null);
    const handleLearnMoreClick = () => {
        aboutRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start', // Optional, default is 'start'
            inline: 'nearest', // Optional, default is 'nearest'
        });
    };

    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });
    }, []);


    const [currentTheme, setCurrentTheme] = useState(null);

    useEffect(() => {

        let current_theme = getFromLocalStorage('theme');
        setCurrentTheme(current_theme);

    }, []);

    const _handleCourseBtnClick = () => {
        window.location.href = '/dashboard';
    }

    const _handlePGBtnClick = () => {
        window.location.href = '/playground';
    }

    return (

        <>

            {/* Landing Hero Section */}
            <section className="min-h-screen flex flex-col items-center py-16 px-4 mt-4">

                <div className="absolute bottom-1/3 left-16 -rotate-12 xl:block hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="50" height="50">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m6 0h3" />
                    </svg>
                </div>

                <div className="absolute top-1/4 right-24 rotate-12 xl:block hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto text-center mt-0 ">

                    <div
                        className="mb-6 w-full lg:w-1/3 mx-auto flex justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        data-aos="fade-in"
                    >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[14.5px]">
                            <span>✨ 100% Free and Open Source ✨</span>
                        </AnimatedShinyText>
                    </div>

                    <SparklesText text="Learn Programming With Your Personal AI Tutor" data-aos="fade-up" className="mt-0 tracking-wide"/>

                    <p className="text-[19px] text-muted-foreground pt-4 tracking-wide leading-9" data-aos="fade-up">
                        Companion is an AI Programming Tutor, providing feedback and guidance on your programming problems and solutions.
                    </p>

                    <p className="text-[19px] text-muted-foreground pt-2 tracking-wide leading-9" data-aos="fade-up">
                        Take <a 
                            className="text-blue-400 dark:text-blue-400 hover:underline mx-1"
                            href="https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/"
                            target="_blank" rel="noopener noreferrer"
                        >MIT&apos;s 6.100L Introduction to Python course</a> on our platform, with Companion providing you with real-time help and feedback.
                    </p>

                    <p
                        onClick={handleLearnMoreClick}
                        ref={aboutRef}
                        className="inline-block text-[14.5px] text-blue-400 pt-4 pb-4 tracking-wide hover:cursor-pointer hover:font-semibold hover:text-gray-800"
                        data-aos="fade-up"
                    >
                        Learn More
                    </p>

                    <div className="mt-2" data-aos="fade-down">

                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-[15.5px] px-5 py-3 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                            onClick={_handleCourseBtnClick}
                        >
                        Try MIT 6.100L - Introduction To Python
                        </button>

                        <button
                            type="button"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-[15.5px] px-5 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            onClick={_handlePGBtnClick}
                        >
                        Try the Tutor in our Playground REPL
                        </button>

                    </div>

                </div>

                {/* Landing Page Video */}
                <div className="relative mt-12" data-aos="fade-down">
                    <HeroVideoDialog
                        className="dark:hidden block"
                        animationStyle="from-center"
                        videoSrc="https://www.youtube.com/embed/ZK3eGk_i_48?si=mqjUlCsZyTPuDLVB"
                        thumbnailSrc="https://i.ytimg.com/vi/ZK3eGk_i_48/maxresdefault.jpg"
                        thumbnailAlt="Companion AI Demo"
                    />
                    <HeroVideoDialog
                        className="hidden dark:block"
                        animationStyle="from-center"
                        videoSrc="https://www.youtube.com/embed/ZK3eGk_i_48?si=mqjUlCsZyTPuDLVB"
                        thumbnailSrc="https://i.ytimg.com/vi/ZK3eGk_i_48/maxresdefault.jpg"
                        thumbnailAlt="Companion AI Demo"
                    />
                </div>

            </section>

            {/* About Section */}
            <section
                ref={aboutRef}
                className="min-h-screen flex flex-col items-center py-16 px-6"
            >
                <div className="max-w-6xl mx-auto mt-0 text-center">
                    <div
                        className="hidden md:flex mb-4 w-1/6 mx-auto justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        data-aos="fade-down"
                    >
                    <AnimatedShinyText className="inline-flex items-center justify-center px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[15px]">
                        <span>💬 Companion</span>
                    </AnimatedShinyText>
                    </div>

                    <SparklesText text="About" className="text-5xl" data-aos="fade-down" />

                    <div className="mt-8 pb-14 text-center" data-aos="fade-right">
                        {/* <p className="text-[19px] text-muted-foreground pt-4 tracking-wide leading-9" data-aos="fade-up"> */}
                        <p className="text-[19px] mb-6 leading-9 tracking-wide text-gray-500 dark:text-gray-400">
                            Companion is an AI-powered tutor, designed to help students and individuals by offering guidance and constructive feedback as they work through problems. <span className='font-semibold'>It is completely free to use.</span>
                        </p>

                        <p className="text-[19px] mb-6 leading-9 tracking-wide text-gray-500 dark:text-gray-400">
                            Rather than simply providing answers, Companion offers helpful hints
                            and insights to stimulate critical thinking. It also provides feedback on your solutions and lets you know if your solution has passed all test cases.
                        </p>

                        <p className="text-[19px] mb-6 leading-9 tracking-wide text-gray-500 dark:text-gray-400">
                            Feel free to explore and try out <a 
                                className="text-blue-400 dark:text-blue-400 hover:underline mx-1"
                                href="/dashboard"
                            >MIT&apos;s 6.100L Course</a> with Companion, or work through your own problems in our interactive<a 
                                className="text-blue-400 dark:text-blue-400 hover:underline mx-1"
                                href="/playground"
                            >playground</a>environment.
                        </p>

                        <p className="text-[19px] mb-6 leading-9 tracking-wide text-gray-500 dark:text-gray-400">
                            We plan to do several iterations on this project so if you have any ideas or want to help, feel free to <a
                                className="text-blue-400 dark:text-blue-400 hover:underline mx-1"
                                href="mailto:duggalr42@gmail.com"
                            >reach out!</a>
                        </p>

                    </div>


                    {/* What We Currently Offer Section */}
                    <h1
                        className="mb-10 text-3xl font-bold leading-none tracking-normal text-gray-900 dark:text-white"
                        data-aos="fade-up"
                    >Currently we offer:</h1>

                    <div
                        className={
                            "flex h-[500px] w-full flex-col gap-14 lg:h-[250px] lg:flex-row mt-12"
                        }
                        data-aos="fade-down"
                    >
                        <MagicCard
                            className="cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl shadow-md"
                            gradientColor={currentTheme === "dark" ? "#262626" : "#D9D9D955"}
                        >
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 pt-4">
                            {/* Learn Python with an AI */}
                            MIT&apos;s Introductory to Python Course
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 text-[17px] pt-6">
                            Take MIT&apos;s 6.100L Introduction to Python course on our site,
                            <br/>with Companion providing real-time guidance and feedback.
                            </p>

                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                Watch a Demo (TODO:)
                            </button>
                            
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
                                onClick={_handleCourseBtnClick}
                            >
                                Go to Course
                            </button>

                        </MagicCard>

                        <MagicCard
                            className="cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl shadow-md"
                            gradientColor={currentTheme === "dark" ? "#262626" : "#D9D9D955"}
                        >
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 pt-4">
                            Online Programming REPL Environment
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 text-[17px] pt-6">
                            Ask your own questions in our online IDE / REPL environment.
                            <br/>
                            Get help, guidance, and feedback from the AI tutor.
                            </p>  

                            <button type="button"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            >Watch a Demo (TODO:)</button>

                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
                                onClick={_handlePGBtnClick}
                            >Go to Playground</button>

                        </MagicCard>
                    </div>


                </div>

            </section>

            {/* Blog Section */}
            <section
                className='flex flex-col items-center py-16 px-6 pt-20 pb-28'
            >
                
                <div
                    className="hidden md:flex mb-4 w-1/6 mx-auto justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    data-aos="fade-down"
                >
                    <AnimatedShinyText className="inline-flex items-center justify-center px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[15px]">
                        <span>📖 Learn More</span>
                    </AnimatedShinyText>
                </div>

                <SparklesText text="Blog Posts" className="text-5xl" data-aos="fade-down"/>

                <div className="mt-12 w-3/4" data-aos="fade-up">
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center border-b pb-4 text-[17px]">
                            <a 
                                className="text-blue-400 dark:text-blue-400 hover:underline mx-1 text-[16.5px]"
                                href="https://medium.com/@drahul2820/companion-update-upcoming-mit-course-release-47bd9714b0a4"
                                target="_blank" rel="noopener noreferrer"
                            >📰 Companion: Update and Upcoming MIT Course Release</a>
                            <span className="text-gray-500 text-sm">Dec 16, 2024</span>
                        </li>

                        <li className="flex justify-between items-center border-b pb-2 pt-2 text-[16.5px] tracking-wide">
                            <a 
                                className="text-blue-400 dark:text-blue-400 hover:underline mx-1 text-[16px] tracking-wide"
                                href="https://medium.com/@drahul2820/introducing-companion-an-online-repl-with-an-ai-tutor-85c564fae398"
                                target="_blank" rel="noopener noreferrer"
                            >📰 Companion: Initial MVP Launch</a>
                            <span className="text-gray-500 text-sm">Oct 21, 2024</span>
                        </li>
                    </ul>
                </div>

            </section>

            {/* Footer */}
            <footer>
                <div className="mt-24 text-center border-t border-gray-300 dark:border-gray-700 pt-3 pb-3">
                    <div className="flex justify-center space-x-6">
                        <a
                            href="mailto:rahul@lambdal.com"
                            className="inline-flex items-center text-[15px] text-gray-800 dark:text-gray-400 hover:underline"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        
        </>
    );

}