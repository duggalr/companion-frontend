import { useEffect, useRef, useState } from "react";
import useUserContext from "./useUserContext";
import { usePlaygroundContext } from "./usePlaygroundContext";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageUtils";
import { fetchChatMessages } from "@/lib/backend_api/fetchChatMessages";
import { saveUserQuestion } from "@/lib/backend_api/saveUserQuestion";
// import { saveUserCode } from "../backend_api/saveUserCode";
// // import { getFromLocalStorage, saveToLocalStorage } from "../../../lib/utils/localStorageUtils";
// import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageUtils";
// import { saveUserRunCode } from "../api/saveUserRunCode";


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
    const {isAuthenticated, userAccessToken} = useUserContext();
    const { state, dispatch } = usePlaygroundContext();

    const _handleResetChatMessages = async () => {
        setMessages([{
            text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
            sender: "bot",
        }]);
    }

    const _sendMessage = async (payload: MessagePayload) => {

        console.log('PAYLOAD-WEBSOCKET:', payload);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }

    }

    const _handleGetUserQuestion = async () => {

        let qdict;
        if (isAuthenticated) {

            qdict = {
                "user_id": null,
                "question_id": state.question_id,
                "question_name": state.name,
                "question_text": state.question,
                "example_input_output_list": state.input_output_list,
                'lecture_question': state.lecture_question
            }

        } else {

            const current_user_id = getFromLocalStorage("user_id");
            qdict = {
                "user_id": current_user_id,
                "question_id": state.question_id,
                "question_name": state.name,
                "question_text": state.question,
                "example_input_output_list": state.input_output_list,
                'lecture_question': state.lecture_question
            }

        }

        if (state.question_id === null){

            const save_user_response = await saveUserQuestion(
                userAccessToken,
                qdict
            );
    
            const new_question_object_id = save_user_response['data']['question_id'];
    
            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: new_question_object_id,
                name: state.name,
                question: state.question,
                input_output_list: state.input_output_list,
                code: state.code,
                lecture_question: state.lecture_question
            });
    
            if (!isAuthenticated){

                const pg_question_dict = {
                    question_id: new_question_object_id,
                    name: state.name,
                    question: state.question,
                    input_output_list: state.input_output_list,
                    code: state.code
                }
                saveToLocalStorage('playground_question_dict', JSON.stringify(pg_question_dict));
    
            }
    
            return new_question_object_id;

        } else {

            return state.question_id;

        }

    }
    
    const _handleUserMessageSend = async (current_user_message: string) => {

        accumulatedMessageRef.current = "";

        let all_chat_messages_str = "";
        for (let i = 0; i <= messages.length-1; i++) {
            // console.log('mdict:', messages[i]);
            if (messages[i].sender == 'user'){
                all_chat_messages_str += "USER: " + messages[i].text + "\n";
            } else {
                all_chat_messages_str += "AI: " + messages[i].text + "\n";
            }
        }

        // const new_question_object_id = state.question_id;
        
        // TODO: 
            // handle chat for lecture questions; proceed from there and finalize the basic run/save/chat-functionality for lecture-question 
            // complete submission functionality <-- critical for today

        let qid;
        if (state.lecture_question === true){
            qid = state.question_id;
        } else {
            qid = await _handleGetUserQuestion();
        }

        if (isAuthenticated) {

            const user_current_code = state.code;
            const messageForBackend = {
                parent_question_object_id: qid,
                current_problem_name: state.name,
                current_problem_question: state.question,
                text: current_user_message,
                user_code: user_current_code,
                all_user_messages_str: all_chat_messages_str,
                lecture_question: state.lecture_question,
                sender: 'user',
                type: 'user_message',
            };

            setMessages((messages) => [...messages, messageForBackend]);
            _sendMessage(messageForBackend);

        }
        else {

            // let current_user_id = getFromLocalStorage("user_id");
            const user_current_code = state.code;
            const messageForBackend = {
                parent_question_object_id: qid,
                current_problem_name: state.name,
                current_problem_question: state.question,
                text: current_user_message,
                user_code: user_current_code,
                example_input_output_list: state.input_output_list,
                all_user_messages_str: all_chat_messages_str,
                lecture_question: state.lecture_question,
                sender: 'user',
                type: 'user_message',
            };

            setMessages((messages) => [...messages, messageForBackend]);
            _sendMessage(messageForBackend);

        }

    }

    // const sendMessage = useCallback((message: string) => {
    //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    //         wsRef.current.send(message);
    //     }
    // }, []);

    // TODO:
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


    const _handleAuthenticatedChatMessageInitialization = async (question_object_id: string) => {

        if (userAccessToken){
            const user_chat_msg_list = await fetchChatMessages(
                userAccessToken,
                question_object_id,
                state.lecture_question
            );

            console.log('user_chat_msg_list:', user_chat_msg_list);

            if (user_chat_msg_list['data'].length > 0){

                // const messageForBackend = {
                //     parent_question_object_id: state.question_id,
                //     current_problem_name: state.name,
                //     current_problem_question: state.question,
                //     text: current_user_message,
                //     user_code: user_current_code,
                //     all_user_messages_str: all_chat_messages_str,
                //     sender: 'user',
                //     type: 'user_message',
                // };

    //             let tmp_list = [{
    //                 text: `Welcome! 😄 I'm Companion, your personal programming tutor.
    
    // If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
    //                 sender: "bot",
    //             }];
    //             tmp_list.push()

                let initial_message = {
                    text: `Welcome! 😄 I'm Companion, your personal programming tutor.
    
If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                    sender: "bot",
                }
                let user_chat_msg_list_data = user_chat_msg_list['data'];
                user_chat_msg_list_data.unshift(initial_message);
                setMessages(user_chat_msg_list_data);
    
            } else {
    
                setMessages([{
                    text: `Welcome! 😄 I'm Companion, your personal programming tutor.
    
If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                    sender: "bot",
                }]);
    
            }

        }

    }

    useEffect(() => {

        // TODO:
        //    test below and finalize; go from there

        if (isAuthenticated){
            // TODO:
                // fetch messages for the question (qid)
            const url_search_params = new URLSearchParams(window.location.search);
            const lesson_question_object_id = url_search_params.get('lesson_quid');
            const question_object_id = url_search_params.get('qid');

            if (lesson_question_object_id){

                console.log('lesson question id:', lesson_question_object_id);
                _handleAuthenticatedChatMessageInitialization(
                    lesson_question_object_id
                )

            } else if (question_object_id){
                _handleAuthenticatedChatMessageInitialization(
                    question_object_id
                )
            } else {
                setMessages([{
                    text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                    sender: "bot",
                }]);
            }
         
        }
        else {
            
            // // Anon Case
            
            // // Fetch or initialize Anon User ID
            // let current_user_id = getFromLocalStorage('user_id');

            // Fetch Messages
            const user_chat_messages = getFromLocalStorage("user_chat_messages");

            if (user_chat_messages === null || user_chat_messages.length === 0 || user_chat_messages === undefined) {

                setMessages([{
                    text: `Welcome! 😄 I'm Companion, your personal programming tutor.

If you are running into a problem such as a bug in your code, a LeetCode problem, or need help understanding a concept, ask me and I will be more than happy to help.`,
                    sender: "bot",
                }]);

            }
            else{

                const chat_msg_list = JSON.parse(user_chat_messages);
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