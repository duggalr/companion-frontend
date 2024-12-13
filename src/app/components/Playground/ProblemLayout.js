import axios from "axios";
import { useEffect, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPencil, faShuffle, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { usePlaygroundContext } from "../../../lib/hooks/usePlaygroundContext";
import useUserContext from '../../../lib/hooks/useUserContext';
import { saveOrUpdateUserQuestion } from "../../../lib/api/saveOrUpdateUserQuestion";
import { getFromLocalStorage, saveToLocalStorage } from "../../../lib/utils/localStorageUtils";
import { saveUserRunCode } from "../../../lib/api/saveUserRunCode";
import { getRandomInitialPlaygroundQuestion } from '../../../lib/api/getRandomInitialPlaygroundQuestion';
import { submitUserCode } from "../../../lib/api/submitUserCode";
import { saveUserCode } from "../../../lib/api/saveUserCode"


const ProblemLayout = ({ setActiveTab }) => {

    const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

    const playgroundContext = usePlaygroundContext();
    let currentProblemState = playgroundContext.state;

    const { isAuthenticated, userAccessToken } = useUserContext();
    const { state, dispatch } = usePlaygroundContext();

    const _handleShuffleQuestion = async () => {
        // dispatch({
        //     type: "SET_RANDOM_INITIAL_QUESTION",
        // });

        let current_user_id = getFromLocalStorage('user_id');
        let rnd_question_dict = await getRandomInitialPlaygroundQuestion(current_user_id);
        console.log('Random Question Dict:', rnd_question_dict);

        if (rnd_question_dict['success'] === true){

            let rnd_q_data = rnd_question_dict['data'];

            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: rnd_q_data['question_id'],
                name: rnd_q_data['name'],
                question: rnd_q_data['text'],
                input_output_list: rnd_q_data['example_io_list'],
                code: rnd_q_data['starter_code'],
            });
            
        }

    }

    const [editing, setEditing] = useState(false);
    const [questionName, setQuestionName] = useState("");
    const [questionText, setQuestionText] = useState("");
    
    const [inputOutputLoading, setInputOutputLoading] = useState(false);
    const [currentProblemIOList, setCurrentProblemIOList] = useState([]);

    useEffect(() => {

        console.log('PROBLEM STATE / QUESTIONS:', currentProblemState.input_output_list);
        setQuestionName(currentProblemState.name);
        setQuestionText(currentProblemState.question);
        setCurrentProblemIOList(currentProblemState.input_output_list);
    }, [currentProblemState])


    const _handleEditQuestion = (e) => {
        setEditing(true);
    }

    const _handleQuestionValueChange = (e) => {
        setQuestionText(e.target.value);
    }

    const _handleQuestionNameChange = (e) => {
        setQuestionName(e.target.value);
    }

    const _handleUpdateQuestionSubmit = async () => {

        // TODO: assuming anon case

        setEditing(false);
        setInputOutputLoading(true);
        let current_question_id = currentProblemState.question_id;
        let current_q_name = questionName;
        let current_q_text = questionText;

        if (isAuthenticated) {
            
            // userAccessToken
            // TODO:
            


        } else {  // TODO: need to update anon case as reducer is no longer using local-storage; should be handled outside of there
    
            let current_anon_user_id = getFromLocalStorage("user_id");
            console.log('current_anon_user_id:', current_anon_user_id);
    
            let response_data = await saveOrUpdateUserQuestion(
                current_anon_user_id, current_question_id, current_q_name, current_q_text
            );
            console.log('response_data:', response_data);
    
            // let response_data = await generateQuestionTestCases(current_q_name, current_q_text);
            // // console.log('response_data:', response_data);
    
            if (response_data['success'] === true){
                let example_io_list = JSON.parse(response_data['example_io_list']);
    
                setCurrentProblemIOList(example_io_list);
                setInputOutputLoading(false);
    
                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: response_data['unique_question_id'],
                    name: response_data['question_name'],
                    question: response_data['question_text'],
                    input_output_list: example_io_list,
                    code: currentProblemState.code
                });
    
                // let model_resp_array = response_data['model_response'];
                // setCurrentProblemIOList(model_resp_array);
                // setInputOutputLoading(false);
    
                // dispatch({
                //     type: "SET_QUESTION_INPUT_OUTPUT",
                //     name: current_q_name,
                //     question: current_q_text,
                //     input_output_list: model_resp_array,
                //     code: currentProblemState.code
                // });
            }

        }

    }

    const [isRunLoading, setIsRunLoading] = useState(false);

    const _sendCodeExecutionRequest = async function (code) {
        try {
            const payload = {
                language: "python",
                code: code,
            };
            
            // TODO:
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
            // console.log('Result Output Value:', result_output_value);
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


    const _saveUserCodeInBackend = async (current_code) => {

        let current_user_id = getFromLocalStorage("user_id");
        let current_parent_playground_object_id = getFromLocalStorage("parent_playground_object_id");

        // // TODO: need to update
        // let user_id = localStorage.getItem("user_id");
        // // let current_code_state = localStorage.getItem("user_generated_code");
        // let user_programming_language = localStorage.getItem("user_programming_language");
        // let current_code_state = JSON.parse(localStorage.getItem("user_generated_code_dict"))[user_programming_language];
        // let current_parent_playground_object_id = localStorage.getItem("parent_playground_object_id");
  
        let payload;
        if (current_parent_playground_object_id !== null){
            payload = {
                user_id: current_user_id,
                programming_language: "python",
                code_state: current_code,
                parent_playground_object_id: current_parent_playground_object_id
            };
        } else {
            payload = {
                user_id: current_user_id,
                programming_language: "python",
                code_state: current_code,
            };
        }

        let saveCodeRes = await saveUserRunCode(
            null,
            payload
        );
        
        console.log('saved-code-response:', saveCodeRes);

        if (saveCodeRes['status_code'] === 200){

            let parent_playground_object_id = saveCodeRes['parent_playground_object_id'];
            saveToLocalStorage("parent_playground_object_id", parent_playground_object_id);

        }

    }

    // Run Code
    const handleRun = () => {

        // dispatch({
        //     type: "SET_QUESTION_INPUT_OUTPUT",
        //     name: current_q_name,
        //     question: current_q_text,
        //     input_output_list: model_resp_array,
        //     code: currentProblemState.code
        // });
        
        dispatch({
            type: "UPDATE_CONSOLE_OUTPUT",
            output: "loading..."
        });

        // setOutput("loading..."); // Set the console output to loading while request is made
        setIsRunLoading(true); // Start the loading state

        // // let current_user_code = codeStateTmpRef.current;
        let current_user_code = currentProblemState.code;
    
        console.log('current code:', current_user_code);

        // send request to run code
        _sendCodeExecutionRequest(current_user_code);
    
        // // save user code
        // _sendCodeSaveRequest();

        // anon case - code saving
        if (!isAuthenticated) {

            dispatch({
                type: "UPDATE_CODE_STATE",
                code: current_user_code,
            });

            // _saveUserCodeInBackend(current_user_code);

            // TODO: so much abstraction/refactoring possible due to duplicate code possible in the utils functions, fetch responses and backend...
            let anon_user_id = getFromLocalStorage("user_id");
            console.log('current-user-id:', anon_user_id);

            let payload = {
                'user_id': anon_user_id,
                'question_id': state.question_id,
                'code': current_user_code
            }
            saveUserCode(null, payload);

        }
      
    };

    // Submit Code
    const submitCode = async () => {

        console.log('submit code');
        let current_parent_playground_object_id = getFromLocalStorage("parent_playground_object_id");
        let current_user_code = currentProblemState.code;
        let unique_question_id = currentProblemState.question_id;

        // TODO: get current qid and then, start here

        let d = {
            'current_pg_object_id': current_parent_playground_object_id,
            'current_user_code': current_user_code,
            'unique_question_id': unique_question_id
        }
        // TODO:
            // Submit to backend
                // First save code
                // Then implement function to execute tests
                // Go from there

        submitUserCode(d);
        // TODO: get results and svae them in playground state --> redirect to submission-component and go from there

    }

    // Chat with Tutor
    const chatWithTutor = () => {
        console.log('set-active', setActiveTab)
        setActiveTab("chat");
    }


    return (

        <MathJaxContext>
    
            <MathJax>

                <div className="p-2 pl-4 pt-4">

                    {/* <Button>Random Question</Button> */}

                    <div className="flex items-center justify-between pb-2">
                        
                        {editing ? (

                            <input
                                type="text"
                                // value={currentProblemState.name}
                                value={questionName}
                                onChange={(e) => _handleQuestionNameChange(e)}
                                // className="bg-transparent border-b-2 border-gray-400 outline-none w-1/2 text-[16px]"
                                className="bg-transparent text-[15px] border-b-2 border-gray-300 outline-none w-1/2"
                                autoFocus
                            />

                        ):(
                            
                            <>
                                <h1 className="font-semibold text-[17px] mr-2">
                                    Question: {questionName}
                                </h1>

                                <div className="flex space-x-4 mr-4">
                                    <span 
                                        className="text-[12px] text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-400 dark:hover:text-blue-400"
                                        onClick={(e) => _handleEditQuestion(e)}
                                    >
                                        <FontAwesomeIcon icon={faPencil} className="pr-1"/> 
                                        edit question
                                    </span>
                                    <span
                                        onClick={_handleShuffleQuestion}
                                        className="text-[12px] text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-400 dark:hover:text-blue-400">
                                        <FontAwesomeIcon icon={faShuffle} className="pr-1"/>
                                        shuffle question
                                    </span>
                                </div>
                            
                            </>

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
                                value={questionText}
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
                        
                        <p className="px-1 pt-2 leading-7 text-[14px] text-gray-900 dark:text-gray-300">
                            {questionText}
                        </p>

                    )}
                    
 
                    <div class="relative flex py-0 pt-4 pb-0 items-center">
                        <div class="flex-grow border-t border-gray-400"></div>
                        <span class="flex-shrink mx-4 text-gray-400 text-[15px]">Example I/O</span>
                        <div class="flex-grow border-t border-gray-400"></div>
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
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Loading examples...</p>
                        </div>

                    ): (

                        currentProblemIOList.map((item, idx) => {
                        
                            return (
                                <div className="pt-4 pb-2 dark:text-gray-300">
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
                            )
    
                        })
    
                    )}

                    
                    <div className="space-x-2 pt-10">
                        {/* TODO: */}
                        {/* <Button>Run Code</Button> */}

                        {/* Run Code Button */}
                        <button
                            onClick={handleRun}
                            disabled={isRunLoading}
                            className={`w-[110px] py-2 text-[14px] text-white font-medium rounded-xl transition-all 
                                ${isRunLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                            >
                            {isRunLoading ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                            ) : (
                                <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                            )}
                            {isRunLoading ? "Running..." : "Run Code"}
                        </button>
                        
                        {/* TODO: on feedback click -> route to tutor with message populated */}
                        {/* <Button
                            // onClick={submitCode}
                        >Get Feedback</Button> */}
                        
                        <Button
                            onClick={chatWithTutor}
                        >
                            Chat with Tutor
                        </Button>

                        <Button
                            // onClick={submitCode}
                            disabled={true} // Disable the button
                            className="bg-gray-400 text-gray-700 cursor-not-allowed" // Add disabled styles
                        >
                            Run Test Cases (coming soon...)
                        </Button>
                    </div>

                </div>

            </MathJax>

        </MathJaxContext>

    );
    
};

export default ProblemLayout;