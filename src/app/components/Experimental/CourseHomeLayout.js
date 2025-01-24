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
    const [courseGenerationProgress, setCourseGenerationProgress] = useState("?");
    const [currentCourseProgressDict, setCurrentCourseProgressDict] = useState(null);

    const _getCourseProgress = async (progress_dict) => {
        return new Promise((resolve, reject) => {

            let total_exercises = 0;
            let completed_exercises = 0;
            for (var k in progress_dict){

                let current_di = progress_dict[k];
                completed_exercises += current_di['completed_course_module_exercises'];
                total_exercises += current_di['total_course_module_exercises'];

            }

            let rv = {
                'completed_exercises': completed_exercises,
                'total_exercises': total_exercises,
                'ratio_percent': Math.round((completed_exercises / total_exercises) * 100)
            }
            resolve(rv);
        });
    }

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

                let current_course_celery_task_id = user_course_rv_dict['current_celery_task_id'];
                console.log('current_course_celery_task_id:', current_course_celery_task_id);
                
                const interval = setInterval(async () => {
                    const response = await fetch(`http://127.0.0.1:8000/course-gen-task-status/${current_course_celery_task_id}`);
                    const data = await response.json();
                    console.log('Course Status Data:', data);

                    setCourseGenerationProgress(data.progress);
                    
                    if (data.state === 'PENDING'){
                        // pass
                    } else {
   
                        if (data.progress === 100){
                            setIsCourseGenerating(false);
                            window.location.reload();
                        }

                        const updated_course_data = data['user_course_object'];
                        console.log('updated_course_data:', data);
    
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

                    }

                }, 2000); // Poll every second
        
                // TODO: test out and fix all bugs; etc. + finalize
                return () => clearInterval(interval);

            }
            
            else {

                let current_course_prog_di = user_course_rv_dict['course_progress_dictionary'];
                console.log('current_course_prog_di:', current_course_prog_di);

                // let total_exercises = 0;
                // let completed_exercises = 0;
                // for (var k in current_course_prog_di){

                //     console.log('value:', current_course_prog_di[k]);
                    
                //     let current_di = current_course_prog_di[k];
                //     total_exercises += current_di['total_course_module_exercises'];
                //     completed_exercises = current_di['completed_course_module_exercises'];

                // }

                // console.log('course-progress-dict:', {
                //     'completed_exercises': completed_exercises,
                //     'total_exercises': total_exercises,
                //     'ratio_percent': (completed_exercises / total_exercises) * 100
                // });

                // setCurrentCourseProgressDict({
                //     'completed_exercises': completed_exercises,
                //     'total_exercises': total_exercises,
                //     'ratio_percent': (completed_exercises / total_exercises) * 100
                // });

                const prog_rv = await _getCourseProgress(current_course_prog_di);
                console.log('prog_rv:', prog_rv);
                setCurrentCourseProgressDict(prog_rv);

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
                        {(isCourseGenerating === false) && (
                            (currentCourseProgressDict !== null) ? (
                                <>
                                    <span className="text-blue-700 dark:text-white text-[13px] font-medium">
                                        {/* Your Course Progress: ({currentCourseProgressDict.ratio_percent}%) */}
                                        Your Course Progress: ({Math.round(currentCourseProgressDict.ratio_percent)}%)
                                    </span>
                                    <Progress value={currentCourseProgressDict.ratio_percent} className="w-40" />
                                </>

                            ) : (
                                null
                            )
                        )}

                        {
                            (isCourseGenerating === true) && (
                                <>
                                    <div role="status">
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    
                                        {(courseGenerationProgress === "?") ? (
                                            <span className="text-gray-800 dark:text-white text-[13px] font-medium">
                                            AI Course Generation Progress: (loading)
                                            </span>
                                        ) : (
                                            <span className="text-gray-800 dark:text-white text-[13px] font-medium">
                                            AI Course Generation Progress: ({Math.round(courseGenerationProgress)}%)
                                            </span>
                                        )}
                                    
                                    {(courseGenerationProgress === "?") ? (
                                        <Progress value={0} className="w-40" />
                                    ) : (
                                        <Progress value={courseGenerationProgress} className="w-40" />
                                    )}
                                    
                                    <span className="text-gray-500 dark:text-white text-[12px] font-normal">
                                        Will take ~5-10 minutes. Generating a brand new course, just for you!
                                    </span>
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

                            {/* {
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
                            } */}

                            {(isCourseGenerating === false) ? (
                                
                                (item.cm_progress_dict.course_module_passed === true) ? (
                                    <div
                                        className="absolute w-4 h-4 bg-green-400 rounded-full mt-1.5 -start-2 dark:border-gray-900 dark:bg-gray-700"
                                    ></div>
                                ) : (
                                    <div
                                        className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 dark:border-gray-900 dark:bg-gray-700"
                                    ></div>
                                )

                            ) : (
                                <div
                                        className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 dark:border-gray-900 dark:bg-gray-700"
                                    ></div>
                            )}
                            
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