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
    const [showExampleButton, setShowExampleButton] = useState(false);
    const [showExample, setShowExample] = useState(false);
    const [exampleDict, setExampleDict] = useState({});
    const [initialCodeValue, setInitialCodeValue] = useState("");

    const [showTryChallenge, setShowTryChallenge] = useState(false);
    const [showTryExerciseButton, setShowTryExerciseButton] = useState(false);
    const [currentTryExerciseText, setCurrentTryExerciseText] = useState('');
    const [currentChallengeDict, setCurrentChallengeDict] = useState({});
    const [showSubmitExerciseButton, setShowSubmitExerciseButton] = useState(false);
    const [submissionFeedback, setSubmissionFeedback] = useState('');
    const [showNextModuleDictButton, setShowNextModuleDictButton] = useState(false);


    const _createTypewriterEffect = (text, set_text_fn, current_index, text_type, timeout_milliseconds) => {

        if (current_index < text.length) {

            // Delay the typing effect by 20ms
            setTimeout(() => {

                // Append the next character from text
                set_text_fn(previousText => previousText + text[current_index]);
    
                // Recursive call with the next index
                _createTypewriterEffect(text, set_text_fn, current_index + 1, text_type);  
                
            }, timeout_milliseconds);

        } else {

            if (text_type === 'show_example_button'){
                setShowExampleButton(true);
            }
            else if (text_type === 'show_try_exercise_button'){
                // TODO:
                setShowTryExerciseButton(true);
            }
            else if (text_type === 'show_submit_button'){
                setShowSubmitExerciseButton(true);
            }

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
                    'show_example_button',
                    1
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
            new_sub_module_information_dict = currentSubModuleInformationList[new_sub_module_information_index];
        }
        else {
            new_sub_module_information_index = currentSubModuleInformationIndex + 1;
            new_sub_module_information_dict = currentSubModuleInformationList[new_sub_module_information_index];
            console.log('new_sub_module_information_dict-other', new_sub_module_information_dict);
        }

        if (new_sub_module_information_dict['type'] === 'example'){            
            setShowExampleButton(false);
            setExampleDict(new_sub_module_information_dict);
            setShowCodeLayout(true);
            setShowExample(true);

            console.log('new-module-info-dictionary:', new_sub_module_information_dict);
            console.log('new-module-info-CODE-NEW:', new_sub_module_information_dict.code);

            _createTypewriterEffect(
                new_sub_module_information_dict.code,
                setInitialCodeValue, 
                0, 
                'show_try_exercise_button',
                100
            );
        }

        else if (new_sub_module_information_dict['type'] === 'exercise'){

            console.log('new-module-info-dictionary-EXERCISE:', new_sub_module_information_dict);

            setShowExample(false);
            setShowExampleButton(false);

            setShowTryChallenge(true);
            setShowCodeLayout(true);
            setCurrentActiveTab('challenge');
            
            setShowTryExerciseButton(false);

            setCurrentChallengeDict(new_sub_module_information_dict);
            _createTypewriterEffect(
                new_sub_module_information_dict.question,
                setCurrentTryExerciseText,
                0, 
                'show_submit_button',
                100
            );
            
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

    

    const _handleBtnExerciseSolutionSubmitClick = async () => {

        // TODO:
            // implement backend / frontend logic here

        console.log('exercise solution submit...');
        setConsoleOutput('>>> solution submitted...');
        setSubmissionFeedback('Sample Submission Feedback... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem dui, aliquet at leo vehicula, porttitor ornare quam.');

        setShowSubmitExerciseButton(false);
        setShowNextModuleDictButton(true);

    }


    return (

        // TODO: fix layout / proceed from there
        <>
            
            {/* Dashboard Top NavBar */}
            <DashboardTopNavBar />
        
            {/* Module Layout */}
            {/* <div className="flex flex-col min-h-screen mt-12 ml-44"> */}
            {/* <div className="flex flex-col min-h-screen mt-4"> */}
            {/* <div className="flex flex-col items-start mt-8 mx-auto w-[80%] sm:w-[80%]"> */}
            <div className="flex flex-col items-start mt-8 mx-auto w-[80%] sm:w-[80%]">

                {/* Top Header */}
                <div className="flex justify-between py-2 border-b border-gray-300 w-full mx-auto">

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
                <div className="flex py-0">

                    {/* First Half */}
                    <div 
                        className="p-0 pt-2 w-full"
                    >

                        <div className="space-y-4 mt-3 w-full">
                            
                            {
                                ((showExample === true) || (showTryChallenge === true))

                                ?

                                (

                                    <>
                                        <div
                                            className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-0 w-full min-w-[500px]"
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
                                                
                                                {
                                                    (showTryChallenge === true) && (

                                                        <li className="me-2">
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
                                                        </li>
                                                                
                                                    )
                                                }

                                            </ul>

                                        </div>

                                        {/* Note */}
                                        {(currentActiveTab === 'note') && (

                                            <p className="text-[15px] tracking-normal leading-9 pt-0 pr-0">

                                                <h3 className="font-bold text-[15px] mb-2">
                                                    Example Title
                                                </h3>

                                                <Markdown>
                                                    {/* {currentSubModuleDict.introduction_note} */}
                                                    {/* TODO: show this and Code in Type-writer manner */}
                                                    {exampleDict.description}
                                                </Markdown>
                                            </p>

                                        )}

                                        {/* Challenge */}
                                        {(currentActiveTab === 'challenge') && (

                                            <div className="space-y-4 pr-2">
                                                <div>

                                                <p className="text-[16px] font-bold pt-2">
                                                    Question
                                                </p>
                                                    <p className="text-[15px] tracking-normal leading-9 pt-4 text-gray-500">
                                                        {/* <TypeWriter text={noteDict.description} /> */}
                                                        <Markdown>
                                                            {currentTryExerciseText}
                                                        </Markdown>
                                                    </p>
                                                </div>

                                                {/* Example Input Output List */}
                                                {/* TODO: showing example i/o list */}

                                                {/* <p className='text-[16px] font-bold pb-2'>Submissions</p> */}                        

                                                <p className="text-[16px] font-bold pt-4">
                                                    Current Solution Feedback
                                                </p>
                                                <p className="leading-9 text-[15px] text-gray-500">
                                                    {(submissionFeedback.length === 0) && "Write your code and submit your solution to finish the exercise."}
                                                    {submissionFeedback}
                                                </p>

                                                <p className="text-[16px] font-bold pt-4">
                                                    Past Submissions
                                                </p>

                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th scope="col" className="px-2 py-3">
                                                                Date
                                                            </th>
                                                            <th scope="col" className="px-2 py-3">
                                                                Passed
                                                            </th>
                                                            <th scope="col" className="px-2 py-3">
                                                                Code
                                                            </th>
                                                            <th scope="col" className="px-2 py-3">
                                                                AI Feedback
                                                            </th>                            
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                        >
                                                            <td className="p-3">
                                                                2025-01-10
                                                            </td>
                                                            
                                                            <td
                                                                className="p-3 text-green-400"
                                                            >
                                                                Success
                                                            </td>
                                                            <td 
                                                                className="p-3"
                                                            >
                                                                <span 
                                                                    className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                                                >
                                                                    View Code
                                                                </span>
                                                            </td>

                                                            <td 
                                                                className="p-3"
                                                            >
                                                                <span 
                                                                    className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                                                >
                                                                    View Feedback
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>

                                        )}

                                        <div >
                                            {(showTryExerciseButton === true) && (
                                                <button
                                                    type="button"
                                                    className="py-2.5 px-5 me-2 mb-2 mt-4 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                    onClick={_handleNextInformationModuleClick}
                                                >
                                                    Proceed
                                                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                                                </button>
                                            )}

                                            {(showSubmitExerciseButton === true) && (
                                                <button
                                                    type="button"
                                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                    onClick={_handleBtnExerciseSolutionSubmitClick}
                                                >Submit Solution</button>
                                            )}

                                            {(showNextModuleDictButton === true) && (
                                                <button
                                                    type="button"
                                                    className="py-2.5 px-5 me-2 mb-2 mt-4 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                    onClick={_handleNextInformationModuleClick}
                                                >
                                                    Proceed
                                                    <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                                                </button>
                                            )}

                                        </div>
                                    </>
                                    
                                )

                                :

                                (
                                    
                                    <div>
                                        <p className="text-[15px] tracking-normal leading-9 pt-2 pr-0 px-2">
                                            <h3 className="font-bold text-[16px] mb-2">
                                                Introduction - {currentSubModuleDict.sub_module_name}
                                            </h3>
                                            <Markdown>
                                                {/* {currentSubModuleDict.introduction_note} */}
                                                {currentNoteText}
                                            </Markdown>
                                        </p>

                                        {/* Buttons */}
                                        <div className="mt-10 flex justify-center">

                                            {(showExampleButton === true) && (
                                                <button
                                                    type="button"
                                                    className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-[14.5px] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                    onClick={_handleNextInformationModuleClick}
                                                >
                                                    Proceed
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
                        ((showExample === true) || (showTryChallenge === true)) && (

                            <div className="w-full min-w-[650px] mt-3 flex flex-col pt-0 border-l-2 border-gray-50">

                                <div className="flex-grow p-0 pt-0 pb-0 pl-4">
                                    
                                    <div className="flex justify-between">
                                        <h2 className="text-[18px] font-semibold text-gray-800 mb-0 pl-1 pt-1">
                                            Code
                                        </h2>
                                        <div className='flex justify-end space-x-4'>
                                            <button
                                                type="button"
                                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-[13.5px] px-3 py-2 me-0 mb-2 mt-0.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                                onClick={_handleRunButtonClick}
                                            >
                                                <FontAwesomeIcon icon={faPlay} className="pl-1 pr-1 text-[14px]"/>{" "}Run Code
                                            </button>

                                            {/* {(showTryChallenge === true) && (
                                                 <button
                                                    type="button"
                                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                >Submit Solution</button>
                                            )} */}
                                        
                                        </div>
                                     
                                    </div>
                                    
                                    <div className="h-[450px]">
                                        <Monaco
                                            height="100%"
                                            defaultLanguage="python" // Set language to Python
                                            // defaultValue={`# Write your Python code here\n\nprint("Hello, World!")`}
                                            value={initialCodeValue}
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
                                        {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">Console Output</h2> */}
                                        <h2 className="text-[18px] font-semibold text-gray-800 mb-2">
                                            Console Output
                                        </h2>
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