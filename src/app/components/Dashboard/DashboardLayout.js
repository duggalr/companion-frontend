import { useEffect, useState } from "react";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faClock, faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { fetchDashboardData } from "@/lib/backend_api/fetchDashboardData";


const DashboardLayout = ({ accessToken, userAuthenticated }) => {
    
    const [dashboardDataLoading, setDashboardDataLoading] = useState(true);
    const [dashboardDataList, setDashboardDataList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [fileNames, setFileNames] = useState([]);

    const _handleFetchDashboardData = async () => {
        setDashboardDataLoading(true);

        let dashboard_data = await fetchDashboardData(accessToken);

        if (dashboard_data?.playground_object_list?.length > 0) {
            setDashboardDataList(dashboard_data.playground_object_list);

            // Initialize file names
            setFileNames(dashboard_data.playground_object_list.map(item => item.code_file_name));
        } else {
            console.warn("No dashboard data available or failed to fetch data");
        }

        setDashboardDataLoading(false);
    };

    useEffect(() => {
        if (accessToken) {
            _handleFetchDashboardData();
        }
    }, [accessToken, userAuthenticated]);

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


    // const [activeTab, setActiveTab] = useState("tab1");

    const MIT_COURSE_OUTLINE = [
        {
            id: '1324f143-0086-4811-8093-194115d0697c',
            lecture_number: 1,
            name: 'Lecture 1: Introduction',
            description: 'Introduction to Python: knowledge, machines, objects, types, variables, bindings, IDEs',
        }
    ]

    return (

        // bg-gray-900 text-white

        <div className="min-h-screen flex justify-center pt-8">

            <div className="w-full max-w-4xl">
                <div className="flex border-b border-gray-700">

                    <span className="">
                        MIT 6.100L Course
                    </span>

                    <span className="px-6">
                        Your Code Files
                    </span>

                    {/* {["tab1", "tab2", "tab3"].map((tab) => (
                        <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 ${
                            activeTab === tab
                            ? "text-blue-500 border-blue-500"
                            : "border-transparent hover:text-blue-400"
                        } focus:outline-none`}
                        >
                        {tab.toUpperCase()}
                        </button>
                    ))} */}
                    {/* <button
                        key="course_tab"
                        // ${
                        //     activeTab === tab
                        //     ? "text-blue-500 border-blue-500"
                        //     : "border-transparent hover:text-blue-400"
                        // }
                        className={`px-4 py-2 text-sm font-medium border-b-1 focus:outline-none`}
                        >
                        MIT 6.100L Course
                    </button> */}
                </div>

                <div className="mt-6">
                    {/* <div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tab 1 content goes here.</p>
                    </div> */}

                    {/* Timeline */}
                    <ol class="relative border-s border-gray-200 dark:border-gray-700">                  
                        
                        {MIT_COURSE_OUTLINE.map((item) => (

                            <li class="mb-6 ms-4">
                                <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                {/* <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Lecture 1</time> */}
                                <a href={`/course/introduction-to-programming/${item.lecture_number}`} className="cursor-pointer">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-500">
                                        {item.name}
                                    </h3>
                                </a>
                                <p class="mb-4 pt-1 text-[15px] font-normal text-gray-500 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </li>

                        ))}

                        {/* <li class="mb-6 ms-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Lecture 1</time>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                Lecture 1: Introduction
                            </h3>
                            <p class="mb-4 pt-1 text-[15px] font-normal text-gray-500 dark:text-gray-400">
                                Introduction to Python: knowledge, machines, objects, types, variables, bindings, IDEs
                            </p>
                        </li> */}

                        {/* <li class="mb-6 ms-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                Lecture 2: Strings, Input/Output, Branching
                            </h3>
                            <p class="mb-4 pt-1 text-[15px] font-normal text-gray-500 dark:text-gray-400">
                                Core Elements of Programs: strings, input/output, f-strings, operators, branching, indentation
                            </p>
                        </li>

                        <li class="mb-6 ms-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                Lecture 3: Iteration
                            </h3>
                            <p class="mb-4 pt-1 text-[15px] font-normal text-gray-500 dark:text-gray-400">
                                Program Flow: control flow, loops
                            </p>
                        </li> */}
                        

                        {/* <li class="mb-10 ms-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
                            <p class="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
                        </li>
                        <li class="ms-4">
                            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2022</time>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h3>
                            <p class="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
                        </li> */}
                    </ol>

                </div>

                {/* <div className="mt-6">
                {activeTab === "tab1" && (
                    <div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tab 1 content goes here.</p>
                    </div>
                )}
                {activeTab === "tab2" && (
                    <div>
                    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tab 2 content here.</p>
                    </div>
                )}
                {activeTab === "tab3" && (
                    <div>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Tab 3 content here.</p>
                    </div>
                )}
                </div> */}

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