import { useState } from "react";
import ConsoleOutput from "./ConsoleOutput";
import ChatInterface from "./ChatInterface";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faComments } from '@fortawesome/free-solid-svg-icons';


const ConsoleChatTabs = ({ 
  setCodeState, chatMessages, generatedMessage, isGeneratingMessage,
  consoleOutput, setConsoleOutput, currentUserInputMessage, setCurrentUserInputMessage, handleSendUserChatMessage, currentUserInputMessageRef,
  sendBtnEnabled, setSendBtnEnabled, isLoading, handleClearChatMessage, _sendCodeSaveRequest, userAuthenticated, selectedProgrammingLanguage, codeStateTmpRef, _handleCodeEditorValueChange
}) => {
  
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState("console");

  const _handleNewFileClick = () => {
    window.location.href = '/playground';
  };

  return (
    
    <div className="flex flex-col h-full">

      <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900">
        <div class="flex justify-between items-center">
          <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
              <a
                className={`inline-block p-0 px-6 pb-2 pt-3 text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:text-gray-700 rounded-t-lg active dark:border-blue-500 cursor-pointer ${activeTab === "console" ? "border-b-2 border-gray-300 text-gray-800 dark:text-blue-500 dark:border-blue-500" : ""}`}
                aria-current="page"
                onClick={() => setActiveTab("console")}
              >   
                <FontAwesomeIcon 
                  icon={faTerminal}
                  size="sm"
                  className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                />
                Console
              </a>
            </li>
            <li class="me-2">
              <a
                class={`inline-block p-0 px-6 pb-2 pt-3 rounded-t-lg text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${activeTab === "chat" ? "border-b-2 border-gray-300 text-gray-800 dark:text-blue-500 dark:border-blue-500 " : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                <FontAwesomeIcon 
                  icon={faComments}
                  size="sm"
                  className="pr-2 pl-0 text-gray-800 dark:text-gray-400"
                />
                Tutor
              </a>
            </li>
          </ul>

          {userAuthenticated ? 
            (
              <span
                onClick={_handleNewFileClick}
                // class="text-gray-600 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                className="text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 px-4 py-2 mt-1 cursor-pointer"
              >
                + Create New File
              </span>
            )
            :
            (
              <span
                onClick={_handleNewFileClick}
                // class="text-gray-600 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                className="text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 px-4 py-2 mt-1 cursor-pointer text-[12px] font-normal"
              >
                Create a <a href="/api/auth/login" className="cursor-pointer text-blue-500 hover:text-blue-400">
                  free account
                </a> to save multiple files
              </span>
            )
          }


          {/* {userAuthenticated && <span
            onClick={_handleNewFileClick}
            // class="text-gray-600 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            className="text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 px-4 py-2 mt-1 cursor-pointer"
          >
            + Create New File
          </span>}
          
          <span
            onClick={_handleNewFileClick}
            // class="text-gray-600 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            className="text-gray-600 dark:text-gray-500 hover:text-gray-700 hover:border-gray-300 px-4 py-2 mt-1 cursor-pointer text-[12px] font-normal"
          >
            Create a <a href="/api/auth/login" className="cursor-pointer text-blue-500 hover:text-blue-400">
              free account
            </a> to save multiple files
          </span> */}

        </div>
      </div>


      {/* Content */}
      <div className="flex-grow overflow-y-scroll no-scrollbar">
        {activeTab === "console" && <ConsoleOutput
          // codeState={codeState}
          setCodeState={setCodeState}
          output={consoleOutput}
          setOutput={setConsoleOutput}
          setCurrentUserInputMessage={setCurrentUserInputMessage}
          setActiveTab={setActiveTab}
          handleSendUserChatMessage={handleSendUserChatMessage}
          currentUserInputMessageRef={currentUserInputMessageRef}
          setSendBtnEnabled={setSendBtnEnabled}
          _sendCodeSaveRequest={_sendCodeSaveRequest}
          selectedProgrammingLanguage={selectedProgrammingLanguage}
          codeStateTmpRef={codeStateTmpRef}
          _handleCodeEditorValueChange={_handleCodeEditorValueChange}
        />}

        {activeTab === "chat" && <ChatInterface messages={chatMessages}
          generatedMessage={generatedMessage}
          isGenerating={isGeneratingMessage}
          currentUserInputMessage={currentUserInputMessage}
          setCurrentUserInputMessage={setCurrentUserInputMessage}
          handleSendUserChatMessage={handleSendUserChatMessage}
          currentUserInputMessageRef={currentUserInputMessageRef}
          sendBtnEnabled={sendBtnEnabled}
          setSendBtnEnabled={setSendBtnEnabled}
          isLoading={isLoading}
          handleClearChatMessage={handleClearChatMessage}
          userAuthenticated={userAuthenticated}
        />}

      </div>
      
    </div>

  );
};

export default ConsoleChatTabs;