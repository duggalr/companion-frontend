import { useEffect, useState } from "react";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faClock, faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { fetchDashboardData } from "../../../lib/api/fetchDashboardData";


const DashboardLayout = ({
    accessToken, userAuthenticated
}) => {

    const [dashboardDataLoading, setDashboardDataLoading] = useState(true);
    const [dashboardDataList, setDashboardDataList] = useState([]);

    const _handleFetchDashboardData = async () => {

        setDashboardDataLoading(true); // Set loading state true before fetch

        let dashboard_data = await fetchDashboardData(accessToken);
        console.log('dashboard_data:', dashboard_data);
        
        if (dashboard_data && dashboard_data.playground_object_list) {
            let playground_object_list = dashboard_data.playground_object_list;

            if (playground_object_list.length > 0) {
                setDashboardDataList(playground_object_list);
            } else {
                console.warn("Empty playground_object_list");
            }
        } else {
            console.warn("No dashboard data available or failed to fetch data");
        }
    
        setDashboardDataLoading(false); // Stop loading after fetching

    };

    useEffect(() => {
        
        if (accessToken) {
            _handleFetchDashboardData();
        }

    }, [accessToken, userAuthenticated]);
    
    // useEffect(() => {

    //     // console.log('user-auth:', accessToken, userAuthenticated)

    //     // if (!userAuthenticated) {
    //     //     redirect('/');
    //     // }
    
    //     // if (accessToken) {
    //     //     _handleFetchDashboardData();
    //     // }

    // }, [accessToken, userAuthenticated]);

    return (

        // items-center
        <div className="flex flex-col w-full max-w-2xl ml-[23em] mt-6">

            <h1 className="text-[24px] font-bold text-gray-800 dark:text-gray-200 mt-6">
                Your Saved Code
                
                <Link
                    class="text-blue-400 hover:text-blue-600 dark:text-blue-500 hover:underline text-[14px] font-medium text-right pl-4"
                    href="/playground"
                >
                    <FontAwesomeIcon icon={faPlus} className="pr-1 text-[13px]"/>Create
                </Link>
            </h1>

            {/* Show loading spinner/message while data is loading */}
            {dashboardDataLoading ? (
                <p className="mt-6 text-gray-500 text-[14.5px] tracking-wide pl-1">
                    Fetching your data...
                </p>
            ) : (
                dashboardDataList.length > 0 ? (
                    <ul class="divide-y mt-6">
                        {dashboardDataList.map((dashboard_item) => (
                            <li key={dashboard_item.id} className="pb-3 sm:py-4">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-shrink-0">
                                        {/* <img className="w-10 h-10 rounded-full" src="https://placehold.co/100" alt={`${dashboard_item.name} image`} /> */}
                                        <FontAwesomeIcon icon={faLaptopCode} className="text-[18px] text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/playground?pid=${dashboard_item.id}`}
                                        >
                                            <p className="tracking-wide text-[17.5px] font-medium text-gray-900 truncate dark:text-white cursor-pointer hover:text-blue-400 dark:hover:text-blue-400">
                                                {dashboard_item.code_file_name}
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="inline-flex items-center text-[13.5px] text-gray-900 dark:text-gray-400 tracking-wider">
                                        <FontAwesomeIcon icon={faClock} className="text-[12px] text-gray-400 pr-2" />
                                        {/* {dashboard_item.created_date}
                                        and: */}
                                        Last Updated: {dashboard_item.updated_date}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-6 text-gray-500 text-[14.5px] tracking-wide pl-1">
                        No Saved Code.
                        Go to <Link href="/playground">
                            <span className="text-blue-400 hover:text-blue-600 dark:text-blue-500 hover:underline text-[14px]">
                                Playground
                            </span>
                        </Link>
                        {' '}and create a new file to save your code.
                    </div>
                )
            )}

        </div>

    );

}

export default DashboardLayout;