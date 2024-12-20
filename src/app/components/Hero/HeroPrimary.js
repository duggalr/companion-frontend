import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import SparklesText from "@/components/ui/sparkles-text";
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import StandardLink from '@/app/components/ui/StandardLink';
import { saveLandingPageEmailSubmission } from '@/lib/backend_api/saveLandingPageEmailSubmission';
import { getLPEmailSubmissionCount } from '@/lib/backend_api/getLPEmailSubmissionCount';


// interface HeroPrimaryProps {
//     userAuthenticated: boolean;
// }
// { userAuthenticated }: HeroPrimaryProps
// : JSX.Element 

export default function HeroPrimary() {

    // const router = useRouter();
    const aboutRef = useRef(null);
    const currentLandingEmailRef = useRef("");
    const [currentLandingSaved, setCurrentLandingSaved] = useState(false);
    
    // React.ChangeEvent<HTMLInputElement>
    const _handleLandingEmailChange = (e) => {
        currentLandingEmailRef.current = e.target.value;
    }

    // const handleLearnMoreClick = () => {
    //     aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    // };

    const handleLearnMoreClick = () => {
        aboutRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start', // Optional, default is 'start'
            inline: 'nearest', // Optional, default is 'nearest'
        });
    };

    const _handleLPFormSubmit = async (e) => {
        e.preventDefault();

        const user_email = currentLandingEmailRef.current;
        await saveLandingPageEmailSubmission(user_email);

        setCurrentLandingSaved(true);
        _getEmailSubCount();

    }
    
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });
    }, []);

    
    const [emailSubmissionCount, setEmailSubmissionCount] = useState(null);

    const _getEmailSubCount = async () => {
        const total_count_response = await getLPEmailSubmissionCount();

        if (total_count_response['success'] == true){
            setEmailSubmissionCount(total_count_response['number_of_email_submissions']);
        }
    }

    useEffect(() => {
        _getEmailSubCount();
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

                    <p className="text-[19px] text-muted-foreground pt-4 tracking-wide" data-aos="fade-up">
                        Our first free programming course that will be offered here with the AI Tutor, will be the popular <StandardLink uri="https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/" text="MIT 6.100L Introduction to Python" new_tab={true}/>.
                    </p>

                    <p
                        onClick={handleLearnMoreClick}
                        ref={aboutRef}
                        className="inline-block text-[12.5px] text-blue-400 dark:text-blue-400 pt-2 tracking-wide hover:cursor-pointer hover:underline"
                        data-aos="fade-up"
                    >
                        Learn More
                    </p>

                    <div className="flex justify-center mt-8 mb-1" data-aos="fade-up">
                        {currentLandingSaved ? (
                            <div className="bg-green-600 dark:bg-green-700 text-gray-100 px-4 py-1.5 rounded-md shadow-lg transition-opacity duration-300 text-[15.5px] z-50">
                                🎉 Email saved successfully. You will be notified when the course is complete very soon. Thank you! 🎉
                            </div>
                        ) : (
                            <div className="flex items-center w-11/12 max-w-3xl lg:w-1/2">
                                <form 
                                    onSubmit={_handleLPFormSubmit} 
                                    className="flex flex-col lg:flex-row items-center w-full lg:space-x-3 space-y-3 lg:space-y-0"
                                >
                                    <Input
                                        onChange={(e) => _handleLandingEmailChange(e)}
                                        type="email"
                                        placeholder="Enter your email"
                                        className="h-12 w-full lg:flex-grow rounded-lg px-4 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-500"
                                        required
                                    />
                                    <Button
                                        className="h-12 w-full lg:w-auto rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700 transition-all"
                                        type="submit"
                                    >
                                        Get notified when the course is live!
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>

                    <span className="text-[13px] text-gray-400" data-aos="fade-up">
                        {/* TODO:  */}

                        {emailSubmissionCount !== null ? (
                            `${emailSubmissionCount} people have signed up already!`
                        ): null}
                    </span>

                    <div className="pt-2 text-gray-800 dark:text-gray-400 text-center" data-aos="fade-down">
                        <hr className="my-4 w-1/2 mx-auto border-gray-300 dark:border-gray-700" />
                        <p className="text-[15px] pt-1">
                            {/* In the meantime, feel free to try our AI Tutor on your own programming problems, in our */}
                            Meanwhile, feel free to try our AI Tutor on your own programming problems, in our
                            {/* <a 
                                className="text-blue-600 dark:text-blue-500 hover:underline mx-1" 
                                href=""
                            >
                                Python Online IDE / REPL Environment
                            </a>. */}
                            {" "}
                            <StandardLink 
                                uri="/playground"
                                text="Online Python IDE / REPL Environment"
                                new_tab={false}
                            />.
                        </p>
                    </div>

                    <p className="text-[13px] text-gray-700 text-muted-foreground pt-2 tracking-normal md:hidden">
                        (The application works best on a computer...)
                    </p>

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

                </div>

            </section>


            {/* About Section */}
            <section
                ref={aboutRef}
                className="min-h-screen flex flex-col items-center py-16 px-6"
            >
                
                <div className="max-w-5xl mx-auto mt-0 text-center">

                    <div
                        className="hidden md:flex mb-4 w-1/6 mx-auto justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
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
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            Instead of simply providing answers, Companion delivers helpful hints and insights to stimulate critical thinking and enhance learning.
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            You can currently engage with the AI Tutor in our 
                            {/* <a className="text-blue-600 dark:text-blue-400 hover:underline" href="/playground">online programming environment</a>,  */}
                            {" "}
                            <StandardLink 
                                uri="/playground"
                                text="online programming environment"
                                new_tab={false}
                            />,
                            where you can ask programming-related questions and run code directly within the browser.
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            {/* We are currently hard at work, integrating 
                            <a target="_blank" rel="noopener 
                        noreferrer" className="text-blue-600 dark:text-blue-500 hover:underline" href="https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/">MIT's 6.100L Introduction to Python</a> material in our platform. */}

                            We are currently hard at work, integrating {" "}
                            <StandardLink 
                                uri="https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/"
                                text="MIT's 6.100L Introduction to Python"
                                new_tab={true}
                            /> material in our platform. Enter your email above to stay up-to-date on the launch!

                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            The goal is to hopefully allow students to gain a deeper understanding of the material than they otherwise can, by leveraging the AI tutor as they learn the concepts and work through the exercises.
                        </p>

                        <p className="text-xl mb-6 leading-relaxed text-gray-500 dark:text-gray-400">
                            Companion is {" "}
                            <StandardLink 
                                uri="https://github.com/duggalr/companion-frontend"
                                text="open-source"
                                new_tab={true}
                            />, so feel free explore our code and contribute.
                            {/* <a className="text-blue-600 dark:text-blue-400 hover:underline" href="https://github.com/duggalr/companion-frontend">open-source</a> */}
                        </p>

                    </div>

                    
                    {/* Blog Section */}
                    {/* <div
                        className="mt-8 mb-4 w-1/6 mx-auto flex justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        data-aos="fade-down"
                    >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[14px]">
                            <span>📖 Learn More</span>
                        </AnimatedShinyText>
                    </div> */}

                    <div
                        className="hidden md:flex mb-4 w-1/6 mx-auto justify-center items-center group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        data-aos="fade-down"
                    >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-0 py-0 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 text-[15px]">
                            <span>📖 Learn More</span>
                        </AnimatedShinyText>
                    </div>

                    <SparklesText text="Blog Posts" className="text-5xl" data-aos="fade-down"/>

                    {/* Blog Post List */}
                    <div className="mt-10" data-aos="fade-up">
                        <ul className="space-y-4">

                            {/* Blog Post 1 */}
                            <li className="flex justify-between items-center border-b pb-4 text-[17px]">
                                <StandardLink 
                                    uri="https://medium.com/@drahul2820/companion-update-upcoming-mit-course-release-47bd9714b0a4"
                                    text="📰 Companion: Update and Upcoming MIT Course Release"
                                    new_tab={true}
                                />
                                <span className="text-gray-500 text-sm">Dec 16, 2024</span>
                            </li>

                            {/* Blog Post 2 */}
                            <li className="flex justify-between items-center border-b pb-2 pt-2 text-[17px]">
                                <StandardLink 
                                    uri="https://medium.com/@drahul2820/introducing-companion-an-online-repl-with-an-ai-tutor-85c564fae398"
                                    text="📰 Companion: Initial MVP Launch"
                                    new_tab={true}
                                />
                                <span className="text-gray-500 text-sm">Oct 21, 2024</span>
                            </li>

                        </ul>
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