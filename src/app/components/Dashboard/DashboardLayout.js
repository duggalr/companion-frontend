import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faClock, faLaptopCode, faSchool, faBook, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { fetchDashboardData } from "@/lib/backend_api/fetchDashboardData";
import { fetchDashboardCourseHomeData } from "@/lib/backend_api/fetchDashboardCourseHomeData";
import { getFromLocalStorage } from "@/lib/utils/localStorageUtils";


const DashboardLayout = ({ accessToken, userAuthenticated }) => {
    
    const [dashboardDataLoading, setDashboardDataLoading] = useState(true);
    const [dashboardDataList, setDashboardDataList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [fileNames, setFileNames] = useState([]);

    const [courseLectureList, setCourseLectureList] = useState([]);

    const _handleFetchDashboardData = async () => {
        setDashboardDataLoading(true);

        const current_user_id = await getFromLocalStorage('user_id');

        // TODO:
        let dashboard_data = await fetchDashboardData(
            accessToken,
            current_user_id
        );
        console.log('DASHBOARD DATA:', dashboard_data);

        if (dashboard_data['success'] === true){
            // Set Course Lecture data
            setCourseLectureList(dashboard_data.lecture_objects_list);

            // Set Dashboard Data
            setDashboardDataList(dashboard_data.playground_object_list);

            // Initialize file names
            setFileNames(dashboard_data.playground_object_list.map(item => item.code_file_name));
        }
        setDashboardDataLoading(false);


        // // let dashboard_data = await fetchDashboardData(accessToken);
        // // console.log('dashboard_data:', dashboard_data)
        
        // // if (dashboard_data['success'] === true){

        // //     // Set Course Lecture data
        // //     setCourseLectureList(dashboard_data.lecture_objects_list);

        // //     // Set Dashboard Data
        // //     setDashboardDataList(dashboard_data.playground_object_list);            

        // //     // Initialize file names
        // //     setFileNames(dashboard_data.playground_object_list.map(item => item.code_file_name));

        // // }

    };


    // const _handleFetchCourseData = async () => {
    //     setDashboardDataLoading(true);

    //     // let dashboard_data = await fetchDashboardData(accessToken);
    //     // console.log('dashboard_data:', dashboard_data)

    //     let current_anon_user_id = getFromLocalStorage("user_id");

    //     let course_data_response = await fetchDashboardCourseHomeData(
    //         current_anon_user_id,
    //         accessToken
    //     );
    //     console.log('course-data:', course_data_response);

    //     if (course_data_response['success'] === true){
    //         let data = course_data_response['lecture_objects_list'];
    //         setCourseLectureList(data);
    //     }
    // };

    // const handleRename = (index) => {
    //     setEditingIndex(index);
    // };

    const handleInputChange = (e, index) => {
        const updatedFileNames = [...fileNames];
        updatedFileNames[index] = e.target.value;
        setFileNames(updatedFileNames);
    };

    const handleInputBlur = (index) => {
        setEditingIndex(null);

        let cdict = dashboardDataList[index];

        let current_conversation_id = cdict['id'];
        let new_conversation_name = fileNames[index];

        let payload = {
            'current_conversation_id': current_conversation_id,
            'new_conversation_name': new_conversation_name
        }
        changePGCodeName(accessToken, payload);
    };

    // // const [activeTab, setActiveTab] = useState("tab1");

    // const MIT_COURSE_OUTLINE = [
    //     {
    //         id: '1324f143-0086-4811-8093-194115d0697c',
    //         lecture_number: 1,
    //         name: 'Lecture 1: Introduction',
    //         description: 'Introduction to Python: knowledge, machines, objects, types, variables, bindings, IDEs',
    //     }
    // ]

    const [activeTab, setActiveTab] = useState("course");

    const _handleActiveTabClick = async (val) => {
        setActiveTab(val);
    };

    useEffect(() => {
        // TODO:
        _handleFetchDashboardData();

        // if (accessToken && userAuthenticated === true) {
        //     _handleFetchDashboardData();
        // } else {
        //     // TODO:
        //     _handleFetchCourseData();
        // }
    }, [accessToken, userAuthenticated]);


    return (

        // bg-gray-900 text-white
        <div className="min-h-screen flex justify-center pt-8 bg-[#f4f5f6] dark:bg-gray-900">

            <div className="w-full max-w-4xl">

                {/* Tab List */}
                {/* <div className="flex border-b border-gray-700 pb-2"> */}
                <div className="border-b border-gray-500">

                    <ul className="flex flex-wrap -mb-px">

                        <li className="me-2">
                            <span
                            // className="inline-block p-4 pb-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 active"
                            className={`inline-block p-4 pb-2 border-b-2 rounded-t-lg hover:text-blue-600 hover:border-blue-500 dark:hover:text-blue-500 cursor-pointer ${(activeTab === 'course') ? 'border-blue-500 border-bold active font-semibold' : 'border-transparent'}`}
                            onClick={() => _handleActiveTabClick("course")}
                            ><FontAwesomeIcon icon={faBook} className="pr-1"/> MIT 6.100L Course</span>
                        </li>

                        {userAuthenticated ? (

                            <li className="me-2">
                                <span
                                // className="inline-block p-4 pb-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 active"
                                className={`inline-block p-4 pb-2 border-b-2 rounded-t-lg hover:text-blue-600 hover:border-blue-500 dark:hover:text-blue-500 cursor-pointer ${(activeTab === 'code_files') ? 'border-blue-500 border-bold active font-semibold' : 'border-transparent'}`}
                                onClick={() => _handleActiveTabClick("code_files")}
                                ><FontAwesomeIcon icon={faLaptopCode} className="pr-1"/>Your Playground Code Files</span>
                            </li>

                        ) : (

                            <li className="me-2">
                                <span
                                className="inline-block p-4 pb-2 border-b-2 border-transparent rounded-t-lg text-gray-400 border-gray-300 cursor-not-allowed"
                                // className={`inline-block p-4 pb-2 border-b-2 rounded-t-lg hover:text-blue-600 hover:border-blue-500 dark:hover:text-blue-500 cursor-pointer border-transparent}`}
                                ><FontAwesomeIcon icon={faLaptopCode} className="pr-1"/>Your Playground Code Files</span>
                            </li>

                        )}

                    </ul>

                </div>

                {activeTab === 'course' ? (
                    <div className="pt-2">
                        <span className="text-gray-500 text-[12.5px]">
                            You can also view the course materials on <a 
                                href="https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/"
                                className='text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                MIT OCW
                            </a>.
                        </span>
                    </div>
                ) : (

                    <div className="pt-2">
                        <span className="text-gray-500 text-[12.5px]">
                            Work on a <a 
                                href="/playground"
                                className='text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                            >new question</a>.
                        </span>
                    </div>

                )}
                
                <div className="mt-5">

                    {activeTab === 'course' ? (

                        <ol className="relative border-s border-gray-200 dark:border-gray-700">
                            {courseLectureList.map((item) => (
                                <li
                                    className="mb-8 ms-4"
                                    key={item.id}
                                >
                                    {(item.lecture_completed === true) ? (
                                        <div className="absolute w-3 h-3 bg-green-500 rounded-full mt-1.5 -start-1.5 border border-green dark:border-gray-900 dark:bg-gray-700"></div>
                                    ): (
                                        <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                    )}
                                    
                                    <a 
                                        href={`/course/introduction-to-programming/${item.number}`} 
                                        className="cursor-pointer"
                                    >
                                        <h3 
                                            // className="inline text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-500"
                                            className="inline text-lg font-semibold text-blue-600 hover:text-blue-400"
                                        >
                                            {item.name}
                                        </h3>
                                    </a>
                                    <p className="mb-4 pt-1 text-[15px] font-normal text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </p>

                                    {/* Lecture Exercises and Problem Set */}
                                    <ol className="relative border-s border-gray-200 dark:border-gray-700">

                                        {item.lecture_exercise_list.map((exercise_item) => (

                                            <li
                                                className="mb-4 ms-4"
                                                key={exercise_item.id}
                                            >
                                                {(exercise_item.complete === true) ? (

                                                    <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700">
                                                        <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                                        </svg>
                                                    </div>

                                                ): (
                                                    
                                                    <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                                                )}
                                                
                                                <a 
                                                    href={`/playground?lesson_quid=${exercise_item.id}`}
                                                    className="cursor-pointer"
                                                >
                                                    <h3
                                                        className="inline text-base font-normal text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:dark:text-blue-500"
                                                    >
                                                        Lecture Exercise: {item.name}
                                                    </h3>
                                                </a>

                                            </li>

                                        ))}

                                        {/* Problem Set  */}
                                        {Object.keys(item.problem_set_dict).length > 0 && (

                                            <li
                                                className="mb-4 ms-4"
                                                key={item.problem_set_dict.id}
                                            >
                                                {(item.problem_set_dict.complete === true) ? (

                                                    <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700">
                                                        <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                                        </svg>
                                                    </div>

                                                ): (
                                                    
                                                    <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                                                )}
                                                
                                                {(item.problem_set_dict.implementation_in_progress === true) ? (

                                                    <a
                                                        className="cursor-not-allowed"
                                                    >
                                                        <h3
                                                            className={`inline text-base font-normal text-gray-300 disabled}`}
                                                        >
                                                            {item.problem_set_dict.name} (being added soon...)
                                                        </h3>
                                                    </a>

                                                ) : (

                                                    <a
                                                        href={`/playground?psid=${item.problem_set_dict.id}`}
                                                        className="cursor-pointer"
                                                    >
                                                        <h3
                                                            className={`inline text-base font-normal text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:dark:text-blue-500 hover:underline'}`}
                                                        >
                                                            {item.problem_set_dict.name}
                                                        </h3>
                                                    </a>

                                                )}

                                            </li>

                                        )}
                                        
                                        
                                    </ol>

                                </li>
                            ))}
                        </ol>

                    ): (

                        <>

                            {(dashboardDataList.length > 0) ? (

                                <ul className="divide-y mt-0">

                                    {dashboardDataList.map((dashboard_item, index) => (
                                        <li key={dashboard_item.id} className={`${(index !== 0 ? "pb-4" : "pb-3")}`}>
                                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                <div className={`flex-1 min-w-0 ${(index !== 0 ? "pt-3" : "pt-0")}`}>
                                                    <Link href={`/playground?qid=${dashboard_item.id}`}>
                                                        {editingIndex === index ? (
                                                            <input
                                                                type="text"
                                                                value={fileNames[index] || ""}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                onBlur={() => handleInputBlur(index)}
                                                                className="bg-transparent border-b-2 border-gray-400 outline-none w-full text-[17.5px] font-medium text-gray-900 truncate dark:text-white"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <p
                                                                // className="tracking-wide text-[17.5px] font-medium text-gray-900 truncate dark:text-white cursor-pointer hover:text-blue-400 dark:hover:text-blue-400 inline-block"
                                                                className="cursor-pointer hover:text-blue-400 text-blue-600 font-medium truncate dark:text-blue-500 dark:hover:text-blue-400"
                                                            >
                                                                {fileNames[index] || dashboard_item.name}
                                                            </p>
                                                        )}
                                                    </Link>
                                                    <div className="flex items-center space-x-2 pt-0">
                                                        <FontAwesomeIcon icon={faInfoCircle} className="text-[15px] text-gray-400 pt-1" />
                                                        <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">
                                                            Language: Python
                                                        </p>
                                                        <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">|</p>
                                                        <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">
                                                            Number of Chat Messages: {dashboard_item.number_of_chat_messages}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start text-[13px] text-gray-900 dark:text-gray-400">
                                                    <div className="inline-flex items-center pt-0">
                                                        <FontAwesomeIcon icon={faClock} className="text-[12px] text-gray-400 pr-2" />
                                                        {/* Last Updated: {dashboard_item.updated_date} */}
                                                        Last Updated: {new Date(dashboard_item.updated_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}

                                </ul>

                            ) : (

                                <h1>
                                    No Code Files Saved...
                                </h1>

                            )}

                        </>

                    )}

                </div>

            </div>

        </div>



    // OLD

        //    <div className="flex flex-col w-full max-w-4xl mt-6 mb-12">


        //        <h1 className="text-[24px] font-bold text-gray-800 dark:text-gray-200 mt-6">
        //            Your Saved Code
        //            <Link
        //                className="text-blue-400 hover:text-blue-600 dark:text-blue-500 hover:underline text-[14px] font-medium text-right pl-4"
        //                href="/playground"
        //            >
        //                <FontAwesomeIcon icon={faPlus} className="pr-1 text-[13px]" />New
        //            </Link>
        //        </h1>


        //        {dashboardDataLoading ? (
        //            <p className="mt-6 text-gray-500 text-[14.5px] tracking-wide pl-1">
        //                Fetching your data...
        //            </p>
        //        ) : (
        //            dashboardDataList.length > 0 ? (
        //                <ul className="divide-y mt-4">
        //                    {dashboardDataList.map((dashboard_item, index) => (
        //                        <li key={dashboard_item.id} className="pb-3 sm:py-5">
        //                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
        //                                <div className="flex-shrink-0">
        //                                    <FontAwesomeIcon icon={faLaptopCode} className="text-[20px] text-gray-400 pb-3" />
        //                                </div>
        //                                <div className="flex-1 min-w-0">
        //                                    <Link href={`/playground?qid=${dashboard_item.id}`}>
        //                                        {editingIndex === index ? (
        //                                            <input
        //                                                type="text"
        //                                                value={fileNames[index] || ""}
        //                                                onChange={(e) => handleInputChange(e, index)}
        //                                                onBlur={() => handleInputBlur(index)}
        //                                                className="bg-transparent border-b-2 border-gray-400 outline-none w-full text-[17.5px] font-medium text-gray-900 truncate dark:text-white"
        //                                                autoFocus
        //                                            />
        //                                        ) : (
        //                                            <p
        //                                                className="tracking-wide text-[17.5px] font-medium text-gray-900 truncate dark:text-white cursor-pointer hover:text-blue-400 dark:hover:text-blue-400 inline-block"
        //                                            >
        //                                                {fileNames[index] || dashboard_item.name}
        //                                            </p>
        //                                        )}
        //                                    </Link>
        //                                    <div className="flex items-center space-x-2 pt-1">
        //                                        <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">
        //                                            Language: Python
        //                                        </p>
        //                                        <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">|</p>
        //                                        <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">
        //                                            Number of Chat Messages: {dashboard_item.number_of_chat_messages}
        //                                        </p>
        //                                    </div>
        //                                </div>
        //                                <div className="flex flex-col items-start text-[13px] text-gray-900 dark:text-gray-400 tracking-wider">
        //                                    <div className="inline-flex items-center pt-1">
        //                                        <FontAwesomeIcon icon={faClock} className="text-[12px] text-gray-400 pr-2" />
        //                                        Last Updated: {dashboard_item.updated_date}
        //                                    </div>
        //                                </div>
        //                            </div>
        //                        </li>
        //                    ))}
        //                </ul>
        //            ) : (
        //                <div className="mt-6 text-gray-500 text-[14.5px] tracking-wide pl-1">
        //                    No Saved Code.
        //                    Go to{" "}
        //                    <Link href="/playground">
        //                        <span className="text-blue-400 hover:text-blue-600 dark:text-blue-500 hover:underline text-[14px]">
        //                            Playground
        //                        </span>
        //                    </Link>{" "}
        //                    and create a new file to save your code.
        //                </div>
        //            )
        //        )}

        //    </div>

    );

}

export default DashboardLayout;