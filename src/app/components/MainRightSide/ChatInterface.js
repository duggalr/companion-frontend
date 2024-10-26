import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";


const ChatInterface = ({ messages, generatedMessage, isGenerating, currentUserInputMessage, setCurrentUserInputMessage, 
  handleSendUserChatMessage, currentUserInputMessageRef, sendBtnEnabled, setSendBtnEnabled, isLoading
}) => {

  const inputValueRef = useRef("");
  const messagesEndRef = useRef(null);

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

  // Automatically scroll to the latest message
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]);

  const handleEnterKey = (event) => {
    if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey){
      event.preventDefault();
      handleSendUserChatMessage();
    }
  };

  const _handleMessageSend = () => {
    handleSendUserChatMessage();
  }

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
          value={currentUserInputMessage}
          onChange={(e) => handleNewInputValue(e)}
          onKeyDown={handleEnterKey}
          className="text-[14px] flex-grow resize-none p-3 bg-[#F3F4F6] dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
          placeholder="type a message..."
          rows={1}
          disabled={isLoading}
        />
        
        <button
          onClick={_handleMessageSend}
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