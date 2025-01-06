import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";


export default function LectureHomePage({ lecture_number, lectureData, lectureExerciseData, problemSetData }) {

    const MIN_LECTURE_NUMBER = 1;
    const MAX_LECTURE_NUMBER = 20;

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('lecture_video');

    // const [isLoading, setIsLoading] = useState(true);

    // const handleGoBack = () => {

    //     if (window.history?.length && window.history.length > 1) {
    //         router.back();
    //     } else {
    //         router.replace("/");
    //     }

    // };

    // TODO:
    const handleGoBack = () => {
        if (lecture_number > MIN_LECTURE_NUMBER) {
            router.push(`?page=${lecture_number - 1}`);
        }
    };

    const handleGoNext = () => {
        if (lecture_number <= MAX_LECTURE_NUMBER) {
            router.push(`?page=${lecture_number + 1}`);
        }
    };


    // // TODO:
    //     // Display lecture data here

    // let [lectureData, setLectureData] = useState(null);

    // const _handleLectureDataFetch = async () => {

    //     let lecture_data_res = await fetchLectureData(lecture_number);
    //     console.log('lecture_data:', lecture_data_res);

    //     // TODO: set and display
    //     if (lecture_data_res['success'] === true){

    //         let lect_data = lecture_data_res['lecture_data'];
    //         console.log('lect_data', lect_data);
    //         setLectureData(lect_data);

    //     }

    // }

    // useEffect(() => {
    
    //     if (accessToken) {
    //         _handleLectureDataFetch();
    //     }

    // }, [accessToken, userAuthenticated]);

    return (

        // <div className="flex flex-col max-5xl">
        //     <div className="min-w-4xl max-w-4xl relative">

        <div className="min-h-screen flex justify-center pt-4 bg-[#f4f5f6] dark:bg-gray-900">

            {/* <div className="absolute left-0 pl-[265px]">
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        // handleGoBack();
                    }}
                    className="cursor-pointer font-normal text-blue-600 dark:text-blue-400 hover:underline text-[14px]"
                >
                {"<- "}Back
                </a>
            </div>

            <div className="absolute right-0 text-right pr-[265px]">
                <a
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    className="cursor-pointer font-normal text-blue-600 dark:text-blue-400 hover:underline text-[14px]"
                >
                Next{" ->"}
                </a>
            </div> */}


            {/* {lecture_number == 1 && ( */}
            <div className="absolute left-0 pl-[265px]">
                <a
                    className="cursor-pointer font-normal text-blue-600 dark:text-blue-400 hover:underline text-[14px]"
                    href='/dashboard'
                >
                    Home
                </a>
            </div>
            {/* )} */}

            {lecture_number > MIN_LECTURE_NUMBER && (
                <div className="absolute right-28 pr-[265px]">
                    <a
                        // onClick={(e) => {
                        //     e.preventDefault();
                        //     handleGoBack();
                        // }}
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
                        // onClick={(e) => {
                        //     e.preventDefault();
                        //     handleGoNext();
                        // }}
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
                        {/* Introduction to Python: knowledge, machines, objects, types, variables, bindings, IDEs */}
                        {lectureData.description}
                    </p>
                </div>

                <div className="flex border-b border-gray-700 mt-6">

                    <span
                        // className="cursor-pointer hover:text-blue-700"
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
                        // className="cursor-pointer hover:text-blue-700 ml-6"
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
                                // videoSrc="https://www.youtube.com/embed/xAcTmDO6NTI"
                                // thumbnailSrc="https://i.ytimg.com/vi/xAcTmDO6NTI/maxresdefault.jpg"
                            />
                            <HeroVideoDialog
                                className="hidden dark:block"
                                animationStyle="from-center"
                                videoSrc={lectureData.embed_video_url}
                                thumbnailSrc={lectureData.thumbnail_image_url}
                                // videoSrc="https://www.youtube.com/embed/xAcTmDO6NTI"
                                // thumbnailSrc="https://i.ytimg.com/vi/xAcTmDO6NTI/maxresdefault.jpg"
                                // thumbnailAlt="Companion AI Demo"
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
                                            // href="/playground?lesson_quid=6c6d35ab-b8a1-4b9f-89be-2d85cd7a05fa"  // --> then, fetch/create question in backend --> pushURLState to created question
                                            href={`/playground?lesson_quid=${item.id}`}
                                            className='font-normal text-blue-600 dark:text-blue-500 hover:underline'
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}

                                {/* <li className="text-[15px] list-disc">
                                    <a
                                        // href="/playground?lesson_quid=6c6d35ab-b8a1-4b9f-89be-2d85cd7a05fa"  // --> then, fetch/create question in backend --> pushURLState to created question
                                        href={`/playground?lesson_quid=${lectureExerciseData.id}`}
                                        className='font-normal text-blue-600 dark:text-blue-500 hover:underline'
                                    >                                        
                                        {lectureExerciseData}
                                    </a>
                                </li> */}

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









        // <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-8">
        //     <div className="max-w-4xl mx-auto space-y-8">
        //         <a
        //             href="#"
        //             className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        //         >
        //             Back
        //         </a>

        //         <div className="space-y-4">
        //             <h1 className="text-3xl font-bold">
        //                 Lecture {lecture_number} - Introduction to Programming
        //             </h1>
        //             <p className="text-gray-700 dark:text-gray-300">
        //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        //                 ac vestibulum lorem. Proin vel nisi eget leo auctor aliquet.
        //             </p>
        //         </div>

        //         <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
        //             <iframe
        //                 className="w-full h-full"
        //                 src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        //                 title="Lecture Video"
        //                 frameBorder="0"
        //                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        //                 allowFullScreen
        //             ></iframe>
        //         </div>

        //         <div className="space-y-4">
        //             <h2 className="text-2xl font-semibold">Exercises</h2>
        //             <ul className="space-y-2">
        //                 <li className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        //                     <h3 className="font-bold">Exercise 1: Write Your First Program</h3>
        //                     <p className="text-gray-700 dark:text-gray-300">
        //                         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        //                         egestas nisi sit amet libero porttitor fermentum.
        //                     </p>
        //                 </li>
        //                 <li className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        //                     <h3 className="font-bold">Exercise 2: Debugging Basics</h3>
        //                     <p className="text-gray-700 dark:text-gray-300">
        //                         Proin auctor turpis sit amet ligula tincidunt, et gravida nisi
        //                         feugiat.
        //                     </p>
        //                 </li>
        //             </ul>
        //         </div>
        //     </div>
        // </div>


    );

}