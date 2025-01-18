import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlay, faComment, faXmark, faQuestion } from "@fortawesome/free-solid-svg-icons";
import Markdown from 'react-markdown';
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';
import DashboardTopNavBar from "@/app/components/Experimental/DashboardTopNavBar";
import NoteLayout from "@/app/components/Experimental/SubModuleComponents/NoteLayout";

import Monaco from "@monaco-editor/react";


const NewModuleLayout = ({ module_id }) => {

    const [currentSubModuleParentIndex, setCurrentSubModuleParentIndex] = useState(0);
    const [currentModuleInformationDict, setCurrentModuleInformationDict] = useState({});
    const [currentSubModuleList, setCurrentSubModuleList] = useState([]);
    const [currentSubModuleDict, setCurrentSubModuleDict] = useState({});
    const [currentSubModuleInformationList, setCurrentSubModuleInformationList] = useState([]);
    const [currentSubModuleInformationIndex, setCurrentSubModuleInformationIndex] = useState(0);

    const [currentActiveTab, setCurrentActiveTab] = useState('note');
    const [currentNoteText, setCurrentNoteText] = useState("");
    const currentNoteTyping =useRef(false);
    const [showIntroductionNote, setShowIntroductionNote] = useState(false);

    const [showCodeLayout, setShowCodeLayout] = useState(false);
    const [showExampleButton, setShowExampleButton] = useState(true);
    const [showExample, setShowExample] = useState(false);
    const [exampleDict, setExampleDict] = useState({});


    const _createTypewriterEffect = (text, set_text_fn, current_index, text_type) => {

        if (current_index < text.length) {

            // Delay the typing effect by 20ms
            setTimeout(() => {

                // Append the next character from text
                set_text_fn(previousText => previousText + text[current_index]);
    
                // Recursive call with the next index
                _createTypewriterEffect(text, set_text_fn, current_index + 1, text_type);  
                
            }, 1);

        } else {

            if (text_type === 'show_example_button'){
                setShowExampleButton(true);
            }
            // else if (text_type === 'show_try_exercise_button'){
            //     // TODO:
            //     setShowTryExerciseButton(true);
            // } else if (text_type === 'show_submit_button'){
            //     setShowSubmitExerciseButton(true);
            // }

        }

    };

    const _handleCourseModuleDetails = async (module_id) => {

        let anon_user_id = getFromLocalStorage('user_id');
        const payload = {
            'user_id': anon_user_id,
            'course_module_object_id': module_id
        };

        const apiResponse = await fetch(`http://127.0.0.1:8000/fetch_course_module_details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const response_data = await apiResponse.json();
        console.log('Response Data:', response_data);

        if (response_data['success'] === true){

            // TODO: can modify here to start where user did not complete submission when logic implemented...
            let current_sub_module_index = 0;
            let current_module_dict = response_data.module_dict;
            let current_sub_module_list = current_module_dict.sub_modules_list
            let current_sub_module_dict = current_sub_module_list[current_sub_module_index];
            let current_sub_module_information_list = current_sub_module_dict['note_information_list'];
            let current_sub_module_information_index = 0;

            console.log('current_sub_module_dict', current_sub_module_dict);

            setCurrentSubModuleParentIndex(current_sub_module_index);
            setCurrentModuleInformationDict(current_module_dict);

            setCurrentSubModuleList(current_sub_module_list);
            setCurrentSubModuleDict(current_sub_module_dict);

            setCurrentSubModuleInformationList(current_sub_module_information_list);
            setCurrentSubModuleInformationIndex(current_sub_module_information_index);

            setShowIntroductionNote(true);
            
            // TODO: show "see example" button and implement logic + ui from there
            if (currentNoteTyping.current === false){
                currentNoteTyping.current = true;
                _createTypewriterEffect(
                    current_sub_module_dict.introduction_note,
                    setCurrentNoteText, 
                    0, 
                    'show_example_button'
                );
            }
            
        }

    };

    const _handleNextInformationModuleClick = async () => {
        
        // by default, this will be false since proceeding to next information-dict in sub-module
        setShowIntroductionNote(false);

        let new_sub_module_information_index;
        let new_sub_module_information_dict;
        if (showIntroductionNote === true) {  // starting at first example
            setShowIntroductionNote(false);
            new_sub_module_information_index = 0;
            new_sub_module_information_dict = currentSubModuleInformationList[new_sub_module_information_index]
        }
        else {
            new_sub_module_information_index = currentSubModuleInformationIndex + 1;
            new_sub_module_information_dict = currentSubModuleInformationList[new_sub_module_information_index];
            console.log('new_sub_module_information_dict', new_sub_module_information_dict);
        }

        if (new_sub_module_information_dict['type'] === 'example'){            
            setShowExampleButton(false);
            setExampleDict(new_sub_module_information_dict);
            setShowCodeLayout(true);
            setShowExample(true);

            // _createTypewriterEffect(
            //     current_sub_module_dict.introduction_note,
            //     setCurrentNoteText, 
            //     0, 
            //     'show_example_button'
            // );

        }

        // // setCurrentSubModuleInformationIndex((prev) => prev + 1);
        // // let current_sub_module_index = 0;
        // // let current_module_dict = response_data.module_dict;
        // // let current_sub_module_list = current_module_dict.sub_modules_list
        // // let current_sub_module_dict = current_sub_module_list[current_sub_module_index];
        // // let current_sub_module_information_list = current_sub_module_dict['note_information_list'];
        // // let current_sub_module_information_index = 0;

        // // console.log('current_sub_module_dict', current_sub_module_dict);

        // // setCurrentSubModuleParentIndex(current_sub_module_index);
        // // setCurrentModuleInformationDict(current_module_dict);

        // // setCurrentSubModuleList(current_sub_module_list);
        // // setCurrentSubModuleDict(current_sub_module_dict);

        // // setCurrentSubModuleInformationList(current_sub_module_information_list);
        // // setCurrentSubModuleInformationIndex(current_sub_module_information_index);

        // // _showExample();

    };

    useEffect(() => {

        // TODO:
        console.log('MODULE ID:', module_id);
        _handleCourseModuleDetails(module_id);
        // setShowCodeLayout(true);

    }, []);

    
    const [consoleOutput, setConsoleOutput] = useState('>>> Console Output');
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor; // Keep a reference to the editor
    };

    const _handleRunButtonClick = async () => {

        // TODO:
            // add user input (input())

        console.log('run button click...');
        setConsoleOutput('console output...');

    }


    return (

        // TODO: fix layout / proceed from there
        <>
            
            {/* Dashboard Top NavBar */}
            <DashboardTopNavBar />
        
            {/* Module Layout */}
            {/* <div className="flex flex-col min-h-screen mt-12 ml-44"> */}

            <div className="flex flex-col min-h-screen mt-4">

                {/* Top Header */}
                <div className="flex justify-between max-w-5xl py-2 border-b border-gray-300 w-full mx-auto">

                    {/* Current Chapter and Title */}
                    <div className="text-left flex text-[15.5px] tracking-normal">
                        <h1 className="font-semibold text-gray-900">
                            Module: {currentModuleInformationDict.course_module_name}
                        </h1>
                        <span className="px-2">|</span>
                        <p className="text-gray-500 text-[13.5px] pt-[2.2px]">
                            Sub Module 1: {currentSubModuleDict.sub_module_name}
                        </p>
                    </div>

                    {/* Next Chapter */}
                    <div className="text-right flex text-[12.5px] tracking-normal pb-0 py-1">
                        <h1 className="text-gray-400 hover:text-blue-400 cursor-pointer">
                            Skip and Take Final Module Quiz
                        </h1>
                    </div>

                </div>

                {/* Layout - Note + Code */}

                {/* max-w-[1020px] */}
                <div className="flex flex-grow py-0">

                    {/* First Half */}
                    <div 
                        className={`p-0 pt-0 ${(showExample === true) ? "w-1/2" : "w-5/6"}`}
                    >

                        <div className="space-y-4 mt-3">
                            
                            {
                                (showExample === true)
                                ?
                                (

                                    <>
                                        <div
                                            className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-0 w-2/3 ml-52"
                                        >
                                            
                                            <ul className="flex flex-wrap -mb-px">

                                                <li className="me-2">
                                                    <a
                                                        className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg cursor-pointer ${
                                                            (currentActiveTab === 'note')
                                                            ? 'text-blue-600 border-blue-600 font-bold dark:text-blue-500 dark:border-blue-500'
                                                            : 'text-gray-600 border-transparent dark:text-gray-400'
                                                        }`}
                                                        aria-current={currentActiveTab ? 'page' : undefined}
                                                        onClick={() => setCurrentActiveTab('note')}
                                                    >
                                                        Example
                                                    </a>
                                                </li>

                                                {/* <li className="me-2">
                                                    <a
                                                        href="#"
                                                        className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg cursor-pointer ${
                                                            (currentActiveTab === 'challenge')
                                                            ? 'text-blue-600 border-blue-600 font-bold dark:text-blue-500 dark:border-blue-500'
                                                            : 'text-gray-600 border-transparent dark:text-gray-400'
                                                        }`}
                                                        aria-current={currentActiveTab ? 'page' : undefined}
                                                        onClick={() => setCurrentActiveTab('challenge')}
                                                    >
                                                        Challenge
                                                    </a>
                                                </li> */}

                                            </ul>

                                        </div>

                                        <p className="text-[15px] tracking-normal leading-9 pt-0 pr-0 px-[210px]">
                                            {(showIntroductionNote === true) && (<h3 className="font-bold text-[16px] mb-2">
                                                Introduction
                                            </h3>)}
                                            <Markdown>
                                                {/* {currentSubModuleDict.introduction_note} */}
                                                {exampleDict.description}
                                            </Markdown>
                                        </p>


                                    </>
                                    

                                )
                                :
                                (
                                 
                                    <div>
                                        <p className="text-[15px] tracking-normal leading-9 pt-2 pr-0 px-[210px]">
                                            <h3 className="font-bold text-[16px] mb-2">
                                                Introduction - {currentSubModuleDict.sub_module_name}
                                            </h3>
                                            <Markdown>
                                                {/* {currentSubModuleDict.introduction_note} */}
                                                {currentNoteText}
                                            </Markdown>
                                        </p>

                                        {/* Buttons */}
                                        <div className="mt-10 flex items-center justify-center ml-52">

                                                {/* Example Button */}
                                                {(showExampleButton === true) && (
                                                    <button
                                                        type="button"
                                                        className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-[14.5px] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                        onClick={_handleNextInformationModuleClick}
                                                    >
                                                        Show Me An Example
                                                        <FontAwesomeIcon icon={faArrowRight} className="pl-2 pt-1" />
                                                    </button>
                                                )}
                                        </div>

                                    </div>

                                    
                                )
                            
                            }

                        </div>

                    </div>


                    {/* Second Half */}

                    {
                        (showExample === true) && (

                            <div className="w-1/2 mt-2 flex flex-col pt-0 border-l-2 border-gray-50">

                                <div className="flex-grow p-0 pt-0 pb-0 pl-4">
                                    
                                    <div className="flex justify-between">
                                        <h2 className="text-[18px] font-semibold text-gray-800 mb-0 pl-1 pt-1">
                                            Code
                                        </h2>
                                        <button
                                            type="button"
                                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-[13.5px] px-3 py-2 me-0 mb-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                            onClick={_handleRunButtonClick}
                                        >
                                            <FontAwesomeIcon icon={faPlay} className="pl-1 pr-1 text-[12px]"/>{" "}Run
                                        </button>

                                    </div>
                                    
                                    <div className="h-[450px]">
                                        <Monaco
                                            height="100%"
                                            defaultLanguage="python" // Set language to Python
                                            defaultValue={`# Write your Python code here\n\nprint("Hello, World!")`}
                                            onMount={handleEditorDidMount}
                                            theme="vs-dark"
                                            options={{
                                                fontSize: 14,
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false,
                                            }}
                                        />
                                    </div>

                                    <div className="flex-grow p-0 pt-4">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Console Output</h2>
                                        <div className="h-40 overflow-auto bg-black text-green-500 p-2 rounded-md font-mono text-sm">{consoleOutput}</div>
                                    </div>

                                </div>
                            
                            </div>

                        )
                    }

                </div>

            </div>

        </>

    )

};

export default NewModuleLayout;