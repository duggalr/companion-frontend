import { useEffect, useRef, useState, useCallback } from "react";
import useUserContext from "./useUserContext";
import { usePlaygroundContext } from "./usePlaygroundContext";
// import { getFromLocalStorage, saveToLocalStorage } from "../../../lib/utils/localStorageUtils";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageUtils";
import { saveUserRunCode } from "../api/saveUserRunCode";


interface MessagePayload {
    // parent_playground_object_id: string,
    // text: string,
    // user_code: string,
    // all_user_messages_str: string,
    // sender: string,
    // type: string,

    parent_question_object_id: string,
    current_problem_name: string,
    current_problem_question: string,
    text: string,
    user_code: string,
    all_user_messages_str: string,
    sender: string,
    type: string,
}

export const useWebSocket = (url: string) => {

    const wsRef = useRef<WebSocket | null>(null);
    const accumulatedMessageRef = useRef<string>("");

    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // User Context
    const {isAuthenticated} = useUserContext();
    const { state, dispatch } = usePlaygroundContext();

    const _handleResetChatMessages = async () => {
        setMessages([{
            text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
            sender: "bot",
        }]);
    }

    const _sendMessage = async (payload: MessagePayload) => {

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("SENDING PAYLOAD:", payload);
            wsRef.current.send(JSON.stringify(payload));
        }

    }
    
    const _handleUserMessageSend = async (current_user_message: string) => {

        console.log('current_user_message:',current_user_message);

        accumulatedMessageRef.current = "";

        let all_chat_messages_str = "";
        for (let i = 0; i <= messages.length-1; i++) {
            console.log('mdict:', messages[i]);
            if (messages[i].sender == 'user'){
                all_chat_messages_str += "USER: " + messages[i].text + "\n";
            } else {
                all_chat_messages_str += "AI: " + messages[i].text + "\n";
            }
        }

        console.log('ACCUMLATED MESSAGE STRING:', accumulatedMessageRef.current);


        if (isAuthenticated){
            // TODO:
        }
        else {

            let current_user_id = getFromLocalStorage("user_id");
            let user_current_code = state.code;

            let messageForBackend = {
                parent_question_object_id: state.question_id,
                current_problem_name: state.name,
                current_problem_question: state.question,
                text: current_user_message,
                user_code: user_current_code,
                all_user_messages_str: all_chat_messages_str,
                sender: 'user',
                type: 'user_message',
            };

            setMessages((messages) => [...messages, messageForBackend]);
            _sendMessage(messageForBackend);

            // let current_user_id = getFromLocalStorage("user_id");
            // let current_parent_playground_object_id = getFromLocalStorage("parent_playground_object_id");
            // let user_current_code = state.code;
            // let current_problem_name = state.name;
            // let current_problem_question = state.question;

            // if (current_parent_playground_object_id === null){

            //     let save_pg_object_payload = {
            //         user_id: current_user_id,
            //         programming_language: "python",
            //         code_state: user_current_code,
            //     };

            //     let saveCodeRes = await saveUserRunCode(
            //         null,
            //         save_pg_object_payload
            //     );                
            //     console.log('saved-code-response:', saveCodeRes);

            //     let new_parent_pg_object_id;
            //     if (saveCodeRes['status_code'] === 200){
            //         new_parent_pg_object_id = saveCodeRes['parent_playground_object_id'];
            //         saveToLocalStorage("parent_playground_object_id", new_parent_pg_object_id);
            //     }

                // let messageForBackend = {
                //     parent_playground_object_id: new_parent_pg_object_id,

                //     current_problem_name: current_problem_name,
                //     current_problem_question: current_problem_question,

                //     text: current_user_message,
                //     user_code: user_current_code,
                //     all_user_messages_str: all_chat_messages_str,
                //     sender: 'user',
                //     type: 'user_message',
                //     // complete: true
                // };
                
                // setMessages((messages) => [...messages, messageForBackend]);
                // _sendMessage(messageForBackend);
      
            // } 
            // else {

            //     let messageForBackend = {
            //         parent_playground_object_id: current_parent_playground_object_id,

            //         current_problem_name: current_problem_name,
            //         current_problem_question: current_problem_question,

            //         text: current_user_message,
            //         user_code: user_current_code,
            //         all_user_messages_str: all_chat_messages_str,
            //         sender: 'user',
            //         type: 'user_message',
            //         // complete: true
            //     };
                
            //     setMessages((messages) => [...messages, messageForBackend]);
            //     _sendMessage(messageForBackend);

            // }

        }

    }

    // const sendMessage = useCallback((message: string) => {
    //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    //         wsRef.current.send(message);
    //     }
    // }, []);

    useEffect(() => {

        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const message = event.data;
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

        wsRef.current = socket;

        return () => {
            socket.close();
        };
    }, [url]);


    useEffect(() => {

        // TODO:
        //    test below and finalize; go from there

        if (isAuthenticated){
            // TODO:
        }
        else {
            
            // // Anon Case
            
            // // Fetch or initialize Anon User ID
            // let current_user_id = getFromLocalStorage('user_id');

            // Fetch Messages
            let user_chat_messages = getFromLocalStorage("user_chat_messages");
            console.log('user_chat_messages:', user_chat_messages);

            if (user_chat_messages === null || user_chat_messages.length === 0 || user_chat_messages === undefined) {

                setMessages([{
                    text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                    sender: "bot",
                }]);

            }
            else{
                // TODO: set the messages state to the existing ones from localstorage

                let chat_msg_list = JSON.parse(user_chat_messages);
                console.log('parsed-chat_msg_list:', chat_msg_list);
                setMessages(chat_msg_list);

            }

        }

    }, []);


    // Chat Messages Event Listener for Local Storage
    useEffect(() => {
        if (messages.length > 0) {
            // localStorage.setItem('user_chat_messages', JSON.stringify(messages));
            saveToLocalStorage('user_chat_messages', JSON.stringify(messages));
        }
    }, [messages]);


    return {
        _handleUserMessageSend,
        _handleResetChatMessages,
        // sendMessage,
        messages,
        generatedMessage,
        isGeneratingMessage,
        isLoading,
    };

}