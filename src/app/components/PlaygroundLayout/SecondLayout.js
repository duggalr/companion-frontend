import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { ResizableBox } from "react-resizable";
import CodeEditor from '../MainLeftSide/CodeEditor';
import ConsoleChatTabs from "../MainRightSide/ConsoleChatTabs";
import fetchPlaygroundData from "../../../lib/fetchPlaygroundData";


const SecondLayout = ({ accessToken, userAuthenticated, pageLoading }) => {

    const [leftWidth, setLeftWidth] = useState(720); // Initial width for editor
    const [editorCode, setEditorCode] = useState("");
    const codeStateTmpRef = useRef("");

    const [chatMessages, setChatMessages] = useState([]);
    const [generatedMessage, setGeneratedMessage] = useState(""); // State to track the streaming message
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false); // Track whether we're currently generating a response
    const [consoleOutput, setConsoleOutput] = useState(null); // To hold the output of the code

    const [currentUserInputMessage, setCurrentUserInputMessage] = useState("");
    const currentUserInputMessageRef = useRef("");

    // Chat send button
    const [isLoading, setIsLoading] = useState(false);
    const [sendBtnEnabled, setSendBtnEnabled] = useState(false);

    // Websocket State
    const FASTAPI_WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    const wsRef = useRef(null);
    // let accumulatedMessage = "";
    const accumulatedMessageRef = useRef("");
    const [messageSent, setMessageSent] = useState(false);  // Flag to track update


    const handleClearChatMessage = () => {
        setChatMessages([{
            text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
            sender: "bot",
            complete: true
        }]);
    }

    const _handleGetPlaygroundData = async (pid) => {
        const data = await fetchPlaygroundData(accessToken, pid);
        console.log('playground data', data);
    };


    
    const handleSendUserChatMessage = () => {

        // TODO: add saving here

        const userMessage = currentUserInputMessageRef.current;
        const wsCurrent = wsRef.current;
        if (userMessage.trim() !== "" && wsCurrent) {
            const newMessage = {
                text: userMessage,
                user_code: editorCode,
                sender: 'user',
                type: 'user_message',
                complete: true
            };

            console.log('new-MESSAGE:', newMessage);

            setSendBtnEnabled(false);
            setIsLoading(true);
            setCurrentUserInputMessage("");
            currentUserInputMessageRef.current = "";
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageSent(true); // Mark that the message has been sent (triggers useEffect)
        }

    }


    // TODO: user loading
    useEffect(() => {

        if (pageLoading === false) {
            console.log("User Authenticated:", userAuthenticated);

            if (userAuthenticated) {
                const searchParams = useSearchParams();
                const pid = searchParams.get('pid');

                if (pid !== undefined) {

                    // TODO: handle this case
                    _handleGetPlaygroundData(pid);

                } else {

                    // render regular page
                    setChatMessages([{
                        text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                        sender: "bot",
                        complete: true
                    }]);

                }

            
            } 
            
            else {

                // Fetch or initialize Anon User ID
                let user_id = localStorage.getItem("user_id");
                if (user_id === null) {
                    let rnd_user_id = Math.floor(Math.random() * 1000000000000000000).toString();
                    localStorage.setItem("user_id", rnd_user_id);
                }

                // Fetch generated code
                let user_generated_code = localStorage.getItem("user_generated_code");
                if (user_generated_code === null) {
                    let hello_world_code = "\ndef hello_world():\n    return 'Hello World'\n\nhello_world()\n";
                    codeStateTmpRef.current = hello_world_code;
                    setEditorCode(hello_world_code);
                    localStorage.setItem("user_generated_code", hello_world_code);
                } else {
                    codeStateTmpRef.current = user_generated_code;
                    setEditorCode(user_generated_code);
                }

                // Fetching any existing messages from localstorage
                const storedMessages = localStorage.getItem('user_generated_message_list');
                setChatMessages(storedMessages? JSON.parse(storedMessages) : [{
                    text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                    sender: "bot",
                    complete: true
                }]);

            }

        }

    }, [accessToken, userAuthenticated, pageLoading]);

    

    // Handle Message Sending
    useEffect(() => {
        if (messageSent) {
            console.log('sent message:', messageSent);

            accumulatedMessageRef.current = "";
            let last_message_dict = chatMessages[chatMessages.length - 1];
            if (last_message_dict['sender'] == 'user'){
                const wsCurrent = wsRef.current;
                // send to backend via websocket to get response
                let all_chat_messages_str = "";
                for (let i = 0; i < chatMessages.length-1; i++) {
                    if (chatMessages[i].sender == 'user'){
                        all_chat_messages_str += "USER: " + chatMessages[i].text + "\n";
                    } else {
                        all_chat_messages_str += "AI: " + chatMessages[i].text + "\n";
                    }
                }

                const messageForBackend = {
                    text: last_message_dict['text'],
                    user_code: codeStateTmpRef.current,
                    all_user_messages_str: all_chat_messages_str,
                    sender: 'user',
                    type: 'user_message',
                    complete: true
                };
                wsCurrent.send(JSON.stringify(messageForBackend));
            }
        }
    }, [chatMessages, messageSent]);


    // TODO: websocket
    useEffect(() => {

        const socket = new WebSocket(FASTAPI_WEBSOCKET_URL);
        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {

            const message = event.data;
            if (message === "MODEL_GEN_COMPLETE") {
                // Add accumulated message to chat and then reset accumulated message
                setChatMessages((prevMessages) => [
                    ...prevMessages, 
                    { text: accumulatedMessageRef.current, sender: "bot" }
                ]);
                
                // Use setTimeout to reset generatedMessage with a short delay
                setTimeout(() => {
                    setGeneratedMessage("");
                    setIsGeneratingMessage(false);
                    setIsLoading(false);
                    setMessageSent(true); // Mark that the message has been sent (triggers useEffect)
                }, 50); // Adjust delay as needed

            } else {
                // accumulatedMessage += message;
                // setGeneratedMessage((prevMessage) => prevMessage + message + "");
                // setIsGeneratingMessage(true);
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



    return (

        <>
            {pageLoading ? (

                <div>
                    Loading...
                </div>

            ) : (

                <div className="flex h-screen pt-0">
                    
                    {/* Left Side */}
                    <ResizableBox
                        width={leftWidth}
                        height={Infinity}
                        axis="x"
                        minConstraints={[400, Infinity]}
                        maxConstraints={[900, Infinity]}
                        onResizeStop={(e, data) => setLeftWidth(data.size.width)}
                        className="relative"
                        resizeHandles={["e"]}
                        handle={
                            <div
                                className="w-[4px] bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-500 hover:bg-blue-500 cursor-ew-resize h-full absolute right-0 top-0 group-hover:w-4 transition-all duration-300 flex items-center justify-center"
                                style={{ touchAction: "none" }}
                            >
                            </div>
                        }
                    >
                        <CodeEditor codeState={editorCode} setCodeState={setEditorCode} codeStateTmpRef={codeStateTmpRef} />
                    </ResizableBox>

                    {/* Right Side */}
                    <div
                        className="flex flex-col flex-1 h-full bg-[#F3F4F6] dark:bg-gray-900"
                    >
                        <ConsoleChatTabs
                            codeState={editorCode}
                            setCodeState={setEditorCode}
                            chatMessages={chatMessages}
                            generatedMessage={generatedMessage}
                            isGeneratingMessage={isGeneratingMessage}
                            consoleOutput={consoleOutput}
                            setConsoleOutput={setConsoleOutput}
                            currentUserInputMessage={currentUserInputMessage}
                            setCurrentUserInputMessage={setCurrentUserInputMessage}
                            handleSendUserChatMessage={handleSendUserChatMessage}
                            currentUserInputMessageRef={currentUserInputMessageRef}

                            sendBtnEnabled={sendBtnEnabled}
                            setSendBtnEnabled={setSendBtnEnabled}

                            isLoading={isLoading}

                            handleClearChatMessage={handleClearChatMessage}

                        />
                    </div>

                </div>

            )}

        </>

    )

};

export default SecondLayout;