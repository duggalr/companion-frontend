import { useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Pacifico } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faSquareCaretRight, faUserPlus, faLaptopCode, faCode } from "@fortawesome/free-solid-svg-icons";


const pacifico_font = Pacifico({
    subsets: ['latin'],
    weight: ['400']
});


export default function TopNavBar ({ userAuthenticated }) {

    useEffect(() => {}, []);

    return (

        <ul
            className="flex text-sm font-medium text-center border-b-2 border-gray-300 bg-[#F3F4F6] dark:bg-gray-900 dark:text-gray-300"
        >
            <li>
                <a
                href={`${process.env.NEXT_PUBLIC_ROOT_URL}`}
                className={`${pacifico_font.className} scroll-m-20 text-[18px] mt-1 ml-3 tracking-widest flex items-center text-zinc-900 dark:text-gray-300`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="h-8 w-8 pr-2 fill-zinc-900 dark:fill-white">
                        <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/>
                    </svg>
                    Companion
                </a>
            </li>

            <div className="ml-auto lg:flex items-center space-x-8 hidden">

                {/* Authenticated Links */}
                {/* {userAuthenticated && (
                    <li>
                        <a
                            href="/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-2"
                        >
                            <FontAwesomeIcon icon={faSquareCaretRight} className="text-black pr-2 dark:text-white w-4 h-4" />
                            dashboard
                        </a>
                    </li>
                )}

                {userAuthenticated && (
                    <li>
                        <a
                            href="/api/auth/logout"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-2"
                        >
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-black pr-2 dark:text-white w-4 h-4" />
                            logout
                        </a>
                    </li>
                )} */}


                {/* Dashboard */}
                {userAuthenticated && (
                    <li>
                        <a
                            href="/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-2"
                        >
                            <FontAwesomeIcon icon={faSquareCaretRight} className="text-black pr-2 dark:text-white w-4 h-4" />
                            Dashboard
                        </a>
                    </li>
                )}
                
                {/* Playground */}
                <li>
                    <a
                    href="/playground"
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                    >
                        <FontAwesomeIcon icon={faCode} className="text-gray-700 pr-2 dark:text-white w-4 h-4" />
                        Playground
                    </a>
                </li>

                {/* General Tutor */}
                <li>
                    <a
                    href="/general-tutor"
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                    >
                        <FontAwesomeIcon icon={faLaptopCode} className="text-gray-700 pr-2 dark:text-white w-4 h-4" />
                        General Tutor
                    </a>
                </li>


                {/* If user is authenticated, show Dashboard and Logout */}
                {userAuthenticated ? (
                    <>
                        {/* <li>
                            <a
                            href="/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-2"
                            >
                                <FontAwesomeIcon icon={faSquareCaretRight} className="text-black pr-2 dark:text-white w-4 h-4" />
                                Dashboard
                            </a>
                        </li> */}
                        <li>
                            <a
                            href="/api/auth/logout"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                            >
                                <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-black pr-2 dark:text-white w-4 h-4" />
                                Logout
                            </a>
                        </li>
                    </>
                ) : (
                    // If user is not authenticated, show Sign Up and Login
                    <>
                        <li>
                            <a
                            href="/api/auth/login"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                            >
                                <FontAwesomeIcon icon={faUserPlus} className="text-gray-700 pr-2 dark:text-white w-4 h-4" />
                                Signup or Login
                            </a>
                        </li>
                    </>
                )}

                {/* <a
                    href="https://www.youtube.com/watch?v=4Plt_sh_cIg&ab_channel=Rahul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20">
                        <polygon points="40,30 70,50 40,70" fill="currentColor" />
                    </svg>
                    video walkthrough
                </a>

                <a
                    href="https://github.com/duggalr/companion-frontend"
                    // className="p-2.5 pr-4 text-black font-normal dark:text-gray-300 text-[14px]"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" className="mr-1 fill-zinc-900 dark:fill-white">
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                    </svg>
                    github
                </a> */}

                <ThemeToggle />
            </div>

        </ul>

    );

}