"use client";
import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { Pacifico } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretRight, faCode, faBook, faHome, faArrowRightFromBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
// import useUserContext from '../../../lib/hooks/useUserContext';
import useUserContext from '@/lib/hooks/useUserContext';
import { fetchCourseProgress } from '@/lib/backend_api/fetchCourseProgress';


const pacifico_font = Pacifico({
    subsets: ['latin'],
    weight: ['400']
});

export default function TopNavBar ({ }) {

    const {isAuthenticated} = useUserContext();

    const [ showLoginSpan, setShowLoginSpan ] = useState(null);

    const [ courseProgress, setCourseProgress ] = useState({});

    const _handleLectureProgressFetch = async () => {
        
        // TODO: fetch number of completed and not completed --> show progress in navbar

        let fetchProgressResponse = await fetchCourseProgress();
        console.log('fetchProgressResponse:', fetchProgressResponse);
        setCourseProgress(fetchProgressResponse);

    }

    useEffect(() => {

        // TODO:
        if (!isAuthenticated){

            const url_search_params = new URLSearchParams(window.location.search);
            const lesson_question_object_id = url_search_params.get('lesson_quid');
            console.log('lesson-quid:', lesson_question_object_id);

            if (lesson_question_object_id){
                setShowLoginSpan(2);
            } else {
                setShowLoginSpan(1);
            }

        } else {

            _handleLectureProgressFetch();

        }

    }, [isAuthenticated]);

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

            <div className="ml-auto lg:flex items-center space-x-4 hidden">

                {/* {(!isAuthenticated) && ( */}
                {showLoginSpan === 2 ? (

                    <div className="text-right pt-0 mt-0 font-normal">
                        {/* <span className="text-[11.5px] pt-0 mt-0 text-gray-500 dark:text-gray-500">
                            Make a {" "}
                            <a
                                className='text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                                href="/api/auth/login"
                            >
                                free account
                            </a> to work on the lecture exercises!
                        </span>
                        <span className='pl-2'>|</span> */}
                    </div>

                ) : showLoginSpan === 1 ? (

                    <div className="text-right pt-0 mt-0 font-normal">
                        <span className="text-[11.5px] pt-0 mt-0 text-gray-500 dark:text-gray-500">
                            Make a {" "}
                            <a
                                className='text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                                href="/api/auth/login"
                            >
                                free account
                            </a> to work on and save different questions
                        </span>
                        <span className='pl-2'>|</span>
                    </div>

                ) : (

                    <div></div>

                )}

                {isAuthenticated ? (
                    <div className="flex items-center space-x-4">

                        <div className="relative w-8 h-8">
                            <div
                            className="absolute inset-0 rounded-full border-2 border-gray-200"
                            style={{
                                background: `conic-gradient(#4ade80 ${courseProgress.percent_complete}%, transparent ${courseProgress.percent_complete}%)`,
                            }}
                            ></div>
                            <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-transparent">
                                <span className="text-xs font-semibold text-black pl-1">
                                    {courseProgress.percent_complete}%
                                </span>
                            </div>
                        </div>

                        <div className="text-[13.5px] font-normal text-gray-600">
                            <p>Lectures Remaining: {courseProgress.remaining} / {courseProgress.total}</p>
                        </div>
                        <span className="text-gray-500">|</span>
                    </div>
                ) : (
                    <span></span>
                )}
                

                {/* Dashboard */}
                {isAuthenticated ? (
                    <li>
                        <a
                            href="/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                        >
                            <FontAwesomeIcon icon={faSquareCaretRight} className="text-black pr-2 dark:text-white w-4 h-4" />
                            Dashboard
                        </a>
                    </li>
                ): (
                    <li>
                        <a
                            href="/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 text-[13px] space-x-0 pr-0"
                        >
                            <FontAwesomeIcon icon={faSquareCaretRight} className="text-gray-700 pr-2 dark:text-white w-4 h-4" />
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
                {isAuthenticated ? (
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
                )}

                <ThemeToggle />

            </div>

        </ul>

    );

}