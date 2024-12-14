"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSpinner, faHandshake } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


const ConsoleOutput = ({ setCodeState, output, setOutput, setCurrentUserInputMessage, 
  setActiveTab, handleSendUserChatMessage, currentUserInputMessageRef, setSendBtnEnabled, _sendCodeSaveRequest, selectedProgrammingLanguage,
  codeStateTmpRef, _handleCodeEditorValueChange
}) => {

  const [isLoading, setIsLoading] = useState(false);

  const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

  const _sendCodeExecutionRequest = async function (code) {
    
    try {
      const payload = {
        language: selectedProgrammingLanguage.current,
        code: code,
      };
      
      const response = await axios.post(FASTAPI_BASE_URL + '/execute_user_code', payload);

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
      const { result_output_value } = resultResponse.data;
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

        const { status, task_id } = resultResponse.data;

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
    setOutput("loading..."); // Set the console output to loading while request is made
    setIsLoading(true); // Start the loading state
    
    let current_user_code = codeStateTmpRef.current;

    // send request to run code
    _sendCodeExecutionRequest(current_user_code);

    // save user code
    _sendCodeSaveRequest();

  };

  const handleExerciseButtonClick = (exercise_id) => {

    const exercise_code_dict = {
      "exercise_one": `# Exercise 1: Valid Parentheses

# Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
#An input string is valid if:
# - Open brackets must be closed by the same type of brackets.
# - Open brackets must be closed in the correct order.
# - Every close bracket has a corresponding open bracket of the same type.

# Example 1:
# - Input: s = "()"
# - Output: true

# Example 2:
# - Input: s = "()[]{}"
# - Output: true

# Example 3:
# - Input: s = "(]"
# - Output: false

# Example 4:
# - Input: s = "([])"
# - Output: true

def isValid(s):
  raise NotImplementedError
`,
      "exercise_two": `# Exercise 2: Maximum Good Subarray Sum

# You are given an array nums of length n and a positive integer k.
# A subarray of nums is called good if the absolute difference between its first and last element is exactly k, in other words, the subarray nums[i..j] is good if |nums[i] - nums[j]| == k.
# Return the maximum sum of a good subarray of nums. If there are no good subarrays, return 0.

# Example 1:
# - Input: nums = [1,2,3,4,5,6], k = 1
# - Output: 11
# - Explanation: The absolute difference between the first and last element must be 1 for a good subarray. All the good subarrays are: [1,2], [2,3], [3,4], [4,5], and [5,6]. The maximum subarray sum is 11 for the subarray [5,6].

# Example 2:
# - Input: nums = [-1,3,2,4,5], k = 3
# - Output: 11
# - Explanation: The absolute difference between the first and last element must be 3 for a good subarray. All the good subarrays are: [-1,3,2], and [2,4,5]. The maximum subarray sum is 11 for the subarray [2,4,5].

# Example 3:
# - Input: nums = [-1,-2,-3,-4], k = 2
# - Output: -6
# - Explanation: The absolute difference between the first and last element must be 2 for a good subarray. All the good subarrays are: [-1,-2,-3], and [-2,-3,-4]. The maximum subarray sum is -6 for the subarray [-1,-2,-3].

def maximumSubarraySum(nums, k):
  raise NotImplementedError
`,
      "exercise_three": `# Exercise 3: Looping and Conditionals

# Return a list of only even numbers in a given start to end range.

def find_even_numbers(start, end):
  raise NotImplementedError

# Example input:
# start = 1, end = 10
# Example output:
# [2, 4, 6, 8, 10]

# Example input (invalid range):
# start = 10, end = 5
# Example output:
# []
`}

    const codeValue = exercise_code_dict[exercise_id]
    setCodeState(codeValue);
    _handleCodeEditorValueChange(codeValue)

  }

  const handleFeedbackBtn = () => {

    setCurrentUserInputMessage("Can you provide feedback on my code?");
    currentUserInputMessageRef.current = "Can you provide feedback on my code?";
    setSendBtnEnabled(true);
    handleSendUserChatMessage();
    setActiveTab("chat");

  }

  return (
    <div className="flex flex-col h-full mt-2 ml-4 bg-[#F3F4F6] dark:bg-gray-900">

      <span className="text-gray-500 dark:text-gray-400 text-xs pt-2 pb-2 tracking-normal">
        (Ctrl or Cmd)+S to save your code.
      </span>

      <span className="text-gray-500 dark:text-gray-400 text-xs pt-2 pb-2 tracking-normal">
        Work through some sample exercises with the tutor.
      </span>

      <div className="flex space-x-4 pb-2 mt-2">
        <button onClick={() => handleExerciseButtonClick("exercise_one")} className="text-blue-500 dark:text-blue-400 hover:underline text-[12.5px] tracking-normal">Exercise 1</button>
        <button onClick={() => handleExerciseButtonClick("exercise_two")} className="text-blue-500 dark:text-blue-400 hover:underline text-[12.5px] tracking-normal">Exercise 2</button>
        <button onClick={() => handleExerciseButtonClick("exercise_three")} className="text-blue-500 dark:text-blue-400 hover:underline text-[12.5px] tracking-normal">Exercise 3</button>
      </div>

      <hr className="mt-2 mb-1"/>

      <span className="text-gray-500 dark:text-gray-400 text-xs pt-4 pl-1 pb-2 tracking-normal">
        Run your code and the results will be shown in the console below.
      </span>

      <span className="text-gray-500 dark:text-gray-400 text-xs pt-0 pl-1 pb-2 tracking-normal text-[10.5px]">
        <strong>Note:</strong> User Input (input()) can not be captured (as of yet...)
      </span>

      <div className="mt-2 pt-1 pl-2 h-1/2 w-[95%] overflow-y-auto rounded-xl border border-gray-300 dark:border-gray-600 bg-[#f4f5f6] dark:bg-gray-800 text-gray-900">
        {output !== null ? (
          <p className="text-gray-400 dark:text-gray-500 pt-2 pl-1 text-[14px] tracking-normal font-normal whitespace-pre-wrap">
            <span className="text-blue-400">&gt;&gt;</span> {output}
          </p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 pt-2 pl-1 text-[14px] tracking-normal font-normal">
            {/* <span className="text-blue-400">&gt;&gt;</span>  */}
            stdout will appear here...
          </p>
        )}
      </div>

      <div className="flex items-center justify-start space-x-4 mt-4">

        <button
          onClick={handleRun}
          disabled={isLoading}
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

        <button
          onClick={handleFeedbackBtn}
          className={`w-[280px] py-2 px-2 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-500 dark:bg-gray-700 hover:bg-black hover:dark:bg-gray-800`}
        >
          <FontAwesomeIcon icon={faHandshake} className="text-white pr-2" />
          Get Feedback from Companion
        </button>

      </div>

    </div>
  );

};

export default ConsoleOutput;