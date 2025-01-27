import React, { useState, useRef, useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageUtils";
import {  getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';
import NewHeroNavbar from './NewHeroNavbar';
// import FlipText from "@/components/ui/flip-text";


const StartLayout = () => {

    const [showChatLayout, setShowChatLayout] = useState(true);
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

    // TODO:
        // start by creating the type-writer effect for this as it appears
        // go from there

    const initialMessageConstant = `Hey there! I'm Companion, your AI Teacher here to help you learn Python and achieve your learning goals! 💪

This course is built entirely from scratch, personalized to your unique objectives and the project you want to bring to life. 🎯

We’ll take a hands-on, project-based approach because that’s the best way to learn programming. Together, we’ll choose a project that excites you and make it happen!

Let’s start with something simple: What’s your name, my friend? 🤔`;
        
    const [messages, setMessages] = useState([{
        text: initialMessageConstant,
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
        currentUserInputMessageRef.current = "";
        setSendBtnEnabled(false);

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
            setUserGeneratedCourseDict(user_course_state_dict);
            setShowUserCourseModule(true);
            setShowUserCourseModuleLoading(false);

        }

    }, []);

    
    // Initial Animations
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });
    }, []);

    
    const typeWriterEffectActive = useRef(false);
    const [initialTypeWritedMessage, setInitialTypeWritedMessage] = useState('');
    const _createTypewriterEffect = (text, set_text_fn, current_index) => {
        if (current_index < text.length) {

            // Delay the typing effect by 20ms
            setTimeout(() => {

                // Append the next character from text
                set_text_fn(previousText => previousText + text[current_index]);
    
                // Recursive call with the next index
                _createTypewriterEffect(text, set_text_fn, current_index + 1);  
                
            }, 5);

        }
    };

    const handleEnterKey = (event) => {
        if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey){
            event.preventDefault();

            if (currentUserInputMessageRef.current.trim() !== ""){
            
                handleUserMessageSend();
                setCurrentUserInputMessage("");
            }

            // let current_user_msg = currentUserInputMessageRef.current;
            // _handleUserMessageSend(current_user_msg);
        }
    };


    const handleBeginCourseClick = () => {
        window.location.href = '/learn-python/home';
    }


    // Initial Type Writer Text Effect
    useEffect(() => {
        if (typeWriterEffectActive.current === false){
            typeWriterEffectActive.current = true;
            console.log('initial-message:', initialMessageConstant)
            _createTypewriterEffect(
                initialMessageConstant,
                setInitialTypeWritedMessage,
                0,
            );
        }
    }, [initialMessageConstant]);


    // Messages Component State
    const messagesContainerRef = useRef(null);
    useEffect(() => {
        if (messages.length > 1) {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isGeneratingMessage]);

    return (

        <>
        
            <NewHeroNavbar />

            <div className="flex-grow overflow-y-scroll no-scrollbar mt-0">
        
                {
                    
                    (showUserCourseModule === true && showUserCourseModuleLoading === false)

                    ?

                    // Show Course Layout
                    (

                        <div className="flex flex-col items-center min-h-screen mt-4">

                            {/* <div className="max-w-[1000px] ml-0 flex flex-col pt-0 border-l-[1px] border-gray-100 dark:border-gray-600 pl-6">
                                    
                                <h2 
                                    // className="text-lg font-semibold text-gray-800 mb-6 ml-8"
                                    className="mb-6 text-[24px] font-bold leading-none tracking-tight text-gray-900 dark:text-white"
                                    data-aos="fade-down"
                                >
                                    {userGeneratedCourseDict['course_name']}{" "}🎯
                                </h2>

                                <p 
                                    className="text-gray-500 dark:text-gray-400 text-[15.5px] tracking-normal leading-9 pt-2 pr-1"
                                    data-aos="fade-down"
                                >
                                    {userGeneratedCourseDict['course_description']}
                                </p>

                            </div> */}

                            <div className="flex flex-grow w-full max-w-[1200px] py-0">

                                {/* Left Column */}
                                <div className="w-1/2 p-0 pt-0 pr-2">
                                    
                                    <h2
                                        // className="text-[20px] font-semibold text-gray-800 mb-4"
                                        className="mb-6 text-[25px] font-bold leading-none tracking-tight text-gray-900 dark:text-white"
                                        data-aos="fade-down"
                                    >
                                        Your journey <span className="text-blue-600 dark:text-blue-500">begins now...</span> 😅
                                    </h2>

                                    <p
                                    // text-gray-400 dark:text-gray-400
                                        className="text-gray-500 dark:text-gray-400 text-[16px] tracking-normal leading-9 pt-2 pr-4"
                                        data-aos="fade-down"
                                    >
                                        {/* {userGeneratedCourseDict['summary']} */}
                                        {userGeneratedCourseDict['course_description']}
                                    </p>

                                    <div
                                        className="mt-10 mr-6 text-center space-x-0"
                                        data-aos="fade-up"
                                    >
                                        <InteractiveHoverButton 
                                            text="Begin!"
                                            className="mt-0 text-[17.5px]"
                                            // className='mt-0 text-[18.5px] py-2.5'
                                            onClick={handleBeginCourseClick}
                                        />
                                    </div>
                                    
                                </div>

                                {/* TODO: pick it up from here tomorrow <-- first reflect + concentration */}

                                {/* Right Column */}
                                <div
                                    className="w-1/2 ml-0 flex flex-col pt-0 border-l-[1px] border-gray-100 dark:border-gray-600 pl-6"
                                >
                                    
                                    {/* <h2 
                                        // className="text-lg font-semibold text-gray-800 mb-6 ml-8"
                                        className="mb-6 text-[24px] font-bold leading-none tracking-tight text-gray-900 dark:text-white"
                                        data-aos="fade-down"
                                    >
                                        {userGeneratedCourseDict['course_name']}{" "}🎯
                                    </h2>

                                    <p 
                                        className="text-gray-500 dark:text-gray-400 text-[15.5px] tracking-normal leading-9 pt-2 pr-1"
                                        data-aos="fade-down"
                                    >
                                        {userGeneratedCourseDict['course_description']}
                                    </p> */}
                                        
                                    {/* <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" /> */}

                                    <h2 
                                        // className="text-lg font-semibold text-gray-800 mb-6 ml-8"
                                        className="mt-1 mb-6 text-[25px] font-bold leading-none tracking-tight text-gray-900 dark:text-white"
                                        data-aos="fade-down"
                                    >
                                        What we will go through together{" "}🎯
                                    </h2>

                                    <ol
                                        data-aos="fade-up"
                                        // className="relative border-s border-gray-200 dark:border-gray-700"
                                        className="pt-2"
                                    >
                                        {userGeneratedCourseDict['student_syllabus'].map((item) => (
                                            <li
                                                className="mb-8 ms-1"
                                                key={item.id}
                                            >

                                                <a
                                                    // className="cursor-pointer"
                                                >
                                                    <h3 
                                                        className="inline text-lg font-semibold text-blue-500 hover:text-blue-400"
                                                    >
                                                        {item.module_name}
                                                    </h3>
                                                    
                                                </a>

                                                <p
                                                    className="mb-4 pt-2 leading-6 text-[15px] tracking-normal font-normal text-gray-400 dark:text-gray-400"
                                                >
                                                    <FontAwesomeIcon icon={faArrowRight} className="pr-2" />
                                                    {item.module_description}

                                                </p>

                                            </li>
                                        ))}
                                    </ol>

                                </div>

                            </div>

                        </div>

                    )
                    
                    :
                    (
                    
                        (showUserCourseModule === true && showUserCourseModuleLoading === true)
                        
                        ?
                        
                        // Show Loading
                        (
                            <div className="flex flex-col items-center min-h-screen mt-12">
                                
                                {/* Spinner */}
                                <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin "></div>
                                {/* <p className="mt-4 text-lg font-normal text-gray-800">{showCourseLoadingText}</p> */}
                                <p className="mt-6 text-[16px] font-normal text-gray-500 tracking-normal">
                                    Thank you! I'm generating a syllabus for your course... it will take me about 10-20 seconds... 😅
                                </p>

                            </div>

                        )

                        :

                        (
                            (showChatLayout === true) ? (                                
                        
                                // Center this 
                                <div
                                    className="flex flex-col p-4 max-w-4xl mx-auto min-h-[88vh] max-h-[90vh] mt-0" 
                                    data-aos="fade-in"
                                >
                                    {/* dark:bg-gray-900 */}
                                    <h1 
                                        className="mb-6 text-[26px] font-bold leading-none tracking-tight text-gray-900 dark:text-gray-300"
                                        data-aos="fade-down"
                                    >
                                        {/* To generate a python course for we, let&apos;s learn a bit more about you first... */}
                                        Welcome! 👋 To begin, let&apos;s learn a bit about <span className="text-blue-600 dark:text-blue-500">you...</span>
                                    </h1>

                                    {/* Messages Area */}
                                    <div
                                        // bg-[#F3F4F6] dark:bg-gray-800
                                        className="flex-grow overflow-y-auto p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800"
                                        ref={messagesContainerRef}
                                    >

                                        {/* Message List */}

                                        {messages.length > 1 ? (
                                            messages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`${
                                                        msg.sender === "user"
                                                            ? "self-end bg-blue-400 text-white"
                                                            : "self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    } p-5 rounded-2xl w-full max-w-full break-words text-[14.5px] whitespace-pre-wrap`}
                                                >
                                                    {msg.text}
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className={`${"self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"} p-5 rounded-2xl w-full max-w-full break-words text-[14.5px] whitespace-pre-wrap`}
                                            >
                                                {initialTypeWritedMessage}
                                            </div>
                                        )}
                
                                        {/* Display the streaming message here */}
                                        {isGeneratingMessage && (
                                            <div className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-5 rounded-2xl w-full max-w-full break-words text-[14.5px] whitespace-pre-wrap">
                                                {generatedMessage}
                                            </div>
                                        )}
                
                                    </div>
                
                                    {/* Input area - textarea */}
                                    <div className="flex items-center border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                
                                        <textarea
                                            onKeyDown={handleEnterKey}
                                            value={currentUserInputMessage}
                                            onChange={(e) => handleNewInputValue(e)}                            
                                            className="text-[14px] flex-grow resize-y p-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                                            placeholder="type a message..."
                                            rows={1}
                                            style={{ minHeight: '50px', maxHeight: '120px' }}
                                            disabled={messagesDisabled}
                                        />
                
                                        {/* <button
                                            // className={`${"w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer"}`}
                                            className={`${sendBtnEnabled ?
                                                "w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer" : 
                                                "w-[100px] py-2 text-[14px] text-white dark:text-black bg-blue-500 dark:bg-gray-500 cursor-not-allowed font-medium rounded-xl"
                                            }`}
                                            onClick={handleUserMessageSend}
                                            disabled={sendBtnEnabled}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} className="text-white pr-2" />
                                            Send
                                        </button> */}

                                        <button
                                            onClick={handleUserMessageSend}
                                            disabled={isLoading || !sendBtnEnabled} // Disable when loading or when send button is not enabled
                                            className={`${sendBtnEnabled && !isLoading ? 
                                                "w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer" : 
                                                "w-[100px] py-2 text-[14px] text-white dark:text-black bg-blue-500 dark:bg-gray-500 cursor-not-allowed font-medium rounded-xl"
                                            }`}
                                        >
                                            {isLoading ? (
                                                <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                            ) : (
                                                <FontAwesomeIcon icon={faPaperPlane} className="text-white pr-2" />
                                            )}
                                            {isLoading ? "" : "Send"}
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

        
        </>


        

    )

};

export default StartLayout;