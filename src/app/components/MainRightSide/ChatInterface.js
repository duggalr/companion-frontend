import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";


const ChatInterface = ({ messages, setMessages, generatedMessage, setGeneratedMessage, isGenerating, setIsGenerating, codeState }) => {

  const [inputValue, setInputValue] = useState("");
  const inputValueRef = useRef("");
  
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sendBtnEnabled, setSendBtnEnabled] = useState(false);

  // const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;
  const FASTAPI_WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  // const [ws, setWs] = useState(null);
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
      // console.log("Received message:", message);
  
      if (message === "MODEL_GEN_COMPLETE") {

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: accumulatedMessage, sender: "bot" },
        ]);

        setTimeout(() => {
          accumulatedMessage = "";
        }, 0);

        setGeneratedMessage("");
        setIsGenerating(false);
        setIsLoading(false);

      } else {

        accumulatedMessage += message;
        setGeneratedMessage((prevMessage) => prevMessage + message + "");
        setIsGenerating(true);

      }

    };
  
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // setWs(socket);
    wsRef.current = socket;

    return () => {
      socket.close();
    };

  }, []);


  const handleSendMessage = () => {

    console.log('user-message:', inputValueRef.current.value, wsRef);
    const userMessage = inputValueRef.current.value;
    const wsCurrent = wsRef.current;

    if (userMessage.trim() !== "" && wsCurrent) {

      console.log('user-message-new:', userMessage);

      let all_chat_messages_str = "";
      for (let i = 0; i < messages.length; i++) {
        all_chat_messages_str += messages[i].text + "\n";
      }
      console.log('all-messages:', all_chat_messages_str);

      const newMessage = {
        text: userMessage,
        user_code: codeState,
        all_user_messages_str: all_chat_messages_str,
        sender: 'user',
        type: 'user_message',
        complete: true
      };
      console.log('message:', newMessage);

      setSendBtnEnabled(false);
      setIsLoading(true);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      wsCurrent.send(JSON.stringify(newMessage));
      setInputValue("");

    }

  };

  const handleNewInputValue = (e) => {

    let user_input_message = e.target.value;
    setInputValue(user_input_message);

    if (user_input_message.trim() !== "") {
      setSendBtnEnabled(true);
    } else {
      setSendBtnEnabled(false);
    }

  };

  // Automatically scroll to the latest message
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]);


  // // TODO: Handle Enter key press to send messages
  // useEffect(() => {

  //   const handleEnterKey = (event) => {
  //     if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey){
  //       event.preventDefault();
  //       if ((inputValueRef.current.value).trim() !== "") {
  //         handleSendMessage();
  //       }
  //     }
  //   };

  //   document.addEventListener("keydown", handleEnterKey);
  //   return () => {
  //     document.removeEventListener('keydown', handleEnterKey);
  //   };

  // }, []);

  return (

    <div className="flex flex-col h-4/5 dark:bg-gray-900 p-4">

      <span className="text-gray-500 dark:text-gray-400 text-xs pt-1 pl-1 pb-4 tracking-normal">
        Get help in guiding your thinking through programming problems, with Companion, an AI Tutor.
      </span>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-[#F3F4F6] dark:bg-gray-800">
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
        {isGenerating && (
          <div className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px]">
            {generatedMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area - textarea */}
      <div className="flex items-center border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
        
        <textarea
          ref={inputValueRef}
          value={inputValue}
          // onChange={(e) => setInputValue(e.target.value)}
          onChange={(e) => handleNewInputValue(e)}
          className="text-[14px] flex-grow resize-none p-3 bg-[#F3F4F6] dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
          placeholder="type a message..."
          rows={1}
          disabled={isLoading}
        />
        
        <button
          onClick={handleSendMessage}
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

  );
};

export default ChatInterface;