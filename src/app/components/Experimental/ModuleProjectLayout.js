import React, { useState, useEffect, useRef } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlay, faSpinner, faHome, faComment, faXmark, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import Markdown from 'react-markdown';
import confetti from "canvas-confetti";
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';
import DashboardTopNavBar from "@/app/components/Experimental/DashboardTopNavBar";
import NoteLayout from "@/app/components/Experimental/SubModuleComponents/NoteLayout";
import { Progress } from "@/components/ui/progress";

import Monaco from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import axios from "axios";


const ModuleProjectLayout = ({ module_id }) => {

    const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

    const [projectDetailsDict, setProjectDetailsDict] = useState({});
    const [projectDetailPartList, setProjectDetailPartList] = useState([]);
    const [showProjectIntroductoryNote, setShowProjectIntroductoryNote] = useState(false);
    const [projectPartIndex, setProjectPartIndex] = useState(0);
    const [projectPartDict, setProjectPartDict] = useState({});

    const [projectTaskPassed, setProjectTaskPassed] = useState(null);
    const [projectTaskSubmissionFeedback, setProjectTaskSubmissionFeedback] = useState("");
    
    // Code Related
    const [consoleOutput, setConsoleOutput] = useState('>>> Console Output');
    const [isRunLoading, setIsRunLoading] = useState(false);

    const [currentExerciseSubmissionHistory, setCurrentExerciseSubmissionHistory] = useState([]);
    const currentExerciseSubmissionHistoryModalData = useRef([]);
    const userProjectPartSubmissionDict = useRef({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModalDatatype, setSelectedModalDataType] = useState(null);
    const [selectedModalData, setSelectedModalData] = useState(null);

    const [parentModuleCourseName, setParentModuleCourseName] = useState("");

    const [initialPageLoading, setInitialPageLoading] = useState(true);

    const _handleProjectDetailsFetch = async (module_id) => {

        let anon_user_id = getFromLocalStorage('user_id');
        const payload = {
            'user_id': anon_user_id,
            'course_module_object_id': module_id
        };

        const apiResponse = await fetch(`http://127.0.0.1:8000/fetch_course_module_project_details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const response_data = await apiResponse.json();
        console.log('Response Data:', response_data);

        if (response_data['success'] === true){

            let project_detail_dict = response_data['project_detail_dict'];
            setProjectDetailsDict(project_detail_dict);
            setProjectDetailPartList(project_detail_dict['project_parts_list']);
            setShowProjectIntroductoryNote(true);
            // setCurrentExerciseSubmissionHistory(response_data['user_project_submission_history_rv']);

            setParentModuleCourseName(project_detail_dict['parent_course_object_name']);
            
            userProjectPartSubmissionDict.current = response_data['user_project_submission_history_rv'];

            setInitialPageLoading(false);

        }

    };
 
    const _handleStartProjectButtonClick = async () => {

        console.log('start project', projectDetailPartList[0]);

        console.log('part-submission-dict:', userProjectPartSubmissionDict.current);

        const current_project_part_dict = projectDetailPartList[0];
        const current_project_part_submission_list = userProjectPartSubmissionDict.current[current_project_part_dict['id']];

        setProjectPartIndex(0);
        setProjectPartDict(projectDetailPartList[0]);
        setShowProjectIntroductoryNote(false);
        setCurrentExerciseSubmissionHistory(current_project_part_submission_list);

        // projectTaskPassed
        let project_task_already_passed = false;
        for (let idx = 0; idx < current_project_part_submission_list.length; idx ++){
            if (current_project_part_submission_list[idx]['solution_passed'] === true){
                project_task_already_passed = true;
                break;
            }
        }
        if (project_task_already_passed === true){
            setProjectTaskPassed(true);    
        }

        codeRef.current = projectDetailPartList[0].starter_code;
        _createTypewriterEffect(
            projectDetailPartList[0].starter_code,
            setInitialCodeValue,
            0,
            null,
            100
        );

        // let new_current_project_dict = projectDetailPartList[current_index + 1];
        // console.log('NEW-CURRENT-PROJECT-DICT:', new_current_project_dict);
        // console.log('Current-project-dict-CODE:', new_current_project_dict.starter_code);
        
        // codeRef.current = '';
        // _createTypewriterEffect(
        //     new_current_project_dict.starter_code,
        //     setInitialCodeValue,
        //     0,
        //     null,
        //     100
        // );

        // setProjectPartIndex((prevIndex) => (prevIndex + 1));
        // setProjectPartDict(projectDetailPartList[current_index + 1]);

    };

    const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
    const [taskSubmissionLoading, setTaskSubmissionLoading] = useState(false);
    const _handleProjectTaskSubmit = async () => {

        setSubmitButtonLoading(true);
        setTaskSubmissionLoading(true);
        
        let anon_user_id = getFromLocalStorage('user_id');

        // Pass to backend
        const current_code_solution = codeRef.current;
        const payload = {
            'user_id': anon_user_id,
            'project_task_object_id': projectPartDict.id,
            'code_solution': current_code_solution
        };
        const apiResponse = await fetch(`http://127.0.0.1:8000/handle_project_task_submission`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const response_data = await apiResponse.json();
        console.log('Response Data:', response_data);
        
        if (response_data['success'] === true){

            setSubmitButtonLoading(false);
            setTaskSubmissionLoading(false);

            setProjectTaskPassed(response_data['submission_result_dict']['solution_passed']);
            setProjectTaskSubmissionFeedback(response_data['submission_result_dict']['ai_solution_feedback']);
            setCurrentExerciseSubmissionHistory([...currentExerciseSubmissionHistory, response_data['submission_result_dict']]);

        }
        // if (response_data['solution_passed'] === true){

        // }

        // if (response_data['solution_passed'] === true){

        //     setProjectTaskPassed(true);
        //     setProjectTaskSubmissionFeedback(response_data['ai_solution_feedback']);
            
        //     codeRef.current = '';
        //     setInitialCodeValue('');
        //     setProjectPartIndex((prevIndex) => (prevIndex + 1));
        //     setProjectPartDict(projectDetailPartList[new_index]);

        // } else {
        //     // TODO: pass
        // }



    //     let new_index = projectPartIndex + 1;
    //     if (new_index < projectDetailPartList.length) {
    //         let anon_user_id = getFromLocalStorage('user_id');

    //         // Pass to backend
    //         const current_code_solution = codeRef.current;
    //         const payload = {
    //             'user_id': anon_user_id,
    //             'project_task_object_id': projectPartDict.id,
    //             'code_solution': current_code_solution
    //         };
    //         const apiResponse = await fetch(`http://127.0.0.1:8000/handle_project_task_submission`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(payload)
    //         });
    //         const response_data = await apiResponse.json();
    //         console.log('Response Data:', response_data);

    //         if (response_data['success'] === true){

    //             setSubmitButtonLoading(false);
    //             setTaskSubmissionLoading(false);
        
    //             setProjectTaskPassed(response_data['submission_result_dict']['solution_passed']);
    //             setProjectTaskSubmissionFeedback(response_data['submission_result_dict']['ai_solution_feedback']);
    //             setCurrentExerciseSubmissionHistory([...currentExerciseSubmissionHistory, response_data['submission_result_dict']]);

    //             // if (response_data['solution_passed'] === true){

    //             // }

    //             // if (response_data['solution_passed'] === true){

    //             //     setProjectTaskPassed(true);
    //             //     setProjectTaskSubmissionFeedback(response_data['ai_solution_feedback']);
                    
    //             //     codeRef.current = '';
    //             //     setInitialCodeValue('');
    //             //     setProjectPartIndex((prevIndex) => (prevIndex + 1));
    //             //     setProjectPartDict(projectDetailPartList[new_index]);

    //             // } else {
    //             //     // TODO: pass
    //             // }

    // //             const [projectTaskPassed, setProjectTaskPassed] = useState(false);
    // // const [projectTaskSubmissionFeedback, setProjectTaskSubmissionFeedback] = useState("");
                
    //             // TODO: If successful-passed submission, move on to the next question
                

    //         }

    //     } else {
    //         console.log('project module complete...');
    //     }

    };

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
            console.log('result-output-value:', result_output_value);
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
 
        // send request to run code
        _sendCodeExecutionRequest(current_code);

    }

    const [initialCodeValue, setInitialCodeValue] = useState("");
    const codeRef = useRef("");
    const _handleCodeStateChange = (value) => {
        codeRef.current = value;
    }

    const editorRef = useRef(null);
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor; // Keep a reference to the editor
    };


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

            // TODO: 
            // if (text_type === 'show_example_button'){
            //     setShowExampleButton(true);
            // }
            // else if (text_type === 'show_try_exercise_button'){
            //     // TODO:
            //     setShowTryExerciseButton(true);
            // }
            // else if (text_type === 'show_submit_button'){
            //     setShowSubmitExerciseButton(true);
            // }

        }

    };


    const [showCourseModuleFinish, setShowCourseModuleFinish] = useState(false);

    const _handleNextProjectTaskClick = async () => {
        
        let current_index = projectPartIndex;
        if ((current_index + 1) < projectDetailPartList.length) {

            const new_current_project_dict = projectDetailPartList[current_index + 1];
            console.log('NEW-CURRENT-PROJECT-DICT:', new_current_project_dict);
            console.log('Current-project-dict-CODE:', new_current_project_dict.starter_code);

            setProjectTaskSubmissionFeedback('');
            setProjectTaskPassed('');
            setProjectTaskPassed(null);

            // const current_project_part_submission_list = userProjectPartSubmissionDict[new_current_project_dict['id']];
            // setCurrentExerciseSubmissionHistory(current_project_part_submission_list);

            // const current_project_part_dict = projectDetailPartList[0];
            const current_project_part_submission_list = userProjectPartSubmissionDict.current[new_current_project_dict['id']];
            console.log('CURRENT-PROJECT-PART-SUBMISSION-LIST:', current_project_part_submission_list);
            setCurrentExerciseSubmissionHistory(current_project_part_submission_list);

            let project_task_already_passed = false;
            for (let idx = 0; idx < current_project_part_submission_list.length; idx ++){
                if (current_project_part_submission_list[idx]['solution_passed'] === true){
                    project_task_already_passed = true;
                    break;
                }
            }
            if (project_task_already_passed === true){
                setProjectTaskPassed(true);    
            }

            codeRef.current = new_current_project_dict.starter_code;
            setInitialCodeValue('');
            _createTypewriterEffect(
                new_current_project_dict.starter_code,
                setInitialCodeValue,
                0,
                null,
                100
            );

            setProjectPartIndex((prevIndex) => (prevIndex + 1));
            setProjectPartDict(projectDetailPartList[current_index + 1]);

        } else {

            setShowProjectIntroductoryNote(true);
            setShowCourseModuleFinish(true);

        }

    };

    const showSubmissionHistoryModalData = async (object_index, type) => {

        // TODO: show this and go from there
        console.log('data', object_index, type);
        console.log('tmp-data-two:', currentExerciseSubmissionHistoryModalData);

        // let element_dict = currentExerciseSubmissionHistoryModalData.current[object_id];
        let element_dict = currentExerciseSubmissionHistory[object_index];
        console.log('element-dict:', element_dict);

        if (type === 'code'){
            
            setSelectedModalDataType('code');
            setSelectedModalData(element_dict['user_solution']);
            setIsModalOpen(true);
            // // TODO:
            // tmp_rv[current_elem.key] = {
            //     'code': current_elem.code,
            //     'feedback': current_elem.feedback
            // };

        }
        else {

            setSelectedModalDataType('feedback');
            setSelectedModalData(element_dict['ai_solution_feedback']);
            setIsModalOpen(true);

        }

    };

    const closeModal = () => {
        setIsModalOpen(false); // Hide the modal
    };

    // Initial Load
    useEffect(() => {

        console.log('MODULE ID NEW:', module_id);
        _handleProjectDetailsFetch(module_id);

    }, []);

    // Initial Animation Load
    useEffect(() => {
    
        // Initial Animations
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });

    }, []);


    const _handleGoHomeBtnClick = () => {
        window.location.href = '/learn-python/home';
    }


    return (
        
        <>
            
            {/* Dashboard Top NavBar */}
            <DashboardTopNavBar />

            {(initialPageLoading === true) ? (
                
                <div className="text-center mt-12">
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>

            ) : (

                <div className="flex flex-col items-start mt-6 mx-auto w-[80%] sm:w-[80%]">

                    {/* Top Header */}
                    <div className="flex justify-between py-2 border-b border-gray-300 w-full mx-auto">

                        {/* Current Chapter and Title */}
                        <div className="text-left flex text-[15.5px] tracking-normal">
                            <h1 className="font-semibold text-gray-900">
                                <a
                                    href="/learn-python/home"
                                    className="hover:text-blue-600"
                                >
                                    Module:
                                    <span className='pl-2 text-[13.5px] pt-[1.8px] text-gray-500 font-normal hover:text-blue-600'>
                                        {parentModuleCourseName}
                                    </span>
                                </a>
                            </h1>
                        </div>

                    </div>

                    <div className="flex py-0">

                        {
                            (showProjectIntroductoryNote === true) ? (

                                // setShowCourseModuleFinish
                                (showCourseModuleFinish === true) ? (
                                    
                                    <div>
                                        <p className="text-[15px] tracking-normal leading-9 pt-2 pr-0 px-2">
                                            
                                            <h3 className="font-bold text-[16px] mb-2">
                                                Congrats! You have completed the course! 🎉
                                            </h3>

                                        </p>

                                        {/* Buttons */}
                                        <div className="mt-10 flex justify-center">
                                            <button
                                                type="button"
                                                className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-normal rounded-lg text-[14.5px] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                onClick={_handleGoHomeBtnClick}
                                            >
                                                Go Home
                                                {/* <FontAwesomeIcon icon={faHome} className="pl-2 pt-1" /> */}
                                            </button>
                                        </div>

                                    </div>


                                ) : (

                                    <div>
                                        <p className="text-[15px] tracking-normal leading-9 pt-2 pr-0 px-2">
                                            <h3 className="font-bold text-[16px] mb-2">
                                                Project: {projectDetailsDict.project_name}
                                            </h3>
                                            <Markdown>
                                                {projectDetailsDict.description}
                                            </Markdown>

                                            <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                                {(projectDetailPartList).map((project_part_dict, index) => (
                                                    <li
                                                        key={index}
                                                    >
                                                        Part {project_part_dict.part}: {project_part_dict.part_name}
                                                    </li>
                                                ))}
                                            </ul>

                                        </p>

                                        {/* Buttons */}
                                        <div className="mt-10 flex justify-center">
                                            <button
                                                type="button"
                                                className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-[14.5px] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                onClick={_handleStartProjectButtonClick}
                                            >
                                                Start Project
                                                <FontAwesomeIcon icon={faArrowRight} className="pl-2 pt-1" />
                                            </button>
                                        </div>

                                    </div>

                                )

                            )
                            :
                            (
                                
                                // Task with code layout + submit
                                <>
                                    <div className="flex flex-row space-x-8">

                                        {/* Note */}
                                        <div className="w-1/2 space-y-4 pt-2">
                                            <p className="text-[15px] tracking-normal leading-9 pt-0.5 pr-0">
                                                {/* <h3 className="font-semibold text-[18px] mb-2">Task {projectPartDict.part_name}</h3> */}
                                                <h2 className="text-[18px] font-semibold text-gray-800 mb-1">
                                                    Task {projectPartDict.part_name}
                                                </h2>
                                                <Markdown>{projectPartDict.task}</Markdown>
                                            </p>

                                            {/* <button
                                                onClick={_handleQuizQuestionSubmit}
                                                type="button"
                                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                            >
                                                Submit
                                            </button> */}


                                            <p className="text-[16px] font-bold pt-4">
                                                Solution Passed?
                                            </p>
            
                                            {(taskSubmissionLoading === true) && (
                                                <div role="status">
                                                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                    </svg>
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            )}

                                            { (projectTaskPassed !== null) ? (

                                                (taskSubmissionLoading === true) ? (
                                                    null
                                                ) : (
                                                    (projectTaskPassed === true) ? (
                                                        <p className="leading-9 text-[15px] text-gray-500">
                                                            Passed! ✔️
                                                        </p>
                                                    ) : (
                                                        <p className="leading-9 text-[15px] text-gray-500">
                                                            Failed! ❌
                                                        </p>
                                                    )
                                                )

                                            ) : (
                                                (taskSubmissionLoading === true) ? (
                                                    null
                                                ) : (
                                                    <p className="leading-9 text-[15px] text-gray-500">
                                                        Submit solution to determine result.
                                                    </p>
                                                )
                                            )}

                                            <p className="text-[16px] font-bold pt-4">
                                                Current Solution Feedback
                                            </p>

                                            {(taskSubmissionLoading === true) ? (
                                                <div role="status">
                                                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                    </svg>
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            ) : (
                                                <p className="leading-9 text-[15px] text-gray-500">
                                                    {(projectTaskSubmissionFeedback.length === 0) && "Write your code and submit your solution to finish the exercise."}
                                                    {projectTaskSubmissionFeedback}
                                                </p>
                                            )}

                                            <p className="text-[16px] font-bold pt-4">
                                                Your Submissions
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

                                                    {currentExerciseSubmissionHistory.map((item, index) => (

                                                        <tr
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                            key={item.key}
                                                        >

                                                            <td className="p-3">
                                                                {item.date}
                                                            </td>
                                                            <td
                                                                className={`p-3 ${
                                                                    item.solution_passed === true
                                                                        ? "text-green-400"
                                                                        : "text-red-400"
                                                                }`}
                                                            >
                                                                {item.solution_passed.toString()}
                                                            </td>
                                                            
                                                            <td 
                                                                className="p-3"
                                                            >
                                                                <span 
                                                                    className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                                                    onClick={() => showSubmissionHistoryModalData(index, "code")}
                                                                >
                                                                    View Code
                                                                </span>
                                                            </td>

                                                            <td 
                                                                className="p-3"
                                                            >
                                                                <span 
                                                                    className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                                                    onClick={() => showSubmissionHistoryModalData(index, "feedback")}
                                                                >
                                                                    View Feedback
                                                                </span>
                                                            </td>

                                                        </tr>    

                                                    ))}
                                                    
                                                </tbody>
                                            </table>


                                            {/* Buttons Layout */}

                                            {(projectTaskPassed === true) && (
                                                
                                                <button
                                                    type="button"
                                                    className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
                                                    onClick={_handleNextProjectTaskClick}
                                                >
                                                    Next Part                                                
                                                </button>

                                            )}

                                            {(projectTaskPassed !== true) && (

                                                <div className='pt-2'>

                                                    <button
                                                        onClick={_handleProjectTaskSubmit}
                                                        type="button"
                                                        className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${
                                                            submitButtonLoading && "opacity-50 cursor-not-allowed"
                                                        }`}
                                                        disabled={submitButtonLoading}
                                                    >
                                                        {submitButtonLoading ? (
                                                            <svg
                                                            aria-hidden="true"
                                                            className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                                                            viewBox="0 0 100 101"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                            <path
                                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08154 50.5908C9.08154 74.1846 25.8062 91.3181 50 91.3181C74.1938 91.3181 90.9185 74.1846 90.9185 50.5908C90.9185 26.9969 74.1938 9.86328 50 9.86328C25.8062 9.86328 9.08154 26.9969 9.08154 50.5908Z"
                                                                fill="currentColor"
                                                            />
                                                            <path
                                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5536C95.2932 28.8227 92.871 24.3694 89.8167 20.348C85.8452 15.1192 80.8826 10.723 75.2124 7.41289C69.5422 4.1028 63.2754 1.94025 56.7221 1.05111C51.7666 0.367572 46.7395 0.446529 41.8371 1.27873C39.3185 1.69975 37.855 4.19778 38.4921 6.62326C39.1292 9.04874 41.6021 10.4813 44.0772 10.1023C47.9246 9.49341 51.8292 9.52694 55.6552 10.1957C60.864 11.0906 65.845 13.1964 70.2982 16.3935C74.7515 19.5905 78.5764 23.8106 81.5061 28.818C83.8827 32.8672 85.606 37.2767 86.6314 41.8771C87.2324 44.3075 89.5422 45.6781 91.9676 45.0409Z"
                                                                fill="currentFill"
                                                            />
                                                            </svg>
                                                        ) : (
                                                            "Submit"
                                                        )}
                                                    </button>

                                                </div>

                                            )}
                                            
                                        </div>

                                        {/* Modal - for viewing code and submission feedback */}
                                        {isModalOpen && (
                                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                                <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 h-1/2">
                                                    <h2 className="text-lg font-semibold mb-4">
                                                        {selectedModalDatatype === 'code' ? (
                                                            "Code"
                                                        ) : (
                                                            "Feedback"
                                                        )}</h2>
                                                    <pre className="text-sm text-gray-600 bg-gray-100 p-4 rounded overflow-x-auto h-2/3 text-wrap">
                                                        {selectedModalData}
                                                    </pre>
                                                    <Button
                                                        onClick={closeModal}
                                                        className="mt-5 px-4 py-4 bg-black text-white rounded hover:bg-blue-600"
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Code Layout */}
                                        <div className="w-2/3 flex flex-col border-l-2 border-gray-50 pl-4 pt-1">
                                            <div className="flex justify-between">
                                                <h2 className="text-[18px] font-semibold text-gray-800 pt-2">Code</h2>
                                                <div className="flex justify-end space-x-4 mt-1">
                                                    <button
                                                        type="button"
                                                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-[13.5px] px-3 py-2 me-0 mb-2 mt-0.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                                        onClick={_handleRunButtonClick}
                                                        disabled={isRunLoading}
                                                    >
                                                        {isRunLoading ? (
                                                            <>
                                                                <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                                                Running...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
                                                                Run Code
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="h-[470px]">
                                                <Monaco
                                                    height="100%"
                                                    defaultLanguage="python"
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
                                            </div>

                                            <div className="flex-grow pt-4">
                                                <h2 className="text-[18px] font-semibold text-gray-800 mb-2">Console Output</h2>
                                                <div className="h-40 overflow-auto bg-black text-green-500 p-2 rounded-md font-mono text-sm">
                                                    {consoleOutput.split("\n").map((line, index) => (
                                                        <span key={index}>
                                                            {line}
                                                            <br />
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </>

                            )

                        }

                    </div>

                </div>

            )}

            

        </>
    )

}

export default ModuleProjectLayout;