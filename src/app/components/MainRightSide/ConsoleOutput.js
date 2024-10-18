"use client"; // Add this at the top
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


const ConsoleOutput = ({ codeState, output, setOutput }) => {
  const [isLoading, setIsLoading] = useState(false);

  const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;

  const _sendCodeExecutionRequest = async function (code) {
    try {
      const payload = {
        language: "python",
        code: code,
      };
      
      const response = await axios.post(FASTAPI_BASE_URL + '/execute_user_code', payload);
      console.log("code-response:", response, response.data);

      // Get the task ID from the response
      const { task_id } = response.data;

      pollForTaskStatus(task_id);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getTaskResponse = async (task_id) => {
    try {
      const taskResponseURL = FASTAPI_BASE_URL + `/result/${task_id}`;
      const resultResponse = await axios.get(taskResponseURL);
      console.log("Result Response:", resultResponse);

      const { result_output_status, result_output_value } = resultResponse.data;
      console.log("Result Output Status TWO:", result_output_status, result_output_value);
      setOutput(result_output_value);
    } catch (error) {
      console.error("Error polling for result:", error);
    }
  };

  const pollForTaskStatus = async (taskId) => {
    try {
      const taskStatusURL = FASTAPI_BASE_URL + `/task/status/${taskId}`;

      const interval = setInterval(async () => {
        const resultResponse = await axios.get(taskStatusURL);
        console.log("Result Response:", resultResponse);

        const { status, task_id } = resultResponse.data;
        console.log("STATUS:", status);

        if (status === "SUCCESS") {
          clearInterval(interval);
          getTaskResponse(task_id);
          setIsLoading(false); // Stop loading after result is received
        }
      }, 2000); // Poll every 2 seconds
    } catch (error) {
      console.error("Error polling for result:", error);
      setIsLoading(false); // Stop loading if error occurs
    }
  };

  const handleRun = () => {
    console.log("Current Code:", codeState);
    setOutput("loading..."); // Set the console output to loading while request is made
    setIsLoading(true); // Start the loading state
    _sendCodeExecutionRequest(codeState);
  };

  return (
    <div className="flex flex-col h-full mt-2 ml-4 bg-[#F3F4F6] dark:bg-gray-900">

      {/* Console Output Box */}
      <span className="text-gray-500 dark:text-gray-400 text-xs pt-3 pl-1 pb-2 tracking-normal">
        Run your code and the results will be shown in the console below. More language support coming soon!
      </span>

      <div className="mt-2 pt-1 pl-2 h-1/2 w-[95%] overflow-y-auto rounded-xl border border-gray-300 dark:border-gray-600 bg-[#f4f5f6] dark:bg-gray-800 text-gray-900">
        {output !== null ? (
          <p className="text-gray-400 dark:text-gray-500 pt-2 pl-1 text-[14px] tracking-normal font-normal whitespace-pre-wrap">
            <span className="text-blue-400">&gt;&gt;</span> {output}
          </p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 pt-2 pl-1 text-[14px] tracking-normal font-normal">
            <span className="text-blue-400">&gt;&gt;</span> console output will appear here...
          </p>
        )}
      </div>

      <div className="flex items-center justify-start space-x-4 mt-4">
        <button
          onClick={handleRun}
          disabled={isLoading} // Disable button when loading
          className={`w-[110px] py-2 text-[14px] text-white font-medium rounded-xl transition-all 
            ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}`}
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
          ) : (
            <FontAwesomeIcon icon={faPlay} className="text-white pr-2" />
          )}
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>
    </div>
  );
};

export default ConsoleOutput;