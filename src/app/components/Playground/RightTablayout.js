import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faComments, faShuffle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from  '@/lib/utils/localStorageUtils';
import { getRandomInitialPlaygroundQuestion } from '@/lib/backend_api/getRandomInitialPlaygroundQuestion';
import useUserContext from "@/lib/hooks/useUserContext";
import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import handleRandomQuestionSet from "@/lib/utils/handleRandomQuestionSet";
import ProblemLayout from "@/app/components/Playground/ProblemLayout";
import SubmissionLayout from "@/app/components/Playground/SubmissionLayout";
import NewChatInterface from '@/app/components/Playground/NewChatInterface';
// import addQIDParam from '@/lib/utils/addQidParam';


const RightTabLayout = ({ }) => {

    const [activeTab, setActiveTab] = useState("problem");

    const {isAuthenticated, userAccessToken} = useUserContext();

    const _handleNewBlankQuestion = async () => {
        
        let tmp_d = {
            question_id: null,
            name: "Enter Question Name...",
            question: "Enter your question text here (by pressing 'edit question')...",
            input_output_list: [],
            code: `def main():
    raise notImplementedError
`,
        };

        if (isAuthenticated){

            // TODO:
            window.history.pushState({}, '', `/playground?new=true`);
            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: null,
                name: tmp_d['name'],
                question: tmp_d['question'],
                input_output_list: tmp_d['input_output_list'],
                code: tmp_d['code'],
            });
            window.location.reload();

        }
        else {

            window.history.pushState({}, '', `/playground?new=true`);
            removeFromLocalStorage('playground_question_dict');

            saveToLocalStorage('playground_question_dict', JSON.stringify(tmp_d));
            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: null,
                name: tmp_d['name'],
                question: tmp_d['question'],
                input_output_list: tmp_d['input_output_list'],
                code: tmp_d['code'],
            });

            // delete messages in local storage
            removeFromLocalStorage('user_chat_messages');
            window.location.reload();

        }

    };

    const { dispatch } = usePlaygroundContext();

    const _handleShuffleQuestion = async () => {

        if (isAuthenticated) {
            
            let rnd_question_dict = await getRandomInitialPlaygroundQuestion(
                null, userAccessToken
            );

            if (rnd_question_dict['success'] === true){

                const rnd_q_data = rnd_question_dict['data'];

                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: null,
                    name: rnd_q_data['name'],
                    question: rnd_q_data['text'],
                    input_output_list: rnd_q_data['example_io_list'],
                    code: rnd_q_data['starter_code'],
                });

            }

        } else {

            let current_user_id = getFromLocalStorage('user_id');
            let rnd_question_set_response = await handleRandomQuestionSet(current_user_id);

            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: null,
                name: rnd_question_set_response['name'],
                question: rnd_question_set_response['question'],
                input_output_list: rnd_question_set_response['input_output_list'],
                code: rnd_question_set_response['code'],
            });

            

        }

    }

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
                                <FontAwesomeIcon 
                                    icon={faBook}
                                    size="sm"
                                    className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                                />
                                Problem
                            </a>
                        </li>
                        <li className="me-2">
                            <a
                                className={`inline-block p-0 px-6 pb-2 pt-3 rounded-t-lg text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${activeTab === "chat" ? "border-b-2 border-gray-300 text-gray-800 dark:text-blue-500 dark:border-blue-500 " : ""}`}
                                onClick={() => setActiveTab("chat")}
                            >
                                <FontAwesomeIcon 
                                    icon={faComments}
                                    size="sm"
                                    className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                                />
                                Tutor
                            </a>
                        </li>
                        <li className="me-2">
                            <a
                                className={`inline-block p-0 px-6 pb-2 pt-3 rounded-t-lg text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${activeTab === "submission" ? "border-b-2 border-gray-300 text-gray-800 dark:text-blue-500 dark:border-blue-500 " : ""}`}
                                onClick={() => setActiveTab("submission")}
                            >
                                <FontAwesomeIcon 
                                    icon={faComments}
                                    size="sm"
                                    className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                                />
                                Submissions
                            </a>
                        </li>
                    </ul>
                    <div className="flex space-x-5 mt-1">
                        <span
                            className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300"
                            onClick={_handleNewBlankQuestion}
                        >
                            <FontAwesomeIcon icon={faPlus} className="pr-1"/>
                            New Blank Question
                        </span>
                        <span 
                            className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 pr-4"
                            onClick={_handleShuffleQuestion}
                        >
                            <FontAwesomeIcon icon={faShuffle} className="pr-1"/>
                            Random Question
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
                
            <div className="flex-grow overflow-y-scroll no-scrollbar">
                
                {activeTab === "problem" && <ProblemLayout setActiveTab={setActiveTab} />}

                {activeTab === "chat" && <NewChatInterface/>}

                {activeTab === "submission" && <SubmissionLayout/>}

            </div>
        
        </div>
  
    );
};
  
export default RightTabLayout;