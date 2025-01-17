import React, { useState, useRef, useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';
import DashboardTopNavBar from "@/app/components/Experimental/DashboardTopNavBar";
import { Progress } from "@/components/ui/progress";


const CourseHomeLayout = () => {

    const [showSubModules, setShowSubModules] = useState(false);
    const [showSubModulesIDList, setShowSubModulesIDList] = useState([]);

    const addToModuleIdList = (index) => {

        setShowSubModulesIDList(prevState => {
            if (!prevState.includes(index)) {
                return [...prevState, index];
            }
            return prevState;
        });
    };

    const removeFromModuleIdList = (index) => {
        setShowSubModulesIDList(prevState => {
            return prevState.filter(item => item !== index);
        });
    };


    const [courseMetaData, setCourseMetaData] = useState({});
    const [courseCompletedModuleList, setCourseCompletedModuleList] = useState([]);
    const [isCourseGenerating, setIsCourseGenerating] = useState(false);
    const [courseGenerationProgress, setCourseGenerationProgress] = useState(null);

    const _handleUserCourseModuleFetch = async () => {

        let anon_user_id = getFromLocalStorage('user_id');
        const payload = {'user_id': anon_user_id};

        const apiResponse = await fetch(`http://127.0.0.1:8000/fetch_user_course_details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const response_data = await apiResponse.json();
        console.log('Response Data:', response_data);        

        if (response_data['success'] === true){
            let user_course_rv_dict = response_data['user_course_object'];
            let is_course_generating = user_course_rv_dict['is_course_generating'];

            // TODO: first update the course module state and then update the is-generating stuff

            setCourseMetaData({
                "course_name": user_course_rv_dict['course_name'],
                "course_description": user_course_rv_dict['course_description'],
                "is_course_generating": user_course_rv_dict['is_course_generating']
            });

            setCourseCompletedModuleList(user_course_rv_dict['current_course_module_list']);

            if (is_course_generating === true){

                setIsCourseGenerating(true);

                const interval = setInterval(async () => {
                    const response = await fetch(`http://127.0.0.1:8000/course-gen-task-status/${task_id}`);
                    const data = await response.json();
                    console.log('Course Status Data:', data);

                    setCourseGenerationProgress(data.progress);

                    const updated_course_data = data['user_course_object'];

                    setCourseMetaData({
                        "course_name": updated_course_data['course_name'],
                        "course_description": updated_course_data['course_description'],
                        "is_course_generating": updated_course_data['is_course_generating']
                    });
                    setCourseCompletedModuleList(updated_course_data['current_course_module_list']);
        
                    if (data.state === "SUCCESS" || data.state === "FAILURE") {
                        clearInterval(interval);
                        setIsCourseGenerating(false);
                        setCourseGenerationProgress(100);
                    }

                }, 2000); // Poll every second
        
                // TODO: test out and fix all bugs; etc. + finalize
                return () => clearInterval(interval);

            }

        }

    };

    // handle animations
    useEffect(() => {

        // Initial Animations
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });

    }, []);


    // TODO: handle course fetch
    useEffect(() => {

        // Fetch the course modules for the user
        _handleUserCourseModuleFetch();

    }, []);


    return (

        <>

            {/* Dashboard Top NavBar */}
            <DashboardTopNavBar />

            {/* Course Home Layout */}
            {/* max-w-[1100px] */}
            {/* <div className="flex flex-col min-h-screen mt-8"> */}
            <div className="flex flex-col items-start min-h-screen mt-8 mx-auto w-[80%] sm:w-[70%]">

                {/* <h1 className="mb-4 text-[24px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
                    Python Fundamentals for Card Game Development
                </h1>
                <Progress value={33} /> */}
                {/* <div className="flex items-center justify-between"> */}
                    <h1
                        className="mb-4 text-[26px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"
                        data-aos="fade-down"
                    >
                        {/* Mastering Python for Card Game Development: The War Edition! 🎯 */}
                        {courseMetaData.course_name} 🎯
                    </h1>

                    <p
                        className="text-gray-500 text-[15px] leading-9 mb-2 mt-1 pr-10"
                        data-aos="fade-down"
                    >
                        {/* We&apos;ll start by sharpening your existing skills and then dive into the core concepts necessary for implementing class-based structures and game logic. 🚀 */}
                        {courseMetaData.course_description}
                    </p>

                    <div 
                        className="flex items-center space-x-2 pt-4 mb-0"
                        data-aos="fade-down"
                    >
                        {/* <span className="text-blue-600 dark:text-blue-500"></span> */}
                        {/* <span className="text-gray-800 dark:text-white text-[13px] font-medium"> */}
                        <span className="text-blue-700 dark:text-white text-[13px] font-medium">
                            Your Course Progress: (2%)
                        </span>
                        <Progress value={2} className="w-40" />

                        {
                            (isCourseGenerating === true) && (
                                <>
                                    <span className='px-1 text-[12px]'>|</span>
                                    <span className="text-gray-800 dark:text-white text-[13px] font-medium">
                                        AI Course Generation Progress: (33%)
                                    </span>
                                    <Progress value={courseGenerationProgress} className="w-40" />
                                </>
                            )
                        }

                        {/* <span className="text-gray-600 dark:text-white text-[13px] font-normal">33%</span> */}                        
                    </div>
                {/* </div> */}

                <hr className="h-px mt-4 bg-gray-300 border-1 dark:bg-gray-700 w-[95%]"data-aos="fade-up" />

                {/* <p
                    className="text-gray-400"
                >
                    We'll start by sharpening your existing skills and then dive into the core concepts necessary for implementing class-based structures and game logic. 🚀
                </p> */}

                {/* Course Syllabus List */}
                <ol 
                    className="relative border-s border-gray-200 dark:border-gray-700 mt-8"
                    data-aos="fade-up"
                >
                    {/* {course_syllabus_list.map((item, index) => ( */}
                    {courseCompletedModuleList.map((item, index) => (
                        <li
                            className="mb-8 ms-4"
                            key={item.parent_module_object_id}
                        >

                            {
                                (index === 0) 
                                ?
                                (
                                    <div
                                        className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border-2 border-blue-400 dark:border-gray-900 dark:bg-gray-700"
                                    ></div>
                                )
                                :
                                (
                                    <div
                                        className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border dark:border-gray-900 dark:bg-gray-700"
                                    ></div>
                                )
                            }

                            

                            <a
                                className="cursor-pointer"
                                href={`/learn-python/module/${item.parent_module_object_id}`}                                
                            >
                                <h3 
                                    className="inline text-[18px] font-semibold text-blue-500 hover:text-blue-600"
                                >
                                    {item.parent_module_name}
                                </h3>
                            </a>

                            {(showSubModulesIDList.includes(index)) ? (

                                <div>
                                    <p className="mb-1 pt-2 text-[15.5px] font-normal text-gray-500 dark:text-gray-400">
                                        {item.parent_module_description}
                                    </p>

                                    {/* TODO: test and finalize this; get all functionality + UI complete and finalized for here */}

                                    <span
                                        className="text-red-500 text-[13px] cursor-pointer hover:text-red-300"
                                        onClick={() => removeFromModuleIdList(index)}
                                    >
                                        Hide Modules
                                    </span>

                                    <ol className="relative mt-4">
                                        {item['sub_modules'].map((module_item) => (

                                            <li
                                                className="mb-2 ms-4"
                                                key={module_item.sub_module_object_id}
                                            >
                                                <h3
                                                    className="inline text-[14px] font-normal text-blue-400 hover:font-semibold"
                                                >
                                                    {/* <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 pr-2 dark:text-white w-4 h-4" /> */}
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-gray-400 pr-2 dark:text-white w-4 h-4" />
                                                    Module: {module_item.sub_module_name}
                                                </h3>
                                            </li>

                                        ))}
                                    </ol>
                                </div>

                            ) : (

                                <div>
                                    {/* data-aos="fade-in" */}

                                    <p className="mb-2 pt-2 text-[15.5px] font-normal text-gray-500 dark:text-gray-400 tracking-normal">
                                        {item.parent_module_description}
                                    </p>

                                    {(item['sub_modules'].length > 0) && (

                                        <span
                                            className="text-blue-400 text-[13px] cursor-pointer hover:text-blue-600"
                                            onClick={() => addToModuleIdList(index)}
                                        >
                                            Show Modules
                                        </span>

                                    )}

                                </div>

                            )}

                        </li>
                    ))}
                </ol>

            </div>

        </>

        // <div className="flex flex-col min-h-screen mt-12 ml-0 items-center">

        //     <h1 className="mb-4 text-[24px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
        //         Modules - Introduction to Python
        //     </h1>

            // <ol className="relative border-s border-gray-200 dark:border-gray-700 mt-6">
            //     {course_syllabus_list.map((item, index) => (
            //         <li
            //             className="mb-8 ms-4"
            //             key={item.id}
            //         >

            //             <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

            //             <a
            //                 className="cursor-pointer"
            //                 href={`/learn-python/module/${index}`}
            //             >
            //                 <h3 
            //                     className="inline text-lg font-semibold text-blue-600 hover:text-blue-400"
            //                 >
            //                     {item.chapter_name}
            //                 </h3>
            //             </a>

            //             {(showSubModulesIDList.includes(index)) ? (

            //                 <div>
            //                     <p className="mb-1 pt-2 text-[15px] font-normal text-gray-500 dark:text-gray-400">
            //                         {item.chapter_description}
            //                     </p>

            //                     <span
            //                         className="text-red-500 text-[14px] cursor-pointer hover:text-red-300"
            //                         onClick={() => removeFromModuleIdList(index)}
            //                     >
            //                     Hide Modules
            //                     </span>

            //                     <ol className="relative mt-4">
            //                         {item['module_list'].map((module_item) => (
                                        
            //                             <li
            //                                 className="mb-4 ms-4"
            //                                 key={module_item.module_number}
            //                             >
            //                                 <h3
            //                                     className="inline text-base font-normal text-blue-400"
            //                                 >
            //                                     Module: {module_item.module_name}
            //                                 </h3>
            //                             </li>

            //                         ))}
            //                     </ol>
            //                 </div>

            //             ) : (

            //                 <div>

            //                     <p className="mb-1 pt-2 text-[15px] font-normal text-gray-500 dark:text-gray-400">
            //                         {item.chapter_description}
            //                     </p>

            //                     <span
            //                         className="text-blue-400 text-[14px] cursor-pointer hover:text-blue-600"
            //                         onClick={() => addToModuleIdList(index)}
            //                     >
            //                         Show Modules
            //                     </span>

            //                 </div>

            //             )}

            //         </li>
            //     ))}
            // </ol>

        // </div>

    );

}

export default CourseHomeLayout;