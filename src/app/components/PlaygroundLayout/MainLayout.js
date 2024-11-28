import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { ResizableBox } from "react-resizable";
import CodeEditor from '../MainLeftSide/CodeEditor';
import ConsoleChatTabs from "../MainRightSide/ConsoleChatTabs";
import { fetchPlaygroundData }  from "../../../lib/api/fetchPlaygroundData";
import { saveUserRunCode }  from "../../../lib/api/saveUserRunCode";


const PlaygroundLayout = ({ accessToken, userAuthenticated, pageLoading }) => {

    const router = useRouter();

    const [leftWidth, setLeftWidth] = useState(720); // Initial width for editor
    // const [editorCode, setEditorCode] = useState("");
    
    // 1st containing the user code dict
    const [userEditorCodeDict, setUserEditorCodeDict] = useState({});
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
    const accumulatedMessageRef = useRef("");
    const [messageSent, setMessageSent] = useState(false);  // Flag to track update

    // Playground PID Reference
    const currentAuthenticatedPIDRef = useRef(null);

    // Default Code Dictionary
    const defaultLanguageCodeDict = {
        'python': "# Question: Write a hello world program\n\ndef hello_world():\n    return 'Hello World'\n\nhello_world()\n",
        // 'typescript': '#Question: Write a hello world program\n\nfunction helloWorld(): string {\n    return "Hello World";\n}\nconsole.log(helloWorld());\n',

        // 'haskell': '-- Question: Write a hello world program\n\nhelloWorld :: String\nhelloWorld = "Hello World"\n\nmain :: IO ()\nmain = putStrLn helloWorld\n',

//         'rust': `// Question: Write a hello world program\n\nfn hello_world() -> &'static str {
//     "Hello World"
// }

// fn main() {
//     println!("{}", hello_world());
// }
// `,
        'javascript': `// Question: Write a hello world program\n\nfunction helloWorld() {
    return "Hello World";
}

console.log(helloWorld());
`,
    };

    // Current Programming Language State
    const [selectedProgrammingLanguage, setSelectedProgrammingLanguage] = useState(null);
    const selectedProgrammingLangRef = useRef(null);


    const _handleCodeEditorValueChange = (value) => {

        if (userAuthenticated){

            // TODO: 
                // Set coderef to current value
                // update code dict

            codeStateTmpRef.current = value;
            setUserEditorCodeDict((prevState) => ({
                ...prevState,
                 [selectedProgrammingLangRef.current]: value
             }));

        } else {

            codeStateTmpRef.current = value;

            // TODO: do we need to update the editor code state?
            // // setEditorCode(value);
            setUserEditorCodeDict((prevState) => ({
               ...prevState,
                [selectedProgrammingLanguage]: value
            }));
    
            let current_local_storage_code_dict = JSON.parse(localStorage.getItem("user_generated_code_dict"));
            current_local_storage_code_dict[selectedProgrammingLanguage] = value;
            localStorage.setItem("user_generated_code_dict", JSON.stringify(current_local_storage_code_dict));

        }

    }


    const _handlePgLangChange = (value) => {

        if (userAuthenticated){

            selectedProgrammingLangRef.current = value;
            setSelectedProgrammingLanguage(value);

            if (value in userEditorCodeDict){

                let current_code_value = userEditorCodeDict[value];
                codeStateTmpRef.current = current_code_value;
                setEditorCode(current_code_value);

            } else {

                let lg_code_value = defaultLanguageCodeDict[value];
                codeStateTmpRef.current = lg_code_value;

                setUserEditorCodeDict((prevState) => ({
                    ...prevState,
                    value: lg_code_value
                }));
                setEditorCode(lg_code_value);

            }

        } else {

            localStorage.setItem("user_programming_language", value);
            setSelectedProgrammingLanguage(value);
            selectedProgrammingLangRef.current = value;
    
            // Anon Case Below
    
            let existing_user_generated_code_dict = JSON.parse(localStorage.getItem("user_generated_code_dict"));

            if (value in existing_user_generated_code_dict){
    
                let current_code_value = existing_user_generated_code_dict[value];
                codeStateTmpRef.current = current_code_value;
                setEditorCode(current_code_value);

            } else {
    
                let current_code_value = defaultLanguageCodeDict[value];
                codeStateTmpRef.current = current_code_value;
    
                let current_user_code_dict = JSON.parse(localStorage.getItem('user_generated_code_dict'));
                current_user_code_dict[value] = current_code_value;
    
                localStorage.setItem('user_generated_code_dict', JSON.stringify(current_user_code_dict));
                
                setUserEditorCodeDict((prevState) => ({
                    ...prevState,
                    value: current_code_value
                }));
                setEditorCode(current_code_value);
    
            }

        }

    };


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
        
        if (data['status_code'] == 404){
            router.push('/404');
        } else {

            if (data['success'] === true){

                let chat_messages_list = data['chat_messages'];

                if (chat_messages_list.length > 0){
                    setChatMessages(chat_messages_list);
                } else {
                    // default
                    setChatMessages([{
                        text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                        sender: "bot",
                        complete: true
                    }]);
                }

                codeStateTmpRef.current = data['code'];
                setSelectedProgrammingLanguage(data['programming_language']);
                selectedProgrammingLangRef.current = data['programming_language'];
                let current_user_code_dict = {[data['programming_language']]: data['code']};
                setUserEditorCodeDict(current_user_code_dict);
                setEditorCode(data['code']);
                
                // setEditorCode(data['code']);
                // let language_code = defaultLanguageCodeDict['python'];
                // codeStateTmpRef.current = language_code;
                // let current_user_code_dict = {'python': language_code};

                // setSelectedProgrammingLanguage('python');
                // setUserEditorCodeDict(current_user_code_dict);
                // setEditorCode(language_code);
                // // localStorage.setItem("user_generated_code_dict", JSON.stringify(current_user_code_dict));


            } else {
                // TODO: error management?
            }
        }
    };

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
            currentUserInputMessageRef.current = "";
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageSent(true); // Mark that the message has been sent (triggers useEffect)
        }

    }

    const addPidParam = (current_pid) => {
        window.history.pushState({}, '', `/playground?pid=${current_pid}`);
    };
    
    const _sendCodeSaveRequest = async function () {

        if (userAuthenticated === true){

            let payload;
            if (currentAuthenticatedPIDRef.current !== null){

                payload = {
                    code_state: codeStateTmpRef.current,
                    programming_language: selectedProgrammingLangRef.current,
                    parent_playground_object_id: currentAuthenticatedPIDRef.current
                }

            } else {

                payload = {
                    code_state: codeStateTmpRef.current,
                    programming_language: selectedProgrammingLangRef.current,
                }

            }

            let saveCodeRes = await saveUserRunCode(accessToken, payload);

            if (saveCodeRes['status_code'] == 200){

                let current_pid = saveCodeRes['parent_playground_object_id'];
                addPidParam(current_pid);  // update url GET parameters
                // setCurrentAuthenticatedPID(current_pid);
                currentAuthenticatedPIDRef.current = current_pid;

                return saveCodeRes;

            } else {
                // TODO: handle the error
            }

        }
        else {

            // TODO: need to update
            let user_id = localStorage.getItem("user_id");
            // let current_code_state = localStorage.getItem("user_generated_code");
            let user_programming_language = localStorage.getItem("user_programming_language");
            let current_code_state = JSON.parse(localStorage.getItem("user_generated_code_dict"))[user_programming_language];
    
            let current_parent_playground_object_id = localStorage.getItem("parent_playground_object_id");
            let payload;

            if (current_parent_playground_object_id !== null){
    
                payload = {
                    user_id: user_id,
                    programming_language: user_programming_language,
                    code_state: current_code_state,
                    parent_playground_object_id: current_parent_playground_object_id
                };
    
            } else {

                payload = {
                    user_id: user_id,
                    programming_language: user_programming_language,
                    code_state: current_code_state,
                };

            }

            let saveCodeRes = await saveUserRunCode(
                null,
                payload
            );

            return saveCodeRes;

        }

    };

    // Handling User Loading
    useEffect(() => {

        if (pageLoading === false) {

            // Authenticated User Case
            if (userAuthenticated) {

                // let pg_obj_id = searchParams['pid'];
                const url_search_params = new URLSearchParams(window.location.search);
                const pg_obj_id = url_search_params.get('pid');
                
                if (pg_obj_id !== undefined && pg_obj_id !== null) {

                    _handleGetPlaygroundData(pg_obj_id);
                    currentAuthenticatedPIDRef.current = pg_obj_id;

                } else {

                    // render regular page

                    setChatMessages([{
                        text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                        sender: "bot",
                        complete: true
                    }]);

                    // // let hello_world_code = "\ndef hello_world():\n    return 'Hello World'\n\nhello_world()\n";
                    // let hello_world_code = "# Write a hello world program\n\ndef hello_world():\n    return 'Hello World'\n\nhello_world()\n";
                    // codeStateTmpRef.current = hello_world_code;
                    // setEditorCode(hello_world_code);

                    let language_code = defaultLanguageCodeDict['python'];
                    codeStateTmpRef.current = language_code;
                    let current_user_code_dict = {'python': language_code};

                    selectedProgrammingLangRef.current = 'python';

                    setSelectedProgrammingLanguage('python');
                    setUserEditorCodeDict(current_user_code_dict);
                    setEditorCode(language_code);
                    // localStorage.setItem("user_generated_code_dict", JSON.stringify(current_user_code_dict));

                }
            
            } 
            
            // Anon User Case
            else {

                // Fetch or initialize Anon User ID
                let user_id = localStorage.getItem("user_id");
                if (user_id === null) {
                    let rnd_user_id = Math.floor(Math.random() * 1000000000000000000).toString();
                    localStorage.setItem("user_id", rnd_user_id);
                }

                // Fetch user programming language
                let user_programming_language = localStorage.getItem("user_programming_language");
                if (user_programming_language === null) {
                    localStorage.setItem("user_programming_language", 'python');
                    selectedProgrammingLangRef.current = 'python';
                    setSelectedProgrammingLanguage('python');                    
                } else {
                    // TODO: anything done in this case?
                    let current_pg_lang = localStorage.getItem("user_programming_language");
                    selectedProgrammingLangRef.current = current_pg_lang;
                    setSelectedProgrammingLanguage(current_pg_lang);
                }

                // Fetch generated code
                let user_generated_code_dict = localStorage.getItem("user_generated_code_dict");
                if (user_generated_code_dict === null) {
                    let current_user_selected_language = localStorage.getItem("user_programming_language");

                    let language_code = defaultLanguageCodeDict[current_user_selected_language];
                    codeStateTmpRef.current = language_code;
                    let current_user_code_dict = {[current_user_selected_language]: language_code};

                    setUserEditorCodeDict(current_user_code_dict);
                    setEditorCode(language_code);
                    localStorage.setItem("user_generated_code_dict", JSON.stringify(current_user_code_dict));

                } else {

                    let current_user_code_dict = JSON.parse(localStorage.getItem('user_generated_code_dict'));
                    let current_user_selected_language = localStorage.getItem("user_programming_language");
                    let current_user_generated_code = current_user_code_dict[current_user_selected_language];

                    codeStateTmpRef.current = current_user_generated_code;
                    setEditorCode(current_user_generated_code);

                }

                // Fetching any existing messages from localstorage
                const storedMessages = localStorage.getItem('user_generated_message_list');
                if (storedMessages === null || storedMessages.length === 0 || storedMessages === undefined) {

                    setChatMessages([{
                        text: `Welcome! 😄 I'm Companion, your personal programming tutor.
    
If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                        sender: "bot",
                        complete: true
                    }]);

                } 
                else {

                    setChatMessages(JSON.parse(storedMessages));

                }

            }

        }

    }, [accessToken, userAuthenticated, pageLoading]);


    const handleSaveAndChatMsgSend = async function(msg_for_backend) {

        if (userAuthenticated) {

            let code_save_response = await _sendCodeSaveRequest();
    
            let current_parent_playground_object_id = code_save_response['parent_playground_object_id'];
            msg_for_backend['parent_playground_object_id'] = current_parent_playground_object_id;
            currentAuthenticatedPIDRef.current = current_parent_playground_object_id;

            let wsCurrent = wsRef.current;
            wsCurrent.send(JSON.stringify(msg_for_backend));

        }
        else {

            let code_save_response = await _sendCodeSaveRequest();
    
            let current_parent_playground_object_id = code_save_response['parent_playground_object_id'];
            msg_for_backend['parent_playground_object_id'] = current_parent_playground_object_id;
            localStorage.setItem('parent_playground_object_id', current_parent_playground_object_id);
    
            let wsCurrent = wsRef.current;
            wsCurrent.send(JSON.stringify(msg_for_backend));

        }

    };


    // Handle Message Sending
    useEffect(() => {
        if (messageSent) {

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

                if (userAuthenticated){

                    if (currentAuthenticatedPIDRef.current === null){

                        let messageForBackend = {
                            text: last_message_dict['text'],
                            user_code: codeStateTmpRef.current,
                            all_user_messages_str: all_chat_messages_str,
                            sender: 'user',
                            type: 'user_message',
                            complete: true
                        };
                        
                        handleSaveAndChatMsgSend(messageForBackend);

                    } else {

                        let messageForBackend = {
                            parent_playground_object_id: currentAuthenticatedPIDRef.current,
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
                else {

                    let current_parent_playground_object_id = localStorage.getItem("parent_playground_object_id");
                    if (current_parent_playground_object_id === null){
             
                        let messageForBackend = {
                            text: last_message_dict['text'],
                            user_code: codeStateTmpRef.current,
                            all_user_messages_str: all_chat_messages_str,
                            sender: 'user',
                            type: 'user_message',
                            complete: true
                        };

                        handleSaveAndChatMsgSend(
                            messageForBackend
                        );

                    } else {

                        let current_parent_playground_object_id = localStorage.getItem("parent_playground_object_id");                        
                        let messageForBackend = {
                            parent_playground_object_id: current_parent_playground_object_id,
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

            }
        }
    }, [chatMessages, messageSent]);


    // Chat Messages Event Listener for Local Storage
    useEffect(() => {
        if (chatMessages.length > 0) {
            localStorage.setItem('user_generated_message_list', JSON.stringify(chatMessages));
        }
    }, [chatMessages]);


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
                        <CodeEditor
                            codeState={editorCode}
                            // setCodeState={setEditorCode}
                            // codeStateTmpRef={codeStateTmpRef}
                            _sendCodeSaveRequest={_sendCodeSaveRequest}
                            selectedProgrammingLanguage={selectedProgrammingLanguage}
                            _handlePgLangChange={_handlePgLangChange}
                            _handleCodeEditorValueChange={_handleCodeEditorValueChange}
                        />
                    </ResizableBox>

                    {/* Right Side */}
                    {/* // h-full */}
                    <div
                        className="flex flex-col flex-1 bg-[#F3F4F6] dark:bg-gray-900"
                    >
                        <ConsoleChatTabs
                            // codeState={editorCode}
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

                            _sendCodeSaveRequest={_sendCodeSaveRequest}

                            userAuthenticated={userAuthenticated}

                            selectedProgrammingLanguage={selectedProgrammingLangRef}

                            codeStateTmpRef={codeStateTmpRef}
                        />
                    </div>

                </div>

            )}

        </>

    )

};

export default PlaygroundLayout;