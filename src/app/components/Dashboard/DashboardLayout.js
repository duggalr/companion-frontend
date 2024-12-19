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

    const handleRename = (index) => {
        setEditingIndex(index);
    };

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


    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col w-full max-w-4xl mt-6 mb-12">
                <h1 className="text-[24px] font-bold text-gray-800 dark:text-gray-200 mt-6">
                    Your Saved Code
                    <Link
                        className="text-blue-400 hover:text-blue-600 dark:text-blue-500 hover:underline text-[14px] font-medium text-right pl-4"
                        href="/playground"
                    >
                        <FontAwesomeIcon icon={faPlus} className="pr-1 text-[13px]" />New
                    </Link>
                </h1>

                {dashboardDataLoading ? (
                    <p className="mt-6 text-gray-500 text-[14.5px] tracking-wide pl-1">
                        Fetching your data...
                    </p>
                ) : (
                    dashboardDataList.length > 0 ? (
                        <ul className="divide-y mt-4">
                            {dashboardDataList.map((dashboard_item, index) => (
                                <li key={dashboard_item.id} className="pb-3 sm:py-5">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="flex-shrink-0">
                                            <FontAwesomeIcon icon={faLaptopCode} className="text-[20px] text-gray-400 pb-3" />
                                        </div>
                                        <div className="flex-1 min-w-0">
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
                                                        className="tracking-wide text-[17.5px] font-medium text-gray-900 truncate dark:text-white cursor-pointer hover:text-blue-400 dark:hover:text-blue-400 inline-block"
                                                    >
                                                        {fileNames[index] || dashboard_item.name}
                                                    </p>
                                                )}
                                            </Link>
                                            <div className="flex items-center space-x-2 pt-1">
                                                <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">
                                                    Language: Python
                                                </p>
                                                <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">|</p>
                                                <p className="tracking-wide text-[12.5px] mt-1 text-gray-500 truncate dark:text-gray-400">
                                                    Number of Chat Messages: {dashboard_item.number_of_chat_messages}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start text-[13px] text-gray-900 dark:text-gray-400 tracking-wider">
                                            <span
                                                className="text-blue-400 hover:text-blue-600 dark:text-blue-500 hover:underline cursor-pointer mb-1"
                                                onClick={() => handleRename(index)}
                                            >
                                                Change File Name
                                            </span>
                                            <div className="inline-flex items-center pt-1">
                                                <FontAwesomeIcon icon={faClock} className="text-[12px] text-gray-400 pr-2" />
                                                Last Updated: {dashboard_item.updated_date}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-6 text-gray-500 text-[14.5px] tracking-wide pl-1">
                            No Saved Code.
                            Go to{" "}
                            <Link href="/playground">
                                <span className="text-blue-400 hover:text-blue-600 dark:text-blue-500 hover:underline text-[14px]">
                                    Playground
                                </span>
                            </Link>{" "}
                            and create a new file to save your code.
                        </div>
                    )
                )}
            </div>
        </div>


    );

}

export default DashboardLayout;