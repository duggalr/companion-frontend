import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ShimmerButton from "@/components/ui/shimmer-button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import SparklesText from "@/components/ui/sparkles-text";
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faComments, faQuestion, faEnvelope } from "@fortawesome/free-solid-svg-icons";


interface HeroPrimaryProps {
    userAuthenticated: boolean;
}

export default function HeroPrimary({ userAuthenticated }: HeroPrimaryProps): JSX.Element {

    const router = useRouter();

    const handleVisitDashboardClick = () => {
        router.push('/dashboard');
    }
    
    const aboutRef = useRef(null);
    const handleLearnMoreClick = () => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        AOS.init({
          duration: 1000, // Animation duration in milliseconds
          once: true,     // Trigger animation only once
        });
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

                <div className="max-w-5xl mx-auto text-center mt-0 ">

                    <div
                        className="mb-4 w-full lg:w-1/3 mx-auto flex justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        data-aos="fade-in"
                    >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[15px]">
                            <span>✨ 100% Free and Open Source ✨</span>
                        </AnimatedShinyText>
                    </div>
                    
                    <SparklesText text="Learn with an AI Tutor" data-aos="fade-up"/>

                    <p className="text-[20px] text-muted-foreground pt-5 tracking-wide" data-aos="fade-up">
                        Try the AI Tutor in our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/general-tutor">
                            General Chat Interface 
                        </a> or our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/playground">
                            Online Programming Environment
                        </a>. 100% Free.
                    </p>

                    <div className="mt-6 flex items-center justify-center" data-aos="fade-up">

                        {userAuthenticated ? (

                            <ShimmerButton className="shadow-2xl mr-4" onClick={handleVisitDashboardClick}>
                                <span
                                    className="whitespace-pre-wrap text-center text-lg font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10"
                                >
                                    Go to My Dashboard
                                </span>
                            </ShimmerButton>

                        ) : (

                            <ShimmerButton className="shadow-2xl mr-4" onClick={handleLearnMoreClick}>
                                <span
                                    className="whitespace-pre-wrap text-center text-lg font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10"
                                >
                                    Learn More
                                    {/* &nbsp; &#8594; */}
                                </span>
                            </ShimmerButton>

                        )}
                        
                    </div>

                    <p className="text-[13px] text-gray-700 text-muted-foreground pt-2 tracking-normal md:hidden">
                        (The application works best on a computer...)
                    </p>

                    <div className="relative mt-8" >
                        <HeroVideoDialog
                            className="dark:hidden block"
                            animationStyle="from-center"
                            videoSrc="https://www.youtube.com/embed/4Plt_sh_cIg?si=Fya0LnWnhxqi2XQh"
                            thumbnailSrc="https://i.ytimg.com/vi/4Plt_sh_cIg/maxresdefault.jpg"
                            thumbnailAlt="Companion AI Demo"
                        />
                        <HeroVideoDialog
                            className="hidden dark:block"
                            animationStyle="from-center"
                            videoSrc="https://www.youtube.com/embed/4Plt_sh_cIg?si=Fya0LnWnhxqi2XQh"
                            thumbnailSrc="https://i.ytimg.com/vi/4Plt_sh_cIg/maxresdefault.jpg"
                            thumbnailAlt="Companion AI Demo"
                        />
                    </div>

                </div>

            </section>


            {/* About Section */}
            <section
                ref={aboutRef}
                className="min-h-screen flex flex-col items-center py-16 px-6"
            >
                
                <div className="max-w-5xl mx-auto mt-0 text-center">
                    {/* <h2 className="text-center text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                        Learn about Companion
                    </h2> */}

                    <div
                        className="mb-4 w-1/6 mx-auto flex justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        data-aos="fade-down"
                    >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[15px]">
                            <span>💬 Companion</span>
                        </AnimatedShinyText>
                    </div>

                    <SparklesText text="About" className="text-5xl" data-aos="fade-down"/>

                    <div className="mt-8 pb-16 text-center" data-aos="fade-right">
                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            Companion is an AI-powered tutor designed to assist students and individuals by offering guidance and constructive feedback as they solve problems. It is 100% free to use.
                            {/* Companion is an AI Tutor, with the goal of offering students and individuals with help and feedback, as they work through their problems. */}
                            {/* Companion will not provide the student the answer but rather, provide useful hints to help guide their thinking, as they work through the problem. */}
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            Instead of simply providing answers, Companion delivers helpful hints and insights to stimulate critical thinking and enhance learning.
                            {/* Companion will not provide you the answer but rather, provide useful hints to help guide your thinking, as you work through the problem. */}
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            You can engage with the AI Tutor through our traditional <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/general-tutor">chat interface</a> to ask questions and receive guidance.
                            {/* You can access the tutor via our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/general-tutor">
                                Chat Interface</a>, or use our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/playground">online programming environment</a>, to ask questions related to programming and run the code. 100% Free. */}
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            You can also use our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/playground">online programming environment</a> to ask programming-related questions and run code directly within the browser.
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            We are currently hard at work on creating a new Algorithms Course. The AI tutor will directly integrate with the learning material, to hopefully provide a more personalized educational experience.
                            {/* We are currently hard at work, developing a new Algorithms course, which the AI Tutor will be integrated with the material.
                            Feel free to view our <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://github.com/duggalr/companion-frontend">code</a>. */}
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            Companion is <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://github.com/duggalr/companion-frontend">open-source</a>, so feel free explore our code and contribute.
                        </p>

                    </div>


                    {/* <div className='mt-20'></div> */}
                    <div
                        className="mt-8 mb-4 w-1/5 mx-auto flex justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        data-aos="fade-down"
                    >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[15px]">
                            <span>⚙️ More in Development...</span>
                        </AnimatedShinyText>
                    </div>
                    <SparklesText text="Current Features" className="text-5xl" data-aos="fade-down"/>

                    <div
                        className="flex h-[500px] w-full flex-col gap-8 lg:h-[250px] lg:flex-row mt-12 items-center justify-center"
                        data-aos="fade-in"
                    >
                        <a 
                            href="/playground" 
                            className="block w-[300px] h-[250px] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faCode} className="w-10 h-10 pb-2"/>
                            <h3 className='text-xl'>
                                Programming IDE
                            </h3>
                            <p className='text-[15px] text-gray-400 pt-4 text-wrap leading-6'>
                                Run code in our online IDE environment, and get help/feedback from Companion along the way.
                            </p>
                        </a>

                        <a 
                            href="/general-tutor" 
                            className="block w-[300px] h-[250px] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faComments} className="w-9 h-9 pb-2"/>
                            <h3 className='text-xl'>
                                General Tutor
                            </h3>
                            <p className='text-[15px] text-gray-400 pt-4 text-wrap leading-6'>
                                Interact with the tutor in our traditional chat interface.
                            </p>
                        </a>

                        {/* bg-gray-800 */}
                        <a 
                            className="block w-[300px] h-[250px] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faQuestion} className="w-9 h-9 pb-2"/>
                            <h3 className='text-xl'>
                                Next - Algorithms
                            </h3>
                            <p className='text-[15px] text-gray-400 pt-4 text-wrap leading-6'>
                                We are currently developing an algorithms course where the AI tutor will integrate with the course material.
                            </p>
                        </a>
                    </div>

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