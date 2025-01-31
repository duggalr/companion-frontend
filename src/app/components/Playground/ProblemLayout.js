import axios from "axios";
import React, { useEffect, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlay, faSpinner, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import useUserContext from "@/lib/hooks/useUserContext";
import { getFromLocalStorage, saveToLocalStorage } from "../../../lib/utils/localStorageUtils";
import { updateUserQuestion } from '@/lib/backend_api/updateUserQuestion';
import addQIDParam from '@/lib/utils/addQidParam';
import { handleSaveUserCode } from "@/lib/utils/handleSaveUserCode";
import handleAndSetSolutionSubmission from "@/lib/utils/handleAndSetSolutionSubmission";

import { marked } from 'marked';


const ProblemLayout = ({ setActiveTab }) => {

    const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

    const playgroundContext = usePlaygroundContext();
    let currentProblemState = playgroundContext.state;

    const { isAuthenticated, userAccessToken } = useUserContext();
    const { state, dispatch } = usePlaygroundContext();
    const [editing, setEditing] = useState(false);
    const [questionName, setQuestionName] = useState("");

    const [questionText, setQuestionText] = useState("");
    const [rawQuestionText, setRawQuestionText] = useState("");
    
    const [inputOutputLoading, setInputOutputLoading] = useState(false);
    const [currentProblemIOList, setCurrentProblemIOList] = useState([]);

    useEffect(() => {
        setQuestionName(currentProblemState.name);
        const marked_question = marked(currentProblemState.question);
        setQuestionText(marked_question);
        setRawQuestionText(currentProblemState.question);
        setCurrentProblemIOList(currentProblemState.input_output_list);
    }, [currentProblemState])


    const _handleEditQuestion = () => {
        setEditing(true);
    }

    const _handleQuestionValueChange = (e) => {
        // setQuestionText(e.target.value);
        setRawQuestionText(e.target.value);
    }

    const _handleQuestionNameChange = (e) => {
        setQuestionName(e.target.value);
    }

    const _handleUpdateQuestionSubmit = async () => {

        setEditing(false);
        setInputOutputLoading(true);
        
        let current_question_id = currentProblemState.question_id;
        let current_q_name = questionName;
        // let current_q_text = questionText;
        let current_q_text = rawQuestionText;
    
        let current_anon_user_id = getFromLocalStorage("user_id");
        let update_user_question_response = await updateUserQuestion(
            userAccessToken,
            current_anon_user_id,
            current_question_id,
            current_q_name,
            current_q_text
        );

        if (update_user_question_response['success'] === true){

            let response_json_data = update_user_question_response['data'];
            let example_io_list = JSON.parse(response_json_data['example_io_list']);
            
            setCurrentProblemIOList(example_io_list);
            setInputOutputLoading(false);

            dispatch({
                type: "SET_PLAYGROUND_STATE",

                question_id: response_json_data['unique_question_id'],
                name: response_json_data['question_name'],
                question: response_json_data['question_text'],
                input_output_list: example_io_list,
                code: currentProblemState.code,
                console_output: state.console_output,

                lecture_question: false,
                test_case_list: [],
                all_test_cases_passed: null,
                program_output_result: [],
                ai_tutor_feedback: null,

                user_code_submission_history_objects: []
            });

            if (isAuthenticated){

                addQIDParam(response_json_data['unique_question_id']);

            }
            else {

                const tmp_dict = {
                    question_id: response_json_data['unique_question_id'],
                    name: response_json_data['question_name'],
                    question: response_json_data['question_text'],
                    input_output_list: example_io_list,
                    code: currentProblemState.code,
                    console_output: state.console_output,

                    lecture_question: false,
                    test_case_list: [],
                    all_test_cases_passed: null,
                    program_output_result: [],
                    ai_tutor_feedback: null,

                    user_code_submission_history_objects: []
                };
                saveToLocalStorage('playground_question_dict', JSON.stringify(tmp_dict));

            };

        } else {
            console.log('Failed to update question...')
        }

    }

    const [isRunLoading, setIsRunLoading] = useState(false);

    const _sendCodeExecutionRequest = async function (code) {
        try {
            const payload = {
                language: "python",
                code: code,
            };
            
            const response = await axios.post(FASTAPI_BASE_URL + '/execute_user_code', payload);

            // Get the task ID from the response
            const { task_id } = response.data;

            pollForTaskStatus(task_id);
        } catch (error) {
            console.log("Error:", error);
        }
    };
    
    const getTaskResponse = async (task_id) => {
        try {
            const taskResponseURL = FASTAPI_BASE_URL + `/result/${task_id}`;
            const resultResponse = await axios.get(taskResponseURL);
            const { result_output_value } = resultResponse.data;
            dispatch({
                type: "UPDATE_CONSOLE_OUTPUT",
                output: result_output_value
            });

        } catch (error) {
            console.error("Error polling for result:", error);
        }
    };
    
    const pollForTaskStatus = async (taskId) => {
        try {
            const taskStatusURL = FASTAPI_BASE_URL + `/task/status/${taskId}`;

            const interval = setInterval(async () => {
                const resultResponse = await axios.get(taskStatusURL);

                const { status, task_id } = resultResponse.data;

                if (status === "SUCCESS") {
                    clearInterval(interval);
                    getTaskResponse(task_id);
                    setIsRunLoading(false); // Stop loading after result is received
                }
            }, 2000); // Poll every 2 seconds
        } catch (error) {
            console.error("Error polling for result:", error);
            setIsRunLoading(false); // Stop loading if error occurs
        }
    };

    // Run Code
    const handleRun = async () => {

        dispatch({
            type: "UPDATE_CONSOLE_OUTPUT",
            output: "loading..."
        });

        // setOutput("loading..."); // Set the console output to loading while request is made
        setIsRunLoading(true); // Start the loading state

        // // let current_user_code = codeStateTmpRef.current;
        let current_user_code = currentProblemState.code;

        // send request to run code
        _sendCodeExecutionRequest(current_user_code);

        let payload = {
            'question_id': state.question_id,
            'question_name': state.name,
            'question_text': state.question,
            'example_input_output_list': state.input_output_list,
            'lecture_question': state.lecture_question,
            'code': current_user_code,
            'user_id': null
        };

        const saveCodeResponse = await handleSaveUserCode(
            payload,
            dispatch, 
            isAuthenticated,
            userAccessToken,
            currentProblemState
        );

        if ('error' in saveCodeResponse){
            console.log('Could not save user code...');
        }
      
    };

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const _handleSubmitButtonClick = async () => {

        setIsSubmitLoading(true);
        let lecture_qid = currentProblemState.question_id;
        let code = currentProblemState.code;

        const solutionSubmitResponse = await handleAndSetSolutionSubmission(
            lecture_qid,
            code,
            userAccessToken,
            state,
            dispatch
        );

        if (solutionSubmitResponse['success'] != true){
            console.log('Error submitting solution:', solutionSubmitResponse);
        };

        setIsSubmitLoading(false);
        setActiveTab("submission");

    }


    const _handleProblemSetNextPartClick = async () => {

        const next_ps_part = state.problem_set_next_part;

        const problem_set_question_list = state.problem_set_question_list;
        
        const next_problem_set_data = problem_set_question_list[next_ps_part];

        // const current_pg_code = currentProblemState.code;
        // const current_question_code = next_problem_set_data['code'];

        // let new_pg_code = current_pg_code.trim() + '\n\n' + current_question_code + '\n\n';

        // TODO: refactor and consolidate this function and the set problem set to single place
        const current_pg_code = currentProblemState.code;

        // Update View
        dispatch({
            type: "SET_PROBLEM_SET_PLAYGROUND_STATE",

            question_id: next_problem_set_data['question_id'],
            name: next_problem_set_data['name'],
            question: next_problem_set_data['question'],
            input_output_list: next_problem_set_data['input_output_list'],
            code: current_pg_code,

            lecture_question: next_problem_set_data['lecture_question'],
            test_case_list: next_problem_set_data['test_case_list'],
            
            // submission history
            all_test_cases_passed: null,
            program_output_result: [],
            ai_tutor_feedback: null,
            user_code_submission_history_objects: next_problem_set_data['user_code_submission_history_objects'],

            next_lecture_number: next_problem_set_data['next_lecture_number'],
            next_question_object_id: next_problem_set_data['next_question_object_id'],

            problem_set_object_id: state.problem_set_object_id,
            problem_set_question: true,
            problem_set_current_part: next_problem_set_data['problem_set_current_part'],
            problem_set_next_part: next_problem_set_data['problem_set_next_part'],
            problem_set_question_list: problem_set_question_list
        });
        
    };

    // TODO: finalize problem set

    const _handleProblemSetLastPartClick = async () => {
        // TODO: in this case, only update the question and related, not the code

        const problem_set_question_list = state.problem_set_question_list;
        const last_ps_part = state.problem_set_current_part - 1;
        const last_problem_set_data = problem_set_question_list[last_ps_part];
        const current_pg_code = currentProblemState.code;

        // Update View
        dispatch({
            type: "SET_PROBLEM_SET_PLAYGROUND_STATE",

            question_id: last_problem_set_data['question_id'],
            name: last_problem_set_data['name'],
            question: last_problem_set_data['question'],
            input_output_list: last_problem_set_data['input_output_list'],
            code: current_pg_code,

            lecture_question: last_problem_set_data['lecture_question'],
            test_case_list: last_problem_set_data['test_case_list'],

            // submission history
            all_test_cases_passed: null,
            program_output_result: [],
            ai_tutor_feedback: null,
            user_code_submission_history_objects: last_problem_set_data['user_code_submission_history_objects'],

            next_lecture_number: last_problem_set_data['next_lecture_number'],
            next_question_object_id: last_problem_set_data['next_question_object_id'],

            problem_set_question: true,
            problem_set_current_part: last_problem_set_data['problem_set_current_part'],
            problem_set_next_part: last_problem_set_data['problem_set_next_part'],
            problem_set_question_list: problem_set_question_list
        });
    }


    return (

        <MathJaxContext>
    
            <MathJax>

                <div className="p-2 pl-4 pt-2">

                    <div className="mt-1 flex justify-between items-center  border-b-[1px] border-gray-300  w-full">

                        {state.lecture_question && (

                            isAuthenticated ? (
                                <div className="mt-0">
                                    <span className="text-[11.5px] text-gray-600 dark:text-gray-500">
                                        (Ctrl / Cmd) + S to save code | Submissions will take about 10-15 seconds.
                                    </span>
                                </div>
                            ) : (
                                
                                <div className="mt-0">
                                    <span className="text-[11.5px] text-gray-600 dark:text-gray-500">
                                    Make a {" "}
                                        <a
                                            className='text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                                            href="/api/auth/login"
                                        >
                                            free account
                                        </a> to submit and work on the lecture exercises!
                                    </span>
                                </div>
                               
                            )
                        )}

                        {/* Save Code Text */}
                        {/* <div className="mt-0">
                            <span className="text-[11.5px] text-gray-600 dark:text-gray-500">
                                Shortcut: (Ctrl / Cmd) + S to save code
                            </span>
                        </div> */}


                        {/* Button Div */}
                        <div className="space-x-2 text-right pb-2">
                            
                            {(isAuthenticated === true) ? (
                                
                                <button
                                    onClick={handleRun}
                                    disabled={isRunLoading}
                                    className={`w-[110px] py-2 text-[14px] text-white font-medium rounded-xl transition-all 
                                        ${isRunLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                    >
                                    {isRunLoading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                    ) : (
                                        <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                                    )}
                                    {isRunLoading ? "Running..." : "Run Code"}
                                </button>

                            ): (isAuthenticated === false && currentProblemState.lecture_question === false) ? (

                                <button
                                    onClick={handleRun}
                                    disabled={isRunLoading}
                                    className={`w-[110px] py-2 text-[14px] text-white font-medium rounded-xl transition-all 
                                        ${isRunLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                    >
                                    {isRunLoading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                    ) : (
                                        <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                                    )}
                                    {isRunLoading ? "Running..." : "Run Code"}
                                </button>

                            ) : (isAuthenticated === false && currentProblemState.lecture_question === true) ? (

                                <button
                                    onClick={handleRun}
                                    disabled={true}
                                    className={`w-[110px] py-2 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed`}
                                    >
                                    {isRunLoading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                    ) : (
                                        <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                                    )}
                                    {isRunLoading ? "Running..." : "Run Code"}
                                </button>

                            ): (null)
                            
                            }


                            {/* Run Code Button */}
                            {/* {(isAuthenticated === true) ? (

                                <button
                                    onClick={handleRun}
                                    disabled={isRunLoading}
                                    className={`w-[110px] py-2 text-[14px] text-white font-medium rounded-xl transition-all 
                                        ${isRunLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                    >
                                    {isRunLoading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                    ) : (
                                        <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                                    )}
                                    {isRunLoading ? "Running..." : "Run Code"}
                                </button>

                                ): (

                                <button
                                    onClick={handleRun}
                                    disabled={true}
                                    className={`w-[110px] py-2 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed`}
                                    >
                                    {isRunLoading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                    ) : (
                                        <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                                    )}
                                    {isRunLoading ? "Running..." : "Run Code"}
                                </button>
                            
                                )
                            } */}
                        

                            {/* Submit Solution Button */}
                            {/* {state.lecture_question ? (

                                isAuthenticated ? (
                                    <Button
                                        disabled={isSubmitLoading}    
                                        className="w-[130px] py-4 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-green-400 hover:bg-green-500"
                                        onClick={_handleSubmitButtonClick}
                                    >
                                        {isSubmitLoading ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                                Running...
                                            </>
                                        ) : (
                                            <>
                                                Submit Solution
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                    className="w-[130px] py-2 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed"
                                    disabled
                                    >
                                        Submit Solution
                                    </Button>
                                )

                            ): (

                                <Button
                                    disabled={true}
                                    className="bg-gray-400 text-gray-700 cursor-not-allowed" // Add disabled styles
                                >
                                    Run Test Cases (coming soon...)
                                </Button>

                            )} */}

                            {
                                state.lecture_question && state.problem_set_question ? (
                                    isAuthenticated ? (
                                    <Button
                                        disabled={isSubmitLoading}    
                                        className="w-[130px] py-4 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-green-400 hover:bg-green-500"
                                        onClick={_handleSubmitButtonClick}
                                    >
                                        {isSubmitLoading ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                            Running...
                                        </>
                                        ) : (
                                        <>Submit Part</>
                                        )}
                                    </Button>
                                    ) : (
                                    <Button
                                        className="w-[130px] py-2 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed"
                                        disabled
                                    >
                                        Submit Part
                                    </Button>
                                    )
                                ) : state.lecture_question ? (
                                    isAuthenticated ? (
                                    <Button
                                        disabled={isSubmitLoading}    
                                        className="w-[130px] py-4 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-green-400 hover:bg-green-500"
                                        onClick={_handleSubmitButtonClick}
                                    >
                                        {isSubmitLoading ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                            Running...
                                        </>
                                        ) : (
                                        <>Submit Solution</>
                                        )}
                                    </Button>
                                    ) : (
                                    <Button
                                        className="w-[130px] py-2 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed"
                                        disabled
                                    >
                                        Submit Solution
                                    </Button>
                                    )
                                ) : (
                                    <Button
                                    disabled={true}
                                    className="bg-gray-400 text-gray-700 cursor-not-allowed" // Add disabled styles
                                    >
                                    Run Test Cases (coming soon...)
                                    </Button>
                                )
                            }

                        </div>

                    </div>
                    
                    <div className="flex items-center pb-2 mt-4">
                        
                        {editing ? (

                            <input
                                type="text"
                                // value={currentProblemState.name}
                                value={questionName}
                                onChange={(e) => _handleQuestionNameChange(e)}
                                // className="bg-transparent border-b-2 border-gray-400 outline-none w-1/2 text-[16px]"
                                className="bg-transparent text-[15px] border-b-2 border-gray-300 outline-none w-3/4"
                                autoFocus
                            />

                        ):(
                            (state.problem_set_question === true) ? (

                                <>
                                    <h1 className="font-semibold text-[17px] mr-2">
                                        Question: {questionName}
                                    </h1>

                                    {/* {(state.problem_set_current_part > 0) && <span
                                        className="text-[13px] text-gray-700 hover:text-blue-400 cursor-pointer"
                                        onClick={_handleProblemSetLastPartClick}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="pl-1"/> Last Part
                                    </span>}

                                    {state.problem_set_next_part && <span
                                        className="text-[13px] text-gray-700 hover:text-blue-400 cursor-pointer pr-4"
                                        onClick={_handleProblemSetNextPartClick}
                                    >
                                        Next Part <FontAwesomeIcon icon={faArrowRight} className="pl-1"/>
                                    </span>} */}

                                    {/* Last / Next Part */}
                                    <div className="ml-4">
                                        {(state.problem_set_current_part > 0) && (
                                            <span
                                                className="text-[12px] text-blue-500 hover:text-blue-400 cursor-pointer pr-3"
                                                onClick={_handleProblemSetLastPartClick}
                                            >
                                                <FontAwesomeIcon icon={faArrowLeft} className="pr-1" /> Last Part
                                            </span>
                                        )}

                                        <span className="px-0"></span>
                                        {state.problem_set_next_part && (
                                            <span
                                                className="text-[12px] text-blue-500 hover:text-blue-400 cursor-pointer"
                                                onClick={_handleProblemSetNextPartClick}
                                            >
                                                Next Part <FontAwesomeIcon icon={faArrowRight} className="pl-1"/>
                                            </span>
                                        )}
                                    </div>

                                    {/* {(state['lecture_question'] !== true) && (
                                        <div className="flex space-x-4 mr-4">
                                            <span 
                                                className="text-[12px] text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-400 dark:hover:text-blue-400"
                                                onClick={(e) => _handleEditQuestion(e)}
                                            >
                                                <FontAwesomeIcon icon={faPencil} className="pr-1"/> 
                                                edit question
                                            </span>

                                        </div>
                                    )} */}
                                
                                </>

                            ) : (

                                <>
                                    <h1 className="font-semibold text-[17px] mr-2">
                                        Question: {questionName}
                                    </h1>

                                    {(state['lecture_question'] !== true) && (
                                        <div className="flex space-x-4 mr-4 ml-2">
                                            <span 
                                                className="text-[12px] text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-400 dark:hover:text-blue-400"
                                                onClick={(e) => _handleEditQuestion(e)}
                                            >
                                                <FontAwesomeIcon icon={faPencil} className="pr-1"/> 
                                                edit question
                                            </span>

                                        </div>
                                    )}
                                
                                </>

                            )
                            

                        )}
                      
                    </div>

                    {editing ? (

                        // <input
                        // type="text"
                        // value={currentProblemState.question}
                        // className="bg-transparent border-b-2 border-gray-400 outline-none w-1/2 text-[16px]"
                        // autoFocus
                        // />

                        // <textarea>{currentProblemState.question}</textarea>

                        <div className="flex flex-col items-end">

                            <textarea
                                // value={currentProblemState.question}
                                value={rawQuestionText}
                                className="mt-3 w-full text-[14px] flex-grow resize-y p-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                                placeholder="enter your question..."
                                rows={2}
                                style={{ minHeight: '70px', maxHeight: '140px' }}
                                onChange={(e) => _handleQuestionValueChange(e)}
                            />

                            <div className="mt-4 mr-2">
                                <Button
                                    onClick={_handleUpdateQuestionSubmit}
                                    className="text-[14px]"
                                >Update Question</Button>
                            </div>
                        
                        </div>
                        
                    ) : (

                        <p 
                            // className="px-1 pt-2 leading-7 text-[14px] text-gray-900 dark:text-gray-300"
                            className="px-1 pt-2 leading-7 text-[14px] text-gray-900 dark:text-gray-300 break-words whitespace-normal w-full max-w-[700px] overflow-x-auto"
                            dangerouslySetInnerHTML={{ __html: questionText }}
                        >
                            {/* {questionText} */}
                        </p>

                    )}

                    <div className="relative flex py-0 pt-4 pb-0 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-[15px]">Example I/O</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                    
                    <div className="text-center pb-0 pt-0 mb-0">
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">
                            Note: below are AI generated input/output examples and may not be completely accurate.
                        </span>
                    </div>

                    {inputOutputLoading ? (

                        <div className="flex flex-col items-center h-screen mt-6">
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Generating new examples...</p>
                        </div>

                    ): (

                        currentProblemIOList.length > 0 ? (
                            currentProblemIOList.map((item, idx) => {
                                return (
                                    <div className="pt-4 pb-2 dark:text-gray-300" key={idx}>
                                        <p className="font-semibold pb-2 text-[15px]">Example {idx}:</p>
                                        <div className="relative flex pl-4">
                                            <div className="absolute left-0 top-0 h-full w-[1.5px] bg-gray-400" />
                                            <div>
                                                <p className="pt-0 text-[14px]">
                                                    <span className="font-semibold pr-1">Input:</span>
                                                    {item.input}
                                                </p>
                                                <p className="pt-2 text-[14px]">
                                                    <span className="font-semibold pr-1">Output:</span>
                                                    {item.output}
                                                </p>
                                                <p className="pt-2 text-[14px]">
                                                    <span className="font-semibold pr-1">Explanation:</span>
                                                    {item.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                        
                            <p className="px-1 pt-6 leading-7 text-[14px] text-gray-900 dark:text-gray-300">
                                When you enter a new question (by clicking the edit question above), if applicable, expected input / output pairs will be generated and shown here...
                            </p>
                        )
    
                    )}

                </div>

            </MathJax>

        </MathJaxContext>

    );
    
};

export default ProblemLayout;