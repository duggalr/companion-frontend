import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageUtils";
import { saveToLocalStorage } from '@/lib/utils/localStorageUtils';


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

    const handleEnterKey = (event) => {
        if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey){
            event.preventDefault();

            let current_user_msg = currentUserInputMessageRef.current;
            console.log('current-user-message:', current_user_msg);

            setCurrentUserInputMessage("");
        }
    };


    // Websocket Chat Messages
    const wsRef = useRef(null);
    const accumulatedMessageRef = useRef("");
    const [messages, setMessages] = useState([]);
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Websocket
    useEffect(() => {

        const websocket_url = 'ws://127.0.0.1:8000/ws_learn_about_user';
        const socket = new WebSocket(websocket_url);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const message = event.data;
            console.log('message:', message);

            if (message === "MODEL_GEN_COMPLETE") {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: accumulatedMessageRef.current, sender: "bot" },
                ]);

                setTimeout(() => {
                    setGeneratedMessage("");
                    setIsGeneratingMessage(false);
                    setIsLoading(false);
                }, 50);

            } else {
                accumulatedMessageRef.current += message;
                setGeneratedMessage((prev) => prev + message);
                setIsGeneratingMessage(true);
            }

        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

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

        const messageForBackend = {
            user_message: current_user_msg,
            past_messages_string: all_chat_messages_str,
            sender: 'user',
            type: 'user_message',
        };
        console.log('message-for-backend:', messageForBackend);

        setMessages((messages) => [...messages, messageForBackend]);
        // _sendMessage(messageForBackend);
        
    };

    // Chat Messages Event Listener for Local Storage
    useEffect(() => {
        if (messages.length > 0) {
            saveToLocalStorage('new_course_chat_messages', JSON.stringify(messages));
        }
    }, [messages]);

    return (

        // 
        <div className="flex-grow overflow-y-scroll no-scrollbar mt-16">
        
            {(showChatLayout === true) ? (
                
                // Center this 
                <div className="flex flex-col h-4/5 dark:bg-gray-900 p-4 max-w-4xl mx-auto min-h-[80vh] max-h-[80vh]">

                    <h1 className="mb-6 text-[24px] font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                        Before we start, let&apos;s learn a bit more about you...
                    </h1>

                    {/* Messages Area */}
                    <div
                        // bg-[#F3F4F6] dark:bg-gray-800
                        className="flex-grow overflow-y-auto p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50"
                    >
                        <div
                            className={`self-end bg-blue-400 text-white p-3 rounded-lg w-full max-w-full break-words text-[14px] leading-6 whitespace-pre-wrap`}
                        >
                            Welcome! 👋 I&apos;m <strong>Companion</strong>, your AI teacher and tutor.
                            <br/><br/>
                            I will get you very familiar with Python and will always be there provide feedback and answer any questions you may have, as you go through the course!
                            <br/><br/>
                            Before we start, I&apos;m curious as to why you want to learn Python? Are you just curious? Do you want to become a developer? Do you have a specific project in mind? Maybe you can briefly tell me in a sentence or two...
                            <br/><br/>
                            By giving me this information, I can be of better assistance as you progress the course.
                        </div>

                        {/* <div
                            className={`self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[14px] leading-6 whitespace-pre-wrap`}
                        >
                            Phasellus risus orci, malesuada aliquam dui a, suscipit pulvinar velit. Ut tempor fringilla nisi vitae ultrices.
                        </div> */}

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
                            onKeyDown={handleEnterKey}
                            className="text-[14px] flex-grow resize-y p-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                            placeholder="type a message..."
                            rows={1}
                            style={{ minHeight: '50px', maxHeight: '120px' }}
                        />

                        <button
                            className={`${"w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer"}`}
                            onClick={handleUserMessageSend}
                            disabled={isLoading || !sendBtnEnabled} // Disable when loading or when send button is not enabled
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-white pr-2" />
                            Send
                        </button>

                    </div>
                
                </div>


            ): (

                <div className="flex flex-col items-center min-h-screen">

                    <h1 className="mb-4 text-[32px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Learn Python with an <span className="text-blue-600 dark:text-blue-500">AI Teacher</span>.</h1>

                    <p className="mb-4 mt-1 text-lg font-normal tracking-wide text-gray-500 dark:text-gray-400">
                        This is intended for those who never programmed in Python before...
                    </p>

                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2"
                        onClick={handleStartCourseBtnClick}
                    >
                        Let&apos;s Begin! <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                    </button>

                    </div>

            )}

        </div>
        
    )

};

export default StartLayout;