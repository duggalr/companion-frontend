import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";


export default function LectureHomePage({ lecture_number, lectureData, lectureExerciseData, problemSetData }) {

    const MIN_LECTURE_NUMBER = 1;
    const MAX_LECTURE_NUMBER = 20;
    const [activeTab, setActiveTab] = useState('lecture_video');

    return (

        <div className="min-h-screen flex justify-center pt-4 bg-[#f4f5f6] dark:bg-gray-900">

            <div className="absolute left-0 pl-[265px]">
                <a
                    className="cursor-pointer font-normal text-blue-600 dark:text-blue-400 hover:underline text-[14px]"
                    href='/dashboard'
                >
                    Home
                </a>
            </div>

            {lecture_number > MIN_LECTURE_NUMBER && (
                <div className="absolute right-28 pr-[265px]">
                    <a
                        className="cursor-pointer font-normal text-blue-600 dark:text-blue-400 hover:underline text-[14px]"
                        href={`/course/introduction-to-programming/${parseInt(lecture_number)-1}`}
                    >
                        {"<- "}Previous Lecture
                    </a>
                </div>
            )}

            {lecture_number < MAX_LECTURE_NUMBER && (
                <div className="absolute right-0 text-right pr-[265px]">
                    <a
                        className="cursor-pointer font-normal text-blue-600 dark:text-blue-400 hover:underline text-[14px]"
                        href={`/course/introduction-to-programming/${parseInt(lecture_number)+1}`}
                    >
                        Next Lecture{" ->"}
                    </a>
                </div>
            )}

            <div className="w-full max-w-4xl pt-2">

                <div className="space-y-4 pt-8">
                    <h1 className="text-3xl font-bold">
                        Lecture {lectureData.number}: { lectureData.name }
                    </h1>
                    <p className="text-gray-500">
                        {lectureData.description}
                    </p>
                </div>

                <div className="flex border-b border-gray-700 mt-6">

                    <span
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${
                            activeTab === 'lecture_video'
                            ? "text-blue-500 border-blue-500"
                            : "border-transparent hover:text-blue-400"
                        } focus:outline-none cursor-pointer`}
                        onClick={() => setActiveTab('lecture_video')}
                    >
                        <FontAwesomeIcon icon={faVideo} className="pr-2" />
                        Lecture Video
                    </span>

                    <span
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${
                            activeTab === 'note_exercise'
                            ? "text-blue-500 border-blue-500"
                            : "border-transparent hover:text-blue-400"
                        } focus:outline-none cursor-pointer`}
                        onClick={() => setActiveTab('note_exercise')}
                    >
                        <FontAwesomeIcon icon={faNoteSticky} className="pr-2" />
                        Notes & Exercises
                    </span>

                </div>

                {
                    activeTab == 'lecture_video' && (
                        <div 
                            className="relative mt-4"
                        >
                            <HeroVideoDialog
                                className="dark:hidden block"
                                animationStyle="from-center"                                
                                videoSrc={lectureData.embed_video_url}
                                thumbnailSrc={lectureData.thumbnail_image_url}
                            />
                            <HeroVideoDialog
                                className="hidden dark:block"
                                animationStyle="from-center"
                                videoSrc={lectureData.embed_video_url}
                                thumbnailSrc={lectureData.thumbnail_image_url}
                            />
                        </div>
                    )
                }

                {
                    activeTab == 'note_exercise' && (

                        <div className='mt-4'>

                            <h1
                                className="text-lg font-semibold mb-4"
                            >
                                Notes
                            </h1>

                            <ul className="space-y-2 pl-4">

                                <li className="text-[15px] list-disc">
                                    <a
                                        href={lectureData.notes_url}
                                        className='font-normal text-blue-600 dark:text-blue-500 hover:underline'
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lecture Notes
                                    </a>
                                </li>

                                <li className="text-[15px] list-disc">
                                    <a
                                        href={lectureData.code_url}
                                        className='font-normal text-blue-600 dark:text-blue-500 hover:underline'
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Lecture Code
                                    </a>
                                </li>

                            </ul>

                            <h1
                                className="text-lg font-semibold mb-4 mt-6"
                            >
                                Lecture Exercises
                            </h1>

                            <ul className="space-y-4 pl-4">
                                
                                {lectureExerciseData.map((item) => (
                                    <li className="text-[15px] list-disc" key={item.id}>
                                         <a
                                            href={`/playground?lesson_quid=${item.id}`}
                                            className='font-normal text-blue-600 dark:text-blue-500 hover:underline'
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}

                                {problemSetData && (

                                    <li className="text-[15px] list-disc" key={problemSetData.id}>
                                        <a
                                        href={problemSetData.implementation_in_progress ? null : `/playground?psid=${problemSetData.id}`}
                                        className={`font-normal ${problemSetData.implementation_in_progress ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 dark:text-blue-500 hover:underline'}`}
                                        >
                                        {problemSetData.ps_name}
                                        </a>
                                    </li>

                                )}
                            </ul>

                        </div>

                    )
                }

            </div>

        </div>

   );

}