import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlay, faSpinner, faComment, faXmark, faQuestion } from "@fortawesome/free-solid-svg-icons";
import Markdown from 'react-markdown';
import confetti from "canvas-confetti";
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';
import DashboardTopNavBar from "@/app/components/Experimental/DashboardTopNavBar";
import NoteLayout from "@/app/components/Experimental/SubModuleComponents/NoteLayout";
import { Progress } from "@/components/ui/progress";

import Monaco from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import axios from "axios";


const NewModuleLayout = ({ module_id }) => {

    const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

    const [currentSubModuleParentIndex, setCurrentSubModuleParentIndex] = useState(0);
    const [currentModuleInformationDict, setCurrentModuleInformationDict] = useState({});
    const [currentSubModuleList, setCurrentSubModuleList] = useState([]);
    const [currentSubModuleDict, setCurrentSubModuleDict] = useState({});
    const [currentSubModuleInformationList, setCurrentSubModuleInformationList] = useState([]);
    // const [currentSubModuleInformationIndex, setCurrentSubModuleInformationIndex] = useState(0);
    const currentSubModuleInformationIndex = useRef(0);

    const [currentActiveTab, setCurrentActiveTab] = useState('note');
    const [currentNoteText, setCurrentNoteText] = useState("");
    const currentNoteTyping = useRef(false);
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

    const [currentSubModuleProgressDict, setCurrentSubModuleProgressDict] = useState({});
    const [currentSubModuleInformationListProgress, setCurrentSubModuleInformationListProgress] = useState({});
    const [currentSubModuleInformationElementObjectId, setCurrentSubModuleInformationElementObjectId] = useState(null);


    const nextStudentCourseModuleObjectId = useRef(null);

    const [nextSubModuleName, setNextSubModuleName] = useState('');


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
            let current_sub_module_list = current_module_dict.sub_modules_list;
            let total_sub_modules_for_parent_module = current_sub_module_list.length;
            let current_sub_module_progress_dict = {
                'completed': current_sub_module_index + 1,
                'total': total_sub_modules_for_parent_module
            };

            // set next course module object id
            nextStudentCourseModuleObjectId.current = current_module_dict.next_student_course_module_object_id;

            setCurrentSubModuleParentIndex(current_sub_module_index);
            setCurrentModuleInformationDict(current_module_dict);
            setCurrentSubModuleList(current_sub_module_list);
            setCurrentSubModuleProgressDict(current_sub_module_progress_dict);

            // Set next sub module name
            setNextSubModuleName(current_sub_module_list[current_sub_module_index + 1].sub_module_name);

            // const [currentSubModuleProgressDict, setCurrentSubModuleProgressDict] = useState({});
            // const [currentSubModuleInformationListProgress, setCurrentSubModuleInformationListProgress] = useState({});

            let current_sub_module_dict = current_sub_module_list[current_sub_module_index];
            let current_sub_module_information_list = current_sub_module_dict['note_information_list'];
            let current_sub_module_information_index = 0;
            let total_sub_module_information_list_elements = current_sub_module_information_list.length;
            let current_sub_module_information_list_progress_dict = {
                'completed': current_sub_module_information_index + 1,
                'total': total_sub_module_information_list_elements
            }

            console.log('current_sub_module_dict', current_sub_module_dict);
            
            setCurrentSubModuleDict(current_sub_module_dict);
            setCurrentSubModuleInformationList(current_sub_module_information_list);
            currentSubModuleInformationIndex.current = current_sub_module_information_index;
            setShowIntroductionNote(true);
            setCurrentSubModuleInformationListProgress(current_sub_module_information_list_progress_dict);

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
        setShowNextModuleDictButton(false);

        let new_sub_module_information_index;
        let new_sub_module_information_dict;
        if (showIntroductionNote === true) {  // starting at first example
            setShowIntroductionNote(false);
            new_sub_module_information_index = 0;
            new_sub_module_information_dict = currentSubModuleInformationList[new_sub_module_information_index];
        }
        else {

            // // TODO: Check and Update Progress
            // let current_sub_module_progress_dict = {
            //     'completed': current_sub_module_index + 1,
            //     'total': total_sub_modules_for_parent_module
            // };

            // First Check --> have we reach the end of this submodule?
            if ((currentSubModuleInformationIndex.current + 1) === currentSubModuleInformationListProgress['total']) { 

                // If so: check if there are more sub-modules or is this the end of the course module
                    // if end of course module --> proceed to next course module
                    // else --> proceed to next submodule
                
                if ((currentSubModuleParentIndex + 1) === currentSubModuleProgressDict['total']){

                    // TODO: 
                        // Proceed to course module quiz
                            // currently just going directly to the next course module...

                    console.log('new course module....')
                    window.location.href = '/learn-python/module/' + nextStudentCourseModuleObjectId.current;

                } 
                else {

                    // TODO: proceed to next submodule

                    // Start by updated current-sub-module-index
                    let new_sub_module_index = currentSubModuleParentIndex + 1;
                    // currentModuleInformationDict
                    
                    let new_sub_module_dict = currentSubModuleList[new_sub_module_index];
                    let new_sub_module_progress_dict = {
                        'completed': currentSubModuleProgressDict['completed'] + 1,
                        'total': currentSubModuleProgressDict['total']
                    };

                    let new_sub_module_information_list = new_sub_module_dict['note_information_list'];
                    let new_sub_module_information_index = 0;
                    let total_new_sub_module_information_list_elements = new_sub_module_information_list.length;
                    let new_sub_module_information_list_progress_dict = {
                        'completed': new_sub_module_information_index + 1,
                        'total': total_new_sub_module_information_list_elements
                    }

                    // Set next sub module name
                    if ((new_sub_module_index + 1) === currentSubModuleProgressDict['total']){
                        // TODO: don't set
                        setNextSubModuleName(null);
                    } else {
                        let new_sm_name = currentSubModuleList[new_sub_module_index + 1].sub_module_name;
                        setNextSubModuleName(new_sm_name);
                    }
                    // setNextSubModuleName([new_sub_module_index + 1]);
                    // setNextSubModuleName(current_sub_module_list[current_sub_module_index + 1]);
                    
                    // Sub Module Parent
                    setCurrentSubModuleParentIndex(new_sub_module_index);
                    setCurrentSubModuleDict(new_sub_module_dict);
                    setCurrentSubModuleProgressDict(new_sub_module_progress_dict);

                    // Sub Module Parent
                    setCurrentSubModuleInformationList(new_sub_module_information_list);
                    currentSubModuleInformationIndex.current = new_sub_module_information_index;
                    setCurrentSubModuleInformationListProgress(new_sub_module_information_list_progress_dict);
                    setShowIntroductionNote(true);

                    // Reset Everything
                    setCurrentNoteText('');
                    setShowExample(false);
                    setShowExampleButton(false);
                    setShowTryChallenge(false);
                    setShowCodeLayout(false);
                    setCurrentActiveTab('note');
                    setShowTryExerciseButton(false);
                    codeRef.current = '';
                    setInitialCodeValue('');
                    setCurrentChallengeDict({});
                    setCurrentTryExerciseText('');

                    // TODO: show "see example" button and implement logic + ui from there
                    _createTypewriterEffect(
                        new_sub_module_dict.introduction_note,
                        setCurrentNoteText, 
                        0, 
                        'show_example_button',
                        1
                    );

                    return;

                }

            } else {
                new_sub_module_information_index = currentSubModuleInformationIndex.current + 1;
                currentSubModuleInformationIndex.current = new_sub_module_information_index;

                new_sub_module_information_dict = currentSubModuleInformationList[new_sub_module_information_index];
                console.log('new_sub_module_information_dict-other', new_sub_module_information_dict);

                // TODO: display this on the layout
                let current_sub_module_info_list_progress_dict = {
                    'completed': new_sub_module_information_index + 1,
                    'total': currentSubModuleInformationListProgress['total']
                };
                setCurrentSubModuleInformationListProgress(current_sub_module_info_list_progress_dict);

            }
            // setCurrentSubModuleProgressDict(current_sub_module_progress_dict);

            // // currentSubModuleInformationIndex.current = current_sub_module_information_index;
            // new_sub_module_information_index = currentSubModuleInformationIndex.current + 1;
            // currentSubModuleInformationIndex.current = new_sub_module_information_index;
            // new_sub_module_information_dict = currentSubModuleInformationList[new_sub_module_information_index];
            // console.log('new_sub_module_information_dict-other', new_sub_module_information_dict);

        }

        // TODO: fix current error and proceed from there to finalizing all logic + ui + experience

        if (new_sub_module_information_dict['type'] === 'example'){            
            setShowExampleButton(false);
            setExampleDict(new_sub_module_information_dict);
            setShowCodeLayout(true);
            setShowExample(true);

            setCurrentActiveTab('note');

            console.log('new-module-info-dictionary:', new_sub_module_information_dict);
            console.log('new-module-info-CODE-NEW:', new_sub_module_information_dict.code);

            setInitialCodeValue('');
            codeRef.current = new_sub_module_information_dict.code;

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

            setCurrentTryExerciseText('');

            // Set object id
            setCurrentSubModuleInformationElementObjectId(new_sub_module_information_dict['element_object_id']);

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
            setConsoleOutput(result_output_value);

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

    const _handleRunButtonClick = async () => {

        setConsoleOutput('loading...');
        setIsRunLoading(true); // Start the loading state

        let current_code = codeRef.current;
        console.log('current-code:', current_code);
        // TODO: start here by completing run code and proceed
 
        // send request to run code
        _sendCodeExecutionRequest(current_code);
        
        // // TODO:
        //     // add user input (input())

    }

    
    const handleConfetti = () => {
        // Trigger confetti with default settings
        confetti({
            particleCount: 100, // Number of confetti particles
            spread: 70,         // Spread angle of confetti
            origin: { y: 0.6 }, // Where the confetti starts (y-axis)
        });
    };

    const _handleBtnExerciseSolutionSubmitClick = async () => {

        // TODO:
            // implement backend / frontend logic here

        console.log('exercise solution submit...');

        let anon_user_id = getFromLocalStorage('user_id');
        let current_code = codeRef.current;

        // // Set object id
        // setCurrentSubModuleInformationElementObjectId(new_sub_module_information_dict['element_object_id']);
        let current_exercise_object_id = currentSubModuleInformationElementObjectId;

        // TODO: get object id
        const payload = {
            'user_id': anon_user_id,
            'code': current_code,
            // 'sub_module_course_object_id': ,
            'current_exercise_object_id': current_exercise_object_id,
        }
        const apiResponse = await fetch(`http://127.0.0.1:8000/handle_sub_module_exercise_solution_submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const response_data = await apiResponse.json();
        console.log('Response Data:', response_data);

        // setConsoleOutput('>>> solution submitted...');
        // setSubmissionFeedback('Sample Submission Feedback... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem dui, aliquet at leo vehicula, porttitor ornare quam.');

        // setShowSubmitExerciseButton(false);
        // setShowNextModuleDictButton(true);

        // handleConfetti();

    }


    // // Monaco Code Editor

    const editorRef = useRef(null);
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor; // Keep a reference to the editor
    };
    // // Monaco Code Editor
    // const handleEditorDidMount = (editor, monaco) => {

    //     // Define the light theme
    //     monaco.editor.defineTheme('minimalistLight', {
    //         base: 'vs-dark', // inherit from vs-dark (dark theme)
    //         inherit: true,
    //         rules: [
    //             { token: 'comment', foreground: '6A737D', fontStyle: 'italic' }, 
    //             { token: 'keyword', foreground: '007ACC' },
    //             { token: 'identifier', foreground: 'D4D4D4' }, 
    //             { token: 'string', foreground: 'CE9178' }, 
    //             { token: 'number', foreground: 'B5CEA8' }, 
    //             { token: 'delimiter', foreground: '808080' }, 
    //             { token: 'type', foreground: '4EC9B0' }, 
    //         ],
    //         colors: {
    //             'editor.background': '#252526',
    //             'editor.foreground': '#D4D4D4', 
    //             'editorLineNumber.foreground': '#A0A0A0',
    //             'editorCursor.foreground': '#FFFFFF',
    //             'editor.selectionBackground': '#A7C6ED',
    //             'editor.inactiveSelectionBackground': '#2C2C2C',
    //             'editor.lineHighlightBackground': '#2D2D30', 
    //             'editorBracketMatch.background': '#515A6B', 
    //             'editorWhitespace.foreground': '#3B3B3B', 
    //         }
    //     });

    //     // Define the dark theme
    //     monaco.editor.defineTheme('minimalistDark', {
    //         base: 'vs-dark', // inherit from vs-dark (dark theme)
    //         inherit: true,
    //         rules: [
    //             { token: 'comment', foreground: 'A6C4DB', fontStyle: 'italic' }, 
    //             { token: 'keyword', foreground: 'C6C6FF' }, 
    //             { token: 'identifier', foreground: 'D4D4D4' }, 
    //             { token: 'string', foreground: '79C0FF' }, 
    //             { token: 'number', foreground: 'B5CEA8' }, 
    //             { token: 'delimiter', foreground: '808080' }, 
    //             { token: 'type', foreground: 'A2D3E0' }, 
    //         ],
    //         colors: {
    //             'editor.background': '#1C2631',
    //             'editor.foreground': '#D4D4D4', 
    //             'editorLineNumber.foreground': '#4E7A9A', 
    //             'editorCursor.foreground': '#AEAFAD', 
    //             'editor.selectionBackground': '#3D5A7F', 
    //             'editor.inactiveSelectionBackground': '#2C2C2C', 
    //             'editor.lineHighlightBackground': '#2D2D30', 
    //             'editorBracketMatch.background': '#516B80', 
    //             'editorWhitespace.foreground': '#3B3B3B', 
    //         }
    //     });

    //     // Set the initial theme based on the localStorage value
    //     const currentTheme = localStorage.getItem('theme') || 'light';
    //     monaco.editor.setTheme(currentTheme === 'dark' ? 'minimalistDark' : 'minimalistLight');

    // };


    const codeRef = useRef("");
    const _handleCodeStateChange = (value) => {
        codeRef.current = value;
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
            <div className="flex flex-col items-start mt-6 mx-auto w-[80%] sm:w-[80%]">

                {/* Top Header */}
                <div className="flex justify-between py-2 border-b border-gray-300 w-full mx-auto">

                    {/* Current Chapter and Title */}
                    <div className="text-left flex text-[15.5px] tracking-normal">
                        <h1 className="font-semibold text-gray-900">
                            Module: {currentModuleInformationDict.course_module_name}
                        </h1>
                        <span className="px-2 pt-1 text-[13.5px]">|</span>
                        <p className="text-gray-500 text-[12.5px] pt-[3px]">
                            Sub Module {currentSubModuleProgressDict.completed} ({currentSubModuleProgressDict.completed}/{currentSubModuleProgressDict.total}): {currentSubModuleDict.sub_module_name}
                        </p>
                        <span className="px-2 pt-1 text-[13.5px]">|</span>
                        {(nextSubModuleName !== null) && (
                            <p className="text-gray-500 text-[12.5px] pt-[3px]">
                                Next - Sub Module {currentSubModuleProgressDict.completed + 1}: {nextSubModuleName}
                            </p>
                        )}
                        {/* ( {currentSubModuleInformationListProgress.completed} / {currentSubModuleInformationListProgress.total} ) */}
                    </div>

                    {/* <div className="flex text-[12px]">
                        <p>
                            Current Course Module Progress: ( {currentSubModuleProgressDict.completed} /  {currentSubModuleProgressDict.total} )
                        </p>
                        <p className='px-2'>|</p>
                        <p>
                            Current Sub Module Progress: ( {currentSubModuleInformationListProgress.completed} / {currentSubModuleInformationListProgress.total} )
                        </p>
                    </div> */}

                    {/* Next Chapter */}
                    <div className="text-right flex text-[12.5px] tracking-normal pb-0 py-0">
                        {/* <h1 className="text-gray-400 hover:text-blue-400 cursor-pointer">
                            Skip and Take Final Module Quiz
                        </h1> */}
                            {/* <p className="text-gray-500 text-[11px] mb-1">Progress: {currentSubModuleInformationListProgress.completed} / {currentSubModuleInformationListProgress.total}</p> */}
                            <div className='space-y-1'>
                                <span className="text-[11px] font-medium">
                                    Sub Module Progress: {currentSubModuleInformationListProgress.completed} / {currentSubModuleInformationListProgress.total}
                                </span>
                                <Progress value={(currentSubModuleInformationListProgress.completed / currentSubModuleInformationListProgress.total) * 100} className="w-40" />
                            </div>
                    </div>

                </div>


                {/* Progress Bar */}
                {/* <div className="flex w-full justify-end mt-3 mb-0 pb-0">
                    <div>
                        <p className="text-gray-500 text-[11px] mb-1">Progress: {currentSubModuleInformationListProgress.completed} / {currentSubModuleInformationListProgress.total}</p>
                        <Progress value={(currentSubModuleInformationListProgress.completed / currentSubModuleInformationListProgress.total) * 100} className="w-40" />
                    </div>
                </div> */}

                {/* Layout - Note + Code */}
                <div className="flex py-0">


                    {/* First Half */}
                    <div 
                        className="p-0 pt-2 w-full"
                    >

                        <div className="space-y-4 mt-2 w-full">
                            
                            {
                                ((showExample === true) || (showTryChallenge === true))

                                ?

                                (

                                    <>
                                        <div
                                            className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-0 w-full min-w-[520px]"
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
                                                    // (showTryChallenge === true) && (

                                                    //     <li className="me-2">
                                                    //         <a
                                                    //             href="#"
                                                    //             className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg cursor-pointer ${
                                                    //                 (currentActiveTab === 'challenge')
                                                    //                 ? 'text-blue-600 border-blue-600 font-bold dark:text-blue-500 dark:border-blue-500'
                                                    //                 : 'text-gray-600 border-transparent dark:text-gray-400'
                                                    //             }`}
                                                    //             aria-current={currentActiveTab ? 'page' : undefined}
                                                    //             onClick={() => setCurrentActiveTab('challenge')}
                                                    //         >
                                                    //             Challenge
                                                    //         </a>
                                                    //     </li>
                                                                
                                                    // )

                                                    (showTryChallenge === true) ? (

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
                                                                
                                                    ) : (

                                                        <li className="me-2">
                                                            <a
                                                                className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg cursor-pointer ${
                                                                        'text-gray-400 border-transparent cursor-not-allowed'
                                                                        // : 'text-gray-600 border-transparent dark:text-gray-400'
                                                                }`}
                                                                aria-current={currentActiveTab ? 'page' : undefined}
                                                                onClick={(e) => e.preventDefault()} // Prevent default behavior if disabled
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
                                                
                                                <div>
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

                            <div className="w-full min-w-[640px] mt-3 flex flex-col pt-0 border-l-2 border-gray-50">

                                <div className="flex-grow p-0 pt-0 pb-0 pl-4">
                                    
                                    <div className="flex justify-between">
                                        {/* <h2 className="text-[18px] font-semibold text-gray-800 mb-0 pl-1 pt-1"> */}
                                        <h2 className="text-[18px] font-semibold text-gray-800 pt-2">
                                            Code
                                        </h2>
                                        <div className='flex justify-end space-x-4'>
                                            <button
                                                type="button"
                                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-[13.5px] px-3 py-2 me-0 mb-2 mt-0.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                                onClick={_handleRunButtonClick}
                                                disabled={isRunLoading}
                                            >
                                                {/* <FontAwesomeIcon icon={faPlay} className="pl-1 pr-1 text-[14px]"/>{" "}Run Code */}
                                                {isRunLoading ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                                                )}
                                                {isRunLoading ? "Running..." : "Run Code"}
                                            </button>

                                            {/* {(showTryChallenge === true) && (
                                                 <button
                                                    type="button"
                                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                >Submit Solution</button>
                                            )} */}
                                        
                                        </div>
                                     
                                    </div>
                                    
                                    <div className="h-[470px]">
                                        <Monaco
                                            height="100%"
                                            defaultLanguage="python" // Set language to Python
                                            // defaultValue={`# Write your Python code here\n\nprint("Hello, World!")`}
                                            value={initialCodeValue}
                                            onMount={handleEditorDidMount}
                                            theme="vs-dark"
                                            options={{
                                                fontSize: 13,
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false,
                                            }}
                                            onChange={(value) => _handleCodeStateChange(value ?? "")}
                                        />

                                        {/* <Editor
                                            width="100%"
                                            height="100%"
                                            language="python"
                                            options={{
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false,
                                                selectOnLineNumbers: true,
                                                wordWrap: "on",
                                            }}
                                            // onChange={(value) => _handleCodeStateChange(value ?? "")}
                                            onMount={handleEditorDidMount}
                                            value={initialCodeValue}
                                        /> */}
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