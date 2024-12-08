import { useEffect, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPencil, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { usePlaygroundContext } from "../../../lib/hooks/usePlaygroundContext";
import { generateQuestionTestCases } from "../../../lib/api/generateQuestionTestCases";


const ProblemLayout = ({}) => {

    const playgroundContext = usePlaygroundContext();
    let currentProblemState = playgroundContext.state;

    const { state, dispatch } = usePlaygroundContext();

    const _handleShuffleQuestion = () => {
        dispatch({
            type: "SET_RANDOM_INITIAL_QUESTION",
        });
    }

    const [editing, setEditing] = useState(false);
    const [questionName, setQuestionName] = useState("");
    const [questionText, setQuestionText] = useState("");
    
    const [inputOutputLoading, setInputOutputLoading] = useState(false);
    const [currentProblemIOList, setCurrentProblemIOList] = useState([]);
    

    useEffect(() => {
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

    // const {
    //     sendMessage,
    //     messages,
    //     generatedMessage,
    //     isGeneratingMessage,
    //     isLoading
    // } = useWebSocket(WEBSOCKET_URL);

    const _handleUpdateQuestionSubmit = async () => {

        console.log('testing...')

        setEditing(false);
        setInputOutputLoading(true);

        let current_q_name = questionName;
        let current_q_text = questionText;
        
        console.log(current_q_name, current_q_text);

        let response_data = await generateQuestionTestCases(current_q_name, current_q_text);
        console.log('response_data:', response_data);

        if (response_data['success'] === true){
            let model_resp_array = response_data['model_response'];
            setCurrentProblemIOList(model_resp_array);
            setInputOutputLoading(false);
        }

        // // send data to backend to generate testcases --> send via websocket
        //     // with specific message and on "type   "

        // let d = {
        //     'type': 'generate_test_case',
        //     'question_name': current_q_name,
        //     'question_text': current_q_text,
        // }

        // sendMessage(JSON.stringify(d));

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
                                        </div>
                                    </div>
                                </div>
                            )
    
                        })
    

                    )}

                    
                    <div className="space-x-2 pt-10">
                        <Button>Run Code</Button>
                        <Button>Chat with Tutor</Button>
                        <Button>Get Time Complexity</Button>
                    </div>

                </div>

            </MathJax>

        </MathJaxContext>

    );
    
};

export default ProblemLayout;