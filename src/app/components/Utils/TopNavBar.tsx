import ThemeToggle from './ThemeToggle';
import { Pacifico } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faSquareCaretRight, faUserPlus, faLaptopCode, faCode, faHome } from "@fortawesome/free-solid-svg-icons";
import useUserContext from '../../../lib/hooks/useUserContext';


const pacifico_font = Pacifico({
    subsets: ['latin'],
    weight: ['400']
});


export default function TopNavBar ({ }) {

    const {isAuthenticated} = useUserContext();

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

                {/* Dashboard */}
                {isAuthenticated && (
                    <li>
                        <a
                            href="/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                        >
                            <FontAwesomeIcon icon={faSquareCaretRight} className="text-black pr-2 dark:text-white w-4 h-4" />
                            Dashboard
                        </a>
                    </li>
                )}

                <li>
                    <a
                    href="/"
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                    >
                        <FontAwesomeIcon icon={faHome} className="text-gray-700 pr-2 dark:text-white w-4 h-4" />
                        Home
                    </a>
                </li>

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
                {/* <li>
                    <a
                    href="/general-tutor"
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                    >
                        <FontAwesomeIcon icon={faLaptopCode} className="text-gray-700 pr-2 dark:text-white w-4 h-4" />
                        General Tutor
                    </a>
                </li> */}

                {/* If user is authenticated, show Dashboard and Logout */}
                {/* {isAuthenticated ? (
                    <>
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
                )} */}

                <ThemeToggle />

            </div>

        </ul>

    );

}