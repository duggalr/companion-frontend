import React, { useState } from "react";
import { Pacifico } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faUserPlus, faArrowRightFromBracket, faSquareCaretRight } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "@/app/components/Utils/ThemeToggle";


const pacifico_font = Pacifico({
    subsets: ['latin'],
    weight: ['400']
});

// interface HeroNavBarProps {
//     userAuthenticated: boolean;
//     // pageLoading: boolean;
// }
// { userAuthenticated }: HeroNavBarProps

// export default function HeroNavBar({ userAuthenticated }: boolean): JSX.Element {
export default function HeroNavBar({ userAuthenticated }){

    const DISCORD_CHANNEL_URL = process.env.NEXT_PUBLIC_DISCORD_CHAT_URL;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (

        <nav className="bg-white border-gray-200 dark:bg-zinc-950">
            
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                <h1 className={`${pacifico_font.className} scroll-m-20 text-[26px] font-normal tracking-widest flex items-center text-zinc-900 dark:text-gray-200`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-8 h-8 pr-2 fill-zinc-900 dark:fill-white">
                        <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/>
                    </svg>
                    Companion
                </h1>

                {/* <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button> */}

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>


                {/* <div className="hidden w-full md:block md:w-auto" id="navbar-default"> */}
                <div className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
                    
                    {/* <ul 
                        className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 
                        rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-zinc-950 md:dark:bg-zinc-950"
                        // dark:border-gray-700
                    > */}
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-zinc-950 md:dark:bg-zinc-950">

                        {/* Dashboard */}
                        {(userAuthenticated) ? (

                            <li>
                                <a
                                    href="/dashboard"
                                    className="flex py-3 items-center text-gray-800 hover:text-gray-600 dark:text-gray-300 hover:dark:text-gray-400 rounded text-[14.5px] hover mr-2 font-normal"
                                >
                                    <FontAwesomeIcon icon={faSquareCaretRight} className="text-black pr-2 dark:text-white w-4 h-4" />
                                    Dashboard
                                </a>
                            </li>

                        ) : (

                            <li>
                                <a
                                    href="/playground"
                                    className="flex py-3 items-center text-gray-800 hover:text-gray-600 dark:text-gray-300 hover:dark:text-gray-400 rounded text-[14.5px] font-normal"
                                >
                                    <FontAwesomeIcon
                                        icon={faCode}
                                        className="mr-2"
                                    />{" "} Playground
                                </a>
                            </li>

                        )}

                        {/* Login */}
                        {(!userAuthenticated) ? (
                            <li>
                                <a
                                    href="/api/auth/login"
                                    className="flex py-3 items-center text-gray-800 hover:text-gray-600 dark:text-gray-300 hover:dark:text-gray-400 rounded text-[14.5px] hover mr-0 font-normal"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} className="text-black pr-2 dark:text-white w-4 h-4" />
                                    Signup or Login
                                </a>
                            </li>
                        ) : (
                            <li>
                                <a
                                    href="/api/auth/logout"
                                    className="flex py-3 items-center text-gray-800 hover:text-gray-600 dark:text-gray-300 hover:dark:text-gray-400 rounded text-[14.5px] hover mr-0 font-normal"
                                >
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-black pr-2 dark:text-white w-4 h-4" />
                                    Logout
                                </a>
                            </li>
                        )}

                        <li>
                            {/* <a
                                href="/api/auth/login"
                                className="flex py-3 items-center text-gray-800 hover:text-gray-600 dark:text-gray-300 hover:dark:text-gray-400 rounded text-[14.5px] mr-0 font-normal"
                            > */}
                                {/* | */}
                            {/* </a> */}
                            <span className="flex py-3 items-center">
                                |
                            </span>
                        </li>

                        <li>
                            <a
                                href={DISCORD_CHANNEL_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex py-3 items-center text-gray-800 hover:text-gray-600 dark:text-gray-300 hover:dark:text-gray-400 rounded text-[14.5px] font-normal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-discord mr-2" viewBox="0 0 16 16">
                                    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                                </svg>
                                Discord
                            </a>
                        </li>

                        <li>
                            <a
                                href="https://github.com/duggalr/companion-frontend"
                                // className="flex py-3 text-gray-900 rounded text-sm hover:text-gray-600"
                                className="flex py-3 items-center text-gray-800 hover:text-gray-600 dark:text-gray-300 hover:dark:text-gray-400 rounded text-[14.5px] hover mr-2 font-normal"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" className="mr-1 fill-zinc-900 dark:fill-white">
                                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                                </svg>
                                Github
                            </a>
                        </li>

                        <li className="md:flex items-center text-[17px] sm:block hidden">
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );

}