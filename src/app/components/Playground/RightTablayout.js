import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faComments, faShuffle, faPlus, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from  '@/lib/utils/localStorageUtils';
import useUserContext from "@/lib/hooks/useUserContext";
import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import handleRandomQuestionFetchAndSet from "@/lib/utils/handleRandomQuestionFetchAndSet";
import ProblemLayout from "@/app/components/Playground/ProblemLayout";
import SubmissionLayout from "@/app/components/Playground/SubmissionLayout";
import NewChatInterface from '@/app/components/Playground/NewChatInterface';


const RightTabLayout = () => {

    const [activeTab, setActiveTab] = useState("problem");

    const {isAuthenticated, userAccessToken} = useUserContext();
    const { state, dispatch } = usePlaygroundContext();
    console.log('tmp-state:', state);

    const _handleNewBlankQuestion = async () => {
        
        let new_blank_question_data = {
            // question data
            question_id: null,
            name: "Enter Question Name...",
            question: "Enter your question text here (by pressing 'edit question')...",
            input_output_list: [],
            code: `def main():
    raise notImplementedError
`,
            console_output: state.console_output,
            lecture_question: false,
            test_case_list: [],

            // submission feedback
            all_test_cases_passed: null,
            program_output_result: [],
            ai_tutor_feedback: null,
            user_code_submission_history_objects: []
        };

        dispatch({
            type: "SET_PLAYGROUND_STATE",
            
            // question data
            question_id: null,
            name: "Enter Question Name...",
            question: "Enter your question text here (by pressing 'edit question')...",
            input_output_list: [],
            code: `def main():
    raise notImplementedError
`,
            console_output: state.console_output,
            lecture_question: false,
            test_case_list: [],

            // submission feedback
            all_test_cases_passed: null,
            program_output_result: [],
            ai_tutor_feedback: null,
            user_code_submission_history_objects: []
        });

        window.history.pushState({}, '', `/playground?new=true`);
        
        if (isAuthenticated){
            // window.location.reload();
        }
        else {
            // delete old playground question data
            removeFromLocalStorage('playground_question_dict');
            
            // delete messages in local storage
            removeFromLocalStorage('user_chat_messages'); 

            // save new dict in local-storage
            saveToLocalStorage('playground_question_dict', JSON.stringify(new_blank_question_data));
        }

    };

    const _handleShuffleQuestion = async () => {
        
        const current_user_id = await getFromLocalStorage('user_id');        

        let random_question_set_response = await handleRandomQuestionFetchAndSet(
            current_user_id,
            userAccessToken,
            dispatch,
            isAuthenticated,
            state
        );

        if ('error' in random_question_set_response){
            console.log('Error fetching random question...');
        };

    };

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
                    

                    {/* TODO: */}
                    {/* Defining Problem Layout and Data based on question type */}
                    {
                        state.problem_set_question === true ? (

                            <div className="flex space-x-5 mt-1">
                                <a
                                    className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 pr-4"
                                    href={`/course/introduction-to-programming/${state.next_lecture_number}`}
                                >
                                    <FontAwesomeIcon icon={faBook} className="pr-1"/>
                                    Lecture Notes
                                </a>

                                {state.next_question_object_id && (
                                    <a
                                        className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 pl-0 pr-8"
                                        href={`/playground?lesson_quid=${state.next_question_object_id}`}
                                    >
                                        Next Question
                                        <FontAwesomeIcon icon={faArrowRight} className="pl-2"/>
                                    </a>
                                )}
                            </div>

                        ) : state.lecture_question === true ? (

                            <div className="flex space-x-5 mt-1">
                                <a
                                    className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 pr-4"
                                    href={`/course/introduction-to-programming/${state.next_lecture_number}`}
                                >
                                    <FontAwesomeIcon icon={faBook} className="pr-1"/>
                                    Lecture Notes
                                </a>

                                {state.next_question_object_id && (
                                    <a
                                        className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 pl-0 pr-8"
                                        href={`/playground?lesson_quid=${state.next_question_object_id}`}
                                    >
                                        Next Question
                                        <FontAwesomeIcon icon={faArrowRight} className="pl-2"/>
                                    </a>
                                )}
                            </div>

                        ) : (

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

                        )
                    }

                    {/* {
                        (state.lecture_question === true) ? (

                            <div className="flex space-x-5 mt-1">
                                <a
                                    className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 pr-4"
                                    // onClick={_handleNewBlankQuestion}
                                    href={`/course/introduction-to-programming/${state.next_lecture_number}`}
                                >
                                    <FontAwesomeIcon icon={faBook} className="pr-1"/>
                                    Lecture Notes
                                </a>

                                { state.next_question_object_id && (<a
                                    className="text-[11px] text-gray-600 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 pl-0 pr-8"
                                    // onClick={_handleShuffleQuestion}
                                    href={`/playground?lesson_quid=${state.next_question_object_id}`}
                                >
                                    Next Question
                                    <FontAwesomeIcon icon={faArrowRight} className="pl-2"/>
                                </a>)}
                                
                            </div>

                        ) : (

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

                        )
                    } */}
                    
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