import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { MathJax, MathJaxContext } from "better-react-mathjax";

// TODO: start here by fixing generateUserID bug <-- complete Anon case
import generateUserID from "../../../lib/utils/generateAnonUserId";
import {createGeneralTutorParentObject} from "../../../lib/api/createGeneralTutorParentObject"
import {createAnonUser} from "../../../lib/api/createAnonUser"


const MainGeneralTutorLayout = ({ accessToken, userAuthenticated }) => {

    // Websocket State
    const FASTAPI_WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_GENERAL_TUTOR_URL;
    const wsRef = useRef(null);
    const accumulatedMessageRef = useRef("");
    const [messageSent, setMessageSent] = useState(false);  // Flag to track update

    const messagesContainerRef = useRef(null);

    // Generate Tutor Message State
    const inputValueRef = useRef("");
    const [currentUserInputMessage, setCurrentUserInputMessage] = useState('');
    const [generalTutorChatMessages, setGeneralTutorChatMessages] = useState([]);
    const [generatedMessage, setGeneratedMessage] = useState(""); // 
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false); // Track whether we're currently generating a responseState to track the streaming message
    const [loading, showLoading] = useState(true);

    const [chatLoading, setChatIsLoading] = useState(false);
    const [sendBtnEnabled, setSendBtnEnabled] = useState(false);
    

    const _initializeAnonData = async () => {

        // Fetch or initialize Anon User ID
        let user_id = localStorage.getItem("user_id");
        console.log('user-id:', user_id);
        
        if (user_id === null) {
            let new_user_id = await generateUserID();
            localStorage.setItem("user_id", new_user_id);
            // TODO: save new user in backend
            await createAnonUser(new_user_id);
        }

        // Fetching existing messages if any for general tutor conversation
        const storedMessages = localStorage.getItem('general_tutor_conversation_list');
        if (storedMessages === null || storedMessages.length === 0 || storedMessages === undefined) {

            setGeneralTutorChatMessages([{
                text: `Welcome! 😄 I'm Companion, your general tutor.

Feel free to ask me about anything you would like to learn, whether that's a problem you are working on, or a concept that need's further explaining...`,
                sender: "bot",
                complete: true
            }]);
            showLoading(false);

        } 
        else {

            setGeneralTutorChatMessages(JSON.parse(storedMessages));
            showLoading(false);

        }

    }

    const _handleInputTextChange = async (e) => {

        let user_input_message = e.target.value;

        inputValueRef.current = user_input_message;
        setCurrentUserInputMessage(e.target.value);

        if (user_input_message.trim() !== "") {
          setSendBtnEnabled(true);
        } else {
          setSendBtnEnabled(false);
        }

    }

    const _handleSendMessage = async () => {

        let current_msg = inputValueRef.current;
        const wsCurrent = wsRef.current;
        if (current_msg.trim() !== "" && wsCurrent) {

            const newMessage = {
                text: current_msg,
                sender: 'user',
                type: 'user_message',
            };
    
            setSendBtnEnabled(false);
            setChatIsLoading(true);
            setCurrentUserInputMessage("");
            inputValueRef.current = "";
            
            setGeneralTutorChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageSent(true); // Mark that the message has been sent (triggers useEffect)

        }

    }

    const _handleSaveAndMessageSend = async (message_dict) => {

        // TODO: 

        if (userAuthenticated) {

        }
        else {

            // TODO: revise 
            // create parent object first?

            let user_id = localStorage.getItem("user_id");

            let general_tutor_parent_object_res_dict = await createGeneralTutorParentObject(
                user_id,
                null
            );

            let general_tutor_parent_object_id = general_tutor_parent_object_res_dict['general_tutor_parent_object_id'];
            console.log('general_tutor_parent_object_id:', general_tutor_parent_object_id);

            localStorage.setItem("general_tutor_parent_object_id", general_tutor_parent_object_id);
            message_dict['general_tutor_object_id'] = general_tutor_parent_object_id;

            console.log('tmp-new-message-dict:', message_dict);

            let wsCurrent = wsRef.current;
            wsCurrent.send(JSON.stringify(message_dict));

        }

    }

    const handleEnterKey = (event) => {
        if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey){
          event.preventDefault();
          _handleSendMessage();
        }
    };


    const _handleClearMessages = () => {

        setGeneralTutorChatMessages([{
            text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
            sender: "bot",
            complete: true
        }]);

    }

    // TODO: 
    // Handle Message Sending
    useEffect(() => {

        if (messageSent) {

            accumulatedMessageRef.current = "";
            let last_message_dict = generalTutorChatMessages[generalTutorChatMessages.length - 1];
            if (last_message_dict['sender'] == 'user'){

                const wsCurrent = wsRef.current;

                // send to backend via websocket to get response
                let all_chat_messages_str = "";
                for (let i = 0; i < generalTutorChatMessages.length-1; i++) {
                    if (generalTutorChatMessages[i].sender == 'user'){
                        all_chat_messages_str += "USER: " + generalTutorChatMessages[i].text + "\n";
                    } else {
                        all_chat_messages_str += "AI: " + generalTutorChatMessages[i].text + "\n";
                    }
                }

                if (userAuthenticated){
                    // TODO:
                } 
                else {

                    // TODO: start here by first getting the data saved in backend and go from there

                    let general_tutor_object_id = localStorage.getItem('general_tutor_object_id');

                    if (general_tutor_object_id === null) {

                        // Create GeneralTutor object
                        let messageForBackend = {
                            text: last_message_dict['text'],
                            all_past_chat_messages: all_chat_messages_str,
                            sender: 'user',
                            type: 'user_message',
                        };
    
                        _handleSaveAndMessageSend(
                            messageForBackend
                        );
    
                    } else {

                        let messageForBackend = {
                            general_tutor_object_id: general_tutor_object_id,
                            text: last_message_dict['text'],
                            all_past_chat_messages: all_chat_messages_str,
                            sender: 'user',
                            type: 'user_message',
                        };

                        wsCurrent.send(JSON.stringify(messageForBackend));                        

                    }

                    // if (general_tutor_object_id === null) {
                        
                    //     let messageForBackend = {
                    //         text: last_message_dict['text'],
                    //         all_past_chat_messages: all_chat_messages_str,
                    //         sender: 'user',
                    //         type: 'user_message',
                    //     };

                    //     _handleSaveAndMessageSend(
                    //         messageForBackend
                    //     );

                    // } else {

                    //     let messageForBackend = {
                    //         general_tutor_object_id: general_tutor_object_id,
                    //         text: last_message_dict['text'],
                    //         all_past_chat_messages: all_chat_messages_str,
                    //         sender: 'user',
                    //         type: 'user_message',
                    //     };
                        
                    //     wsCurrent.send(JSON.stringify(messageForBackend));

                    // }

                }
            }
        }

    }, [generalTutorChatMessages, messageSent]);


    // Establishing and Handling Websocket Connection
    useEffect(() => {

        const socket = new WebSocket(FASTAPI_WEBSOCKET_URL);
        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {

            const message = event.data;
            if (message === "MODEL_GEN_COMPLETE") {
                // Add accumulated message to chat and then reset accumulated message
                setGeneralTutorChatMessages((prevMessages) => [
                    ...prevMessages, 
                    { text: accumulatedMessageRef.current, sender: "bot" }
                ]);
                
                // Use setTimeout to reset generatedMessage with a short delay
                setTimeout(() => {
                    setGeneratedMessage("");
                    setIsGeneratingMessage(false);
                    // setIsLoading(false);
                    setChatIsLoading(false)
                    setMessageSent(true); // Mark that the message has been sent (triggers useEffect)
                }, 50); // Adjust delay as needed

            } else {
                accumulatedMessageRef.current += message; // Accumulate message
                setGeneratedMessage((prevMessage) => prevMessage + message); // Update visible message
                setIsGeneratingMessage(true);
            }

        };

        socket.onclose = () => {
           // console.log("WebSocket connection closed");
        };

        wsRef.current = socket;
        return () => {
            socket.close();
        };

    }, []);

    // TODO: 
    // Chat Messages Event Listener for Local Storage
    useEffect(() => {
        if (generalTutorChatMessages.length > 0) {
            localStorage.setItem('general_tutor_conversation_list', JSON.stringify(generalTutorChatMessages));
        }
    }, [generalTutorChatMessages]);


    useEffect(() => {

        // TODO: make below into function as not ideal right now to re-use
        
        if (userAuthenticated) {

            // TODO:

        } else {
            
            _initializeAnonData();

        }

    }, []);


    useEffect(() => {
        if (generalTutorChatMessages.length > 1) {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
    }, [generalTutorChatMessages, isGeneratingMessage]);
    

    return (

        <>

            {loading ? (
                // Loading indicator while page is loading
                <div>Loading...</div>
            ) : (

                <MathJaxContext>

                    <div className="flex h-screen">

                        {/* Left Navbar */}
                        <div className="flex flex-col w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 p-4 h-screen pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Past Conversations
                            </h3>

                            {
                                userAuthenticated ? (

                                    <ul className="space-y-3 text-[14px]">
                                        <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
                                            <FontAwesomeIcon 
                                                icon={faComment}
                                                size="sm"
                                                className="pr-1 pl-0 text-gray-800 dark:text-gray-400"
                                            /> Conversation 1
                                        </li>
                                        <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
                                            <FontAwesomeIcon 
                                                icon={faComment}
                                                size="sm"
                                                className="pr-1 pl-0 text-gray-800 dark:text-gray-400"
                                            /> Conversation 2
                                        </li>
                                        <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
                                            <FontAwesomeIcon
                                                icon={faComment}
                                                size="sm"
                                                className="pr-1 pl-0 text-gray-800 dark:text-gray-400"
                                            /> Conversation 3
                                        </li>
                                    </ul>

                                ) : (

                                    <div className="text-gray-500 dark:text-gray-400 text-[12.5px]">
                                        <a href="/api/auth/login" className="font-normal text-blue-500 dark:text-blue-400 hover:underline">Create a free account</a> to save multiple different conversations...
                                    </div>

                                )
                            }

                        </div>
            
                        {/* General Tutor Content */}
                        <div className="flex flex-col justify-start items-center flex-grow bg-[#F3F4F6] dark:bg-gray-900">
            
                            {/* Header */}
                            <div className="flex flex-col text-center pt-6">
                                <h2 className="text-[29px] font-bold">
                                    Chat with Tutor
                                </h2>
                                <p className="text-[14.5px] text-gray-500 dark:text-gray-400 pt-2 tracking-normal">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum.
                                    Need an IDE, visit the <a href="/playground" className="font-medium text-blue-500 dark:text-blue-400 hover:underline">playground</a>.
                                </p>
                                
                            </div>

                            {/* Clear Text Button */}
                            <button className="text-blue-500 text-[13px] pt-4 ml-auto mr-36 pb-1" onClick={_handleClearMessages}>
                                Clear text
                            </button>

                            {/* Messages Div */}
                            <div className="flex justify-center mt-0 w-full px-4">
                                <div
                                    className="overflow-y-auto min-h-[500px] max-h-[500px] w-full max-w-4xl p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-[#F3F4F6] dark:bg-gray-800"
                                    ref={messagesContainerRef}
                                >

                                    {generalTutorChatMessages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            // className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
                                            className={`${
                                                msg.sender === "user"
                                                ? "self-end bg-blue-400 text-white"
                                                : "self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            } p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap`}
                                        >
                                            <MathJax>
                                                {msg.text}
                                            </MathJax>
                                        </div>
                                    ))}

                                    {/* Display the streaming message here */}
                                    {isGeneratingMessage && (
                                        <div className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap">
                                        <MathJax>
                                            {generatedMessage}
                                        </MathJax>
                                        </div>
                                    )}

                                    {/* generalTutorChatMessages */}
                                    {/* <div
                                        className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
                                    >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </div>
            
                                    <div
                                        className="self-end bg-blue-400 text-white p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
                                    >
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </div> */}
                                    
                                </div>
                            </div>
            
                            {/* Input and Button */}
                            <div className="flex justify-center mt-4 w-full px-4">
                                <div className="flex w-full max-w-4xl space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F3F4F6] dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        value={currentUserInputMessage}
                                        onChange={(e) => _handleInputTextChange(e)}
                                        onKeyDown={handleEnterKey}
                                    />
                                    <button
                                        // className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"                                        
                                        disabled={chatLoading || !sendBtnEnabled} // Disable when loading or when send button is not enabled
                                        className={`${sendBtnEnabled && !chatLoading ? 
                                        "w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer" : 
                                        "w-[100px] py-2 text-[14px] text-white dark:text-black bg-blue-500 dark:bg-gray-500 cursor-not-allowed font-medium rounded-xl"
                                        }`}
                                        onClick={_handleSendMessage}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
            
                        </div>
            
                    </div>

                </MathJaxContext>

                

            )}

        </>

    )

};

export default MainGeneralTutorLayout;