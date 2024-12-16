import { useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTerminal, faComments, faQuestion } from '@fortawesome/free-solid-svg-icons';
// import useUserContext from "@/lib/hooks/useUserContext";
import ProblemLayout from "@/app/components/Playground/ProblemLayout";
import SubmissionLayout from "@/app/components/Playground/SubmissionLayout";
import NewChatInterface from '@/app/components/Playground/NewChatInterface';


const RightTabLayout = ({ }) => {

    const [activeTab, setActiveTab] = useState("problem");

    // const _handleNewFileClick = () => {
    //     window.location.href = '/playground';
    // };

    // const {isAuthenticated, userAccessToken} = useUserContext();

    return (
      
        <div className="flex flex-col h-full">

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex justify-between items-center">
                    <ul className="flex flex-wrap -mb-px">

                        <li className="me-2">
                            <a
                                className={`inline-block p-0 px-6 pb-2 pt-3 text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:text-gray-700 rounded-t-lg active dark:border-blue-500 cursor-pointer ${activeTab === "problem" ? "border-b-2 border-gray-300 text-gray-800 dark:text-blue-500 dark:border-blue-500" : ""}`}
                                aria-current="page"
                                onClick={() => setActiveTab("problem")}
                            >   
                                {/* <FontAwesomeIcon 
                                    icon={faQuestion}
                                    size="sm"
                                    className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                                /> */}
                                Problem
                            </a>
            
                        </li>

                        <li className="me-2">
                            <a
                                className={`inline-block p-0 px-6 pb-2 pt-3 rounded-t-lg text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${activeTab === "chat" ? "border-b-2 border-gray-300 text-gray-800 dark:text-blue-500 dark:border-blue-500 " : ""}`}
                                onClick={() => setActiveTab("chat")}
                            >
                                {/* <FontAwesomeIcon 
                                icon={faComments}
                                size="sm"
                                className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                                /> */}
                                Tutor
                            </a>
                        </li>

                        <li className="me-2">
                            <a
                                className={`inline-block p-0 px-6 pb-2 pt-3 rounded-t-lg text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${activeTab === "submission" ? "border-b-2 border-gray-300 text-gray-800 dark:text-blue-500 dark:border-blue-500 " : ""}`}
                                onClick={() => setActiveTab("submission")}
                            >
                                {/* <FontAwesomeIcon 
                                icon={faComments}
                                size="sm"
                                className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                                /> */}
                                Submissions
                            </a>
                        </li>
                    </ul>

                </div>
            </div>


            {/* Content */}
                
            <div className="flex-grow overflow-y-scroll no-scrollbar">
                
                {activeTab === "problem" && <ProblemLayout setActiveTab={setActiveTab}/>}

                {activeTab === "chat" && <NewChatInterface/>}

                {activeTab === "submission" && <SubmissionLayout/>}

            </div>
        
        </div>
  
    );
};
  
export default RightTabLayout;