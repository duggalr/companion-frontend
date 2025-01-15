import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageUtils";
import {  getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';
import  HeroLanding from './HeroLanding';


const StartLayout = () => {

    const [showChatLayout, setShowChatLayout] = useState(false);
    const currentUserInputMessageRef = useRef("");
    const [currentUserInputMessage, setCurrentUserInputMessage] = useState("");
    const [sendBtnEnabled, setSendBtnEnabled] = useState(false);

    const handleStartCourseBtnClick = () => {
        setShowChatLayout(true);
    };

    const handleNewInputValue = (e) => {

        let user_input_message = e.target.value;
        setCurrentUserInputMessage(user_input_message);
        currentUserInputMessageRef.current = user_input_message;

        if (user_input_message.trim() !== "") {
            setSendBtnEnabled(true);
        } else {
            setSendBtnEnabled(false);
        }
    
    };


    const loadingCourseTextList = ["Loading...", "Fetching data...", "Almost there...", "Hang tight..."];
    const [showUserCourseModule, setShowUserCourseModule] = useState(false);
    const [showUserCourseModuleLoading, setShowUserCourseModuleLoading] = useState(false);
    const courseLoadingIndexRef = useRef(0);
    const [showCourseLoadingText, setShowCourseLoadingText] = useState("");

    // const [userGoalSummary, setUserGoalSummary] = useState("");
    // const userGoalSummaryRef = useRef("");
    // const [userSyllabusList, setUserSyllabusList] = useState([]);
    const [userGeneratedCourseDict, setUserGeneratedCourseDict] = useState({});
    // TODO: ^set above


    // Websocket Chat Messages
    const wsRef = useRef(null);
    const accumulatedMessageRef = useRef("");

    const [messages, setMessages] = useState([{
        text: `Why hello there! 👋 I'm Companion, your AI teacher, that will help you individually learn Python. Together, we will achieve your learning goals!

This is a project-based course and in the end, you will implement a project that you chose to complete. Also, this course is entirely generated from scratch, just for you, and it is not pre-generated or defined, to make it as personalized to your goals as possible! 😅

To start, I need to learn a little bit more about you. What's your name my good friend? 🤔`,
        sender: "bot",
        }
    ]);
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [messagesDisabled, setMessagesDisabled] = useState(false);    

    const tmp_one = async (task_id) => {

        // const response = await fetch(`http://127.0.0.1:8000/course-gen-task-status/${task_id}`);
        // const data = await response.json();
        // console.log('Course Status Data:', data);

        const interval = setInterval(async () => {
            const response = await fetch(`http://127.0.0.1:8000/course-gen-task-status/${task_id}`);
            const data = await response.json();
            console.log('Course Status Data:', data);
            // setProgress(data.progress);
            // setStatus(data.state);

            if (data.state === "SUCCESS" || data.state === "FAILURE") {
                clearInterval(interval);
            }
        }, 1000); // Poll every second

        // TODO: test out and fix all bugs; etc. + finalize
        return () => clearInterval(interval);

    }
    
    // Websocket
    useEffect(() => {

        const websocket_url = 'ws://127.0.0.1:8000/ws_learn_about_user';
        const socket = new WebSocket(websocket_url);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('message:', message);

            if (message['type'] == 'user_goal_chat'){

                const msg_text = message['response'];

                // TODO: if message == 'DONE'
                if (msg_text === "DONE"){

                    console.log('MESSAGING COMPLETE...')

                    // Generate Summary
                    setMessagesDisabled(true);                    
                    
                    let all_user_messages = JSON.parse(getFromLocalStorage('new_course_chat_messages'));
                    let all_chat_messages_str = "";
                    for (let i = 0; i <= all_user_messages.length-1; i++) {
                        if (all_user_messages[i].sender == 'user'){
                            all_chat_messages_str += "USER: " + all_user_messages[i].text + "\n";
                        } else {
                            all_chat_messages_str += "AI: " + all_user_messages[i].text + "\n";
                        }
                    };

                    // TODO:
                    let anon_user_id = getFromLocalStorage('user_id');
                    let tmp_payload = {
                        'user_chat_history_string': all_chat_messages_str,
                        'anon_user_id': anon_user_id
                    };
                    console.log('tmp-payload-new:', tmp_payload);
                    
                    // TODO: here, set the screen to loading with dynamic messages showing and go from there
                    wsRef.current.send(JSON.stringify(tmp_payload));

                    setShowUserCourseModule(true);
                    setShowUserCourseModuleLoading(true);
                    
                    setShowCourseLoadingText("Generating a course syllabus... will take 10-15 seconds");

                    // TODO: test everything out and fix
                    const interval = setInterval(() => {
                        let idx = courseLoadingIndexRef.current;
                        if (idx >= loadingCourseTextList.length-1){
                            idx = 0;
                            courseLoadingIndexRef.current = 0;
                            setShowCourseLoadingText(loadingCourseTextList[idx + 1]);
                        } else {
                            courseLoadingIndexRef.current = idx + 1;
                            setShowCourseLoadingText(loadingCourseTextList[idx + 1]);
                        }
                    }, 3000); 
                    return () => clearInterval(interval);

                }

                else if (msg_text === "MODEL_GEN_COMPLETE") {
                    
                    if (accumulatedMessageRef.current !== 'DONE'){

                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { text: accumulatedMessageRef.current, sender: "bot" },
                        ]);

                    }

                    setTimeout(() => {
                        setGeneratedMessage("");
                        setIsGeneratingMessage(false);
                        setIsLoading(false);
                    }, 50);

                }
                else {
                    accumulatedMessageRef.current += msg_text;
                    setGeneratedMessage((prev) => prev + msg_text);
                    setIsGeneratingMessage(true);                    
                }

            }

            // else if (message['type'] == 'user_summary'){

            //     const summary_text = message['response'];

            //     if (summary_text === "SUMMARY_GEN_COMPLETE"){

            //         // TODO: pass here

            //         // setMessages((prevMessages) => [
            //         //     ...prevMessages,
            //         //     { text: accumulatedMessageRef.current, sender: "bot" },
            //         // ]);

            //         // const [userGoalSummary, setUserGoalSummary] = useState("");
            //     }
            //     else {

            //         userGoalSummaryRef.current += summary_text;
            //         setUserGoalSummary((prev) => prev + summary_text);

            //         // setUserGoalSummary()
            //         // summary_text

            //         // accumulatedMessageRef.current += msg_text;
            //         // setGeneratedMessage((prev) => prev + msg_text);
            //         // setIsGeneratingMessage(true);
            //     }

            // }

            else if (message['type'] == 'user_summary_response'){

                // TODO: update based on new changes in backend

                const user_profile_dictionary_string = message['user_summary_json']['student_profile_json_dictionary'];
                const student_summary_text = message['user_summary_json']['student_summary'];
                const student_course_name = message['user_syllabus_ai_response_json']['course_name'];
                const student_course_description = message['user_syllabus_ai_response_json']['course_description'];
                const student_syllabus = message['user_syllabus_ai_response_json']['syllabus_json_list'];

                // setUserGoalSummary(student_summary_text);
                // userGoalSummaryRef.current = student_summary_text;
                // setUserSyllabusList(student_syllabus);
                
                const user_state_dict = {
                    'user_profile_dictionary_string': user_profile_dictionary_string,
                    'summary': student_summary_text,
                    'course_name': student_course_name,
                    'course_description': student_course_description,
                    'student_syllabus': student_syllabus
                };

                setUserGeneratedCourseDict(user_state_dict);
                setShowUserCourseModule(true);
                setShowUserCourseModuleLoading(false);

                // Save in LocalStorage
                let anon_user_id = getFromLocalStorage('user_id');
                console.log('ANON-USER-ID:', anon_user_id);

                removeFromLocalStorage('user_course_state_dict');
                saveToLocalStorage('user_course_state_dict', user_state_dict);

                // removeFromLocalStorage('student_profile_json_dictionary');
                // removeFromLocalStorage('student_summary_text');
                // removeFromLocalStorage('student_syllabus');
                // removeFromLocalStorage('student_course_name');
                // removeFromLocalStorage('student_course_description');
                // saveToLocalStorage(
                //     'student_profile_json_dictionary', user_profile_dictionary_string
                // );
                // saveToLocalStorage(
                //     'student_summary_text', student_summary_text
                // );
                // saveToLocalStorage(
                //     'student_syllabus', JSON.stringify(student_syllabus)
                // );
                // saveToLocalStorage(
                //     'student_course_name', student_course_name
                // );
                // saveToLocalStorage(
                //     'student_course_description', student_course_description
                // );

                // Course is currently generating
                // Set Interval to retrieve update every second on course-generation-progress
                saveToLocalStorage('course_currently_generating', true);

                const course_gen_task_id = message['task_id'];
                console.log('current-course-gen-task-id:', course_gen_task_id);
                tmp_one(course_gen_task_id);

                // const interval = setInterval(async () => {
                //     const response = await fetch(`/course-gen-task-status/${course_gen_task_id}`);
                //     const data = await response.json();
                //     console.log('Course Status Data:', data);
                //     // setProgress(data.progress);
                //     // setStatus(data.state);
        
                //     if (data.state === "SUCCESS" || data.state === "FAILURE") {
                //         clearInterval(interval);
                //     }
                // }, 1000); // Poll every second
        
                // // TODO: test out and fix all bugs; etc. + finalize
                // return () => clearInterval(interval);

            }

        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        wsRef.current = socket;

        return () => {
            socket.close();
        };

    }, []);

    
    const _sendMessage = async (payload) => {

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }

    };

    const handleUserMessageSend = () => {
        let current_user_msg = currentUserInputMessageRef.current;
        accumulatedMessageRef.current = "";

        let all_chat_messages_str = "";
        for (let i = 0; i <= messages.length-1; i++) {
            if (messages[i].sender == 'user'){
                all_chat_messages_str += "USER: " + messages[i].text + "\n";
            } else {
                all_chat_messages_str += "AI: " + messages[i].text + "\n";
            }
        };

        let current_anon_user_id = getFromLocalStorage('user_id');
        const messageForBackend = {
            text: current_user_msg,
            past_messages_string: all_chat_messages_str,
            sender: 'user',
            type: 'user_message',
            anon_user_id: current_anon_user_id
        };
        console.log('message-for-backend:', messageForBackend);

        setMessages((messages) => [...messages, messageForBackend]);
        setCurrentUserInputMessage("");
        _sendMessage(messageForBackend);

    };

    // Chat Messages Event Listener for Local Storage
    useEffect(() => {
        if (messages.length > 0) {
            saveToLocalStorage('new_course_chat_messages', JSON.stringify(messages));
        }
    }, [messages]);


    // Load initial syllabus and user profile if exists for user
    useEffect(() => {
        
        let user_course_state_dict = getFromLocalStorage('user_course_state_dict');
        if (user_course_state_dict){
            
            console.log('saved-user-state-dict:', user_course_state_dict);
            // setUserGeneratedCourseDict(user_course_state_dict);
            // setShowUserCourseModule(true);
            // setShowUserCourseModuleLoading(false);
            
        }

    }, []);


    return (

        <div className="flex-grow overflow-y-scroll no-scrollbar mt-0">
        
            {
                
                (showUserCourseModule === true && showUserCourseModuleLoading === false)
                
                ?

                // Show Course Layout
                (

                    <div className="flex flex-col items-center min-h-screen mt-0">

                        <div className="flex flex-grow w-full max-w-[1100px] py-0">

                            {/* Left Column */}
                            <div className="w-1/2 p-0 pt-0">
                                <h2 className="text-[19px] font-semibold text-gray-800 mb-4">
                                    Shall we now begin... 😅
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600 text-[14px] tracking-normal leading-9 pt-2">
                                            {userGeneratedCourseDict['summary']}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 text-center space-x-4">
                                    <button
                                        type="button"
                                        className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        Let&apos;s Start!
                                        <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                                    </button>
                                </div>
                                
                            </div>

                            <div className="w-1/2 ml-6 flex flex-col pt-0 border-l-2 border-gray-50">
                            </div>

                            {/* Right Column */}
                            {/* <div className="w-2/3 ml-6 flex flex-col pt-0 border-l-2 border-gray-50">
                                
                                <h2 className="text-lg font-semibold text-gray-800 mb-6 ml-8">
                                    {userGeneratedCourseDict['course_name']}
                                </h2>

                                <p className="text-gray-600 text-[15.5px] tracking-normal leading-9 pt-2">
                                    {userGeneratedCourseDict['course_description']}
                                </p>
                                
                                <h2 className="text-lg font-semibold text-gray-800 mb-6 ml-8">
                                    Syllabus
                                </h2>

                                <ol className="relative border-s border-gray-200 dark:border-gray-700 ml-10">
                                    {userGeneratedCourseDict['student_syllabus'].map((item) => (
                                        <li
                                            className="mb-8 ms-4"
                                            key={item.id}
                                        >

                                            <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                                            <a
                                                className="cursor-pointer"
                                            >
                                                <h3 
                                                    className="inline text-lg font-semibold text-blue-600 hover:text-blue-400"
                                                >
                                                    {item.module_name}
                                                </h3>
                                                
                                            </a>

                                            <p className="mb-4 pt-1 text-[15px] font-normal text-gray-500 dark:text-gray-400">
                                                {item.module_description}
                                            </p>

                                        </li>
                                    ))}
                                </ol>

                            </div> */}

                        </div>

                    </div>

                )
                
                :
                (
                 
                    (showUserCourseModule === true && showUserCourseModuleLoading === true)
                    
                    ?
                    
                    // Show Loading
                    (
                        <div className="flex flex-col items-center min-h-screen text-white">
                            {/* Spinner */}
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    
                            {/* Dynamic Text */}
                            <p className="mt-4 text-lg font-normal text-gray-800">{showCourseLoadingText}</p>
                        </div>

                    )

                    :

                    (
                        (showChatLayout === true) ? (
                    
                            // Center this 
                            <div className="flex flex-col h-4/5 dark:bg-gray-900 p-4 max-w-4xl mx-auto min-h-[80vh] max-h-[80vh]">
            
                                <h1 className="mb-6 text-[24px] font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                                    To generate a python course for we, let&apos;s learn a bit more about you first...
                                </h1>
            
                                {/* Messages Area */}
                                <div
                                    // bg-[#F3F4F6] dark:bg-gray-800
                                    className="flex-grow overflow-y-auto p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50"
                                >
            
                                    {/* Message List */}
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`${
                                            msg.sender === "user"
                                                ? "self-end bg-blue-400 text-white"
                                                : "self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            } p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap`}
                                        >
                                            {msg.text}
                                        </div>
                                    ))}
            
                                    {/* Display the streaming message here */}
                                    {isGeneratingMessage && (
                                        <div className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap">
                                            {generatedMessage}
                                        </div>
                                    )}
            
                                </div>
            
                                {/* Input area - textarea */}
                                <div className="flex items-center border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
            
                                    <textarea
                                        value={currentUserInputMessage}
                                        onChange={(e) => handleNewInputValue(e)}                            
                                        className="text-[14px] flex-grow resize-y p-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                                        placeholder="type a message..."
                                        rows={1}
                                        style={{ minHeight: '50px', maxHeight: '120px' }}
                                        disabled={messagesDisabled}
                                    />
            
                                    <button
                                        // className={`${"w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer"}`}
                                        className={`${messagesDisabled ?
                                            "w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer" : 
                                            "w-[100px] py-2 text-[14px] text-white dark:text-black bg-blue-500 dark:bg-gray-500 cursor-not-allowed font-medium rounded-xl"
                                        }`}
                                        onClick={handleUserMessageSend}
                                        disabled={messagesDisabled}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} className="text-white pr-2" />
                                        Send
                                    </button>
            
                                </div>
                            
                            </div>
            
            
                        ): (
            
                            null

                            // <HeroLanding/>
                            // <div className="flex flex-col items-center min-h-screen">
            
                                // <h1 className="mb-4 text-[32px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Learn Python with an <span className="text-blue-600 dark:text-blue-500">AI Teacher</span>.</h1>
            
                                // <p className="mb-0 mt-4 text-[17.5px] font-normal tracking-wide text-gray-500 dark:text-gray-400">
                                //     Let an AI generate a personalized course based on your goals.
                                // </p>
    
                                // <p className="mb-5 mt-2 text-[17.5px] font-normal tracking-wide text-gray-500 dark:text-gray-400">
                                //     This is primarily intended for those who never programmed in Python before...
                                // </p>
    
                                // <button
                                //     type="button"
                                //     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2"
                                //     onClick={handleStartCourseBtnClick}
                                // >
                                //     Let&apos;s Begin! <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                                // </button>
            
                            // </div>
            
                        )

                    )

                )
                

            }

        </div>

    )

};

export default StartLayout;