import { useEffect, useState, useRef } from "react";
import { ResizableBox } from "react-resizable";
import CodeEditor from '../MainLeftSide/CodeEditor';
import ConsoleChatTabs from "../MainRightSide/ConsoleChatTabs";


const MainLayout = () => {
    // const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2); // Initial width for editor
    const [leftWidth, setLeftWidth] = useState(720); // Initial width for editor

    // Parent State
    const [editorCode, setEditorCode] = useState("\ndef hello_world():\n    return 'Hello World'\n\nhello_world()\n");
    const codeStateTmpRef = useRef("\ndef hello_world():\n    return 'Hello World'\n\nhello_world()\n");
    const [chatMessages, setChatMessages] = useState([        
        {
            text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
            sender: "bot",
            complete: true
        }
    ]);

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
    let accumulatedMessage = "";
    
    // Web Socket
    useEffect(() => {

      // Create WebSocket connection
      const socket = new WebSocket(FASTAPI_WEBSOCKET_URL);
  
      socket.onopen = () => {
        console.log("WebSocket connection established");
      };
  
      socket.onmessage = (event) => {
        const message = event.data;
    
        if (message === "MODEL_GEN_COMPLETE") {
      
            setTimeout(() => {
                accumulatedMessage = "";
            }, 0);
    
            setGeneratedMessage("");
            setIsGeneratingMessage(false);
            setIsLoading(false);
            setChatMessages((prevMessages) => [...prevMessages, { text: accumulatedMessage, sender: "bot" }]);
            setMessageSent(true); // Mark that the message has been sent (triggers useEffect)
  
        } else {
  
          accumulatedMessage += message;
          setGeneratedMessage((prevMessage) => prevMessage + message + "");
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

  
    const [messageSent, setMessageSent] = useState(false);  // Flag to track update
    useEffect(() => {
        if (messageSent) {

            console.log('State updated, running dependent logic...', chatMessages);
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
                console.log('messageForBackend:', messageForBackend);
                wsCurrent.send(JSON.stringify(messageForBackend));

            }

        }
      }, [chatMessages, messageSent]);

    const handleSendUserChatMessage = () => {
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

            setSendBtnEnabled(false);
            setIsLoading(true);
            setCurrentUserInputMessage("");
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageSent(true); // Mark that the message has been sent (triggers useEffect)
    
        }

    };


    // Hydration state (for rendering the component correctly on initial load)
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        // Set hydration to true after component mounts (on the client-side)
        setIsHydrated(true);
    }, []);

    // If not hydrated, return nothing (or a loading spinner)
    if (!isHydrated) {
        return null; // or return a loading spinner if desired
    }

    return (

        // f5f5f5
        // f3f3f3
      <div className="flex h-screen pt-0">
        {/* style={{ backgroundColor: "#f3f3f3" }} */}
        
        {/* Left Side */}
        <ResizableBox
            width={leftWidth}
            height={Infinity}
            axis="x"
            minConstraints={[400, Infinity]}
            maxConstraints={[900, Infinity]}
            onResizeStop={(e, data) => setLeftWidth(data.size.width)} // Store the new width
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
            // className="flex flex-col flex-1 h-full bg-[#F5F5F5] dark:bg-gray-900"
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
                
            />
        </div>

      </div>
  
    );
};

export default MainLayout;