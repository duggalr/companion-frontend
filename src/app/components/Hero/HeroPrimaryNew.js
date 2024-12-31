import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import ShinyButton from "@/components/ui/shiny-button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import SparklesText from "@/components/ui/sparkles-text";
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import StandardLink from '@/app/components/ui/StandardLink';
import { saveLandingPageEmailSubmission } from '@/lib/backend_api/saveLandingPageEmailSubmission';
import { getLPEmailSubmissionCount } from '@/lib/backend_api/getLPEmailSubmissionCount';
import { MagicCard } from "@/components/ui/magic-card";
import { getFromLocalStorage } from '@/lib/utils/localStorageUtils';


export default function HeroPrimaryNew() {

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
        console.log('current-theme:', current_theme);
        setCurrentTheme(current_theme);

    }, []);

    return (

        <>

            {/* Landing Hero Section */}
            <section className="min-h-screen flex flex-col items-center py-16 px-4">

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
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[14px]">
                            <span>✨ 100% Free and Open Source ✨</span>
                        </AnimatedShinyText>
                    </div>

                    {/* <SparklesText text="Learn CS Courses with Your Personal AI Tutor" data-aos="fade-up" className="mt-0 tracking-wide"/> */}
                    <SparklesText text="Learn Programming With Your Personal AI Tutor" data-aos="fade-up" className="mt-0 tracking-wide"/>

                    <p className="text-[19px] text-muted-foreground pt-4 tracking-wide leading-9" data-aos="fade-up">
                        Companion is an AI Programming Tutor, providing feedback and guidance on your programming problems and solutions.
                        {/* Take MIT's 6.100L Introduction to Python course on our platform, guided by an AI tutor offering you with real-time help and feedback. */}
                        {/* <br/> */}
                        {/* Go through MIT's 6.100L Introduction to Python course on our platform, with the AI Tutor providing help and support along the way. */}
                        {/* Take MIT's 6.100L Introduction to Python course on our platform, guided by an AI tutor offering you with real-time help and feedback. */}
                    </p>

                    <p className="text-[19px] text-muted-foreground pt-2 tracking-wide leading-9" data-aos="fade-up">
                        We integrated <a 
                            className="text-blue-400 dark:text-blue-400 hover:underline mx-1"
                            href="https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/"
                            target="_blank" rel="noopener noreferrer"
                        >MIT's 6.100L Introduction to Python course</a> with Companion, to help provide you with real-time help and feedback.
                        {/* Try it now, 100% Free!  */}
                        {/* Take MIT's 6.100L Introduction to Python course on our platform, guided by an AI tutor offering you with real-time help and feedback. */}
                    </p>

                    <p
                        onClick={handleLearnMoreClick}
                        ref={aboutRef}
                        className="inline-block text-[14.5px] text-blue-400 pt-4 pb-4 tracking-wide hover:cursor-pointer hover:font-semibold hover:text-gray-800"
                        data-aos="fade-up"
                    >
                        Learn More
                    </p>
                    
                    {/* <br/> */}

                    <div className="mt-2" data-aos="fade-down">

                        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-[15.5px] px-5 py-3 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Try MIT 6.100L - Introduction To Python
                        </button>

                        <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-[15.5px] px-5 py-3 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        Try the Tutor in our Playground REPL
                        </button>

                    </div>

                </div>

                {/* Landing Page Video */}
                <div className="relative mt-10">
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

                    <div className="mt-8 pb-16 text-center" data-aos="fade-right">
                        {/* <p className="text-[19px] text-muted-foreground pt-4 tracking-wide leading-9" data-aos="fade-up"> */}
                        <p className="text-[19px] mb-6 leading-relaxed tracking-wide text-gray-500 dark:text-gray-400">
                            Companion is an AI-powered tutor designed to assist students and
                            individuals by offering guidance and constructive feedback as they
                            solve problems. <span className='font-semibold'>It is 100% free to use.</span>
                        </p>

                        <p className="text-[19px] mb-6 leading-relaxed tracking-wide text-gray-500 dark:text-gray-400">
                            Instead of simply providing answers, Companion delivers helpful hints
                            and insights to stimulate critical thinking and enhance learning.
                        </p>
                    </div>


                    {/* What We Currently Offer Section */}
                    
                    <h1
                        class="mb-10 text-3xl font-bold leading-none tracking- text-gray-900 dark:text-white"
                        data-aos="fade-up"
                    >Currently we offer:</h1>

                    {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-up">
                        
                        <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-neutral-800 transition-transform transform hover:scale-105">
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Introduction to Python (MIT Course)
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                            Learn Python through an engaging MIT course, supported by our AI tutor
                            for real-time guidance and feedback, helping you grasp key concepts
                            effectively.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-neutral-800 transition-transform transform hover:scale-105">
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Online Playground Environment
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                            Experiment with code in our interactive online playground, ask your
                            own questions, and get instant help from our AI-powered system.
                            </p>
                        </div>
                    </div> */}

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
                            Learn Python with an AI
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 text-[17px] pt-6">
                            Take MIT's engaging 6.100L Introduction to Python course,
                            <br/>
                            with our AI tutor providing real-time guidance and feedback.
                            </p>

                            {/* <button
                                type="button"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
                            > */}
                            <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                Watch a Demo
                            </button>
                            
                            <button
                                type="button"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
                            >
                            {/* <button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"> */}
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

                            {/* <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Watch a Demo</button> */}

                            <button type="button"
                            class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            >Watch a Demo</button>

                            <button
                                type="button"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
                            >Go to Playground</button>

                        </MagicCard>
                    </div>


                </div>

            </section>


            {/* Blog Section */}

            {/* TODO: start here */}
            <section
                ref={aboutRef}
                className="min-h-screen flex flex-col items-center py-16 px-6"
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

                {/* <div className="mt-10 w-3/4" data-aos="fade-up">
                    <ul className="space-y-4">

                        <li className="flex justify-between items-center border-b pb-4 text-[17px]">
                            <StandardLink 
                                uri="https://medium.com/@drahul2820/companion-update-upcoming-mit-course-release-47bd9714b0a4"
                                text="📰 Companion: Update and Upcoming MIT Course Release"
                                new_tab={true}
                            />
                            <span className="text-gray-500 text-sm">Dec 16, 2024</span>
                        </li>

                        <li className="flex justify-between items-center border-b pb-2 pt-2 text-[17px]">
                            <StandardLink 
                                uri="https://medium.com/@drahul2820/introducing-companion-an-online-repl-with-an-ai-tutor-85c564fae398"
                                text="📰 Companion: Initial MVP Launch"
                                new_tab={true}
                            />
                            <span className="text-gray-500 text-sm">Oct 21, 2024</span>
                        </li>

                    </ul>
                </div> */}

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