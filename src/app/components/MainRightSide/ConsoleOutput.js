"use client"; // Add this at the top
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


const ConsoleOutput = ({ codeState, setCodeState, output, setOutput }) => {
  const [isLoading, setIsLoading] = useState(false);

  const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;

  const _sendCodeExecutionRequest = async function (code) {
    try {
      const payload = {
        language: "python",
        code: code,
      };
      
      const response = await axios.post(FASTAPI_BASE_URL + '/execute_user_code', payload);
      // console.log("code-response:", response, response.data);

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
      // console.log("Result Response:", resultResponse);

      const { result_output_status, result_output_value } = resultResponse.data;
      // console.log("Result Output Status TWO:", result_output_status, result_output_value);
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
        // console.log("Result Response:", resultResponse);

        const { status, task_id } = resultResponse.data;
        // console.log("STATUS:", status);

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

  const handleExerciseButtonClick = (exercise_id) => {

    const exercise_code_dict = {
      "exercise_one": `# Exercise 1: Basic Arithmetic Operations (Function-based)

# Implement basic arthimetic, for the function below.

def perform_arithmetic(num1, num2):
    # Step 1: Perform addition, subtraction, multiplication, and division
      # HINT: Use +, -, *, / for these operations.
    # Step 2: Return the results as a tuple or list
    pass  # Remove this line when adding your code

# Example input:
# num1 = 10, num2 = 5
# Example output:
# (15, 5, 50, 2.0)
`,
      "exercise_two": `# Exercise 2: String Manipulation and Functions

# Return an uppercase reversed string representation of the input string,
# removing all vowels.

def process_string(input_string):
    # Step 1: Reverse the string
    # Step 2: Convert the string to uppercase
    # Step 3: Remove vowels from the string  
    pass  # Remove this line when adding your code

# Example input:
# input_string = "example"
# Example output:
# "LPMX"
`,
      "exercise_three": `# Exercise 3: Looping and Conditionals

# Return a list of only even numbers in a given start to end range.

def find_even_numbers(start, end):
    # Step 1: Check if start is greater than end, if so return an error or empty list
    # Step 2: Loop through the range and collect even numbers
    # Step 3: Return the collected even numbers as a list
    pass # Remove this line when adding your code

# Example input:
# start = 1, end = 10
# Example output:
# [2, 4, 6, 8, 10]

# Example input (invalid range):
# start = 10, end = 5
# Example output:
# []
`,}

    const codeValue = exercise_code_dict[exercise_id]
    setCodeState(codeValue);

  }

  // // TODO: Handle on feedback button click
  // const handleFeedbackBtn = () => {
  //   // // TODO: 
  //   // setGeneratedMessage("Can you provide feedback on my code?");
  // }

  return (
    <div className="flex flex-col h-full mt-2 ml-4 bg-[#F3F4F6] dark:bg-gray-900">

      {/* Sample Exercises */}
      <span className="text-gray-500 dark:text-gray-400 text-xs pt-2 pb-2 tracking-normal">
        Work through some sample exercises with the tutor.
      </span>
      <div className="flex space-x-4 pb-2 mt-2">
        {/* setCodeState */}
        <button onClick={() => handleExerciseButtonClick("exercise_one")} className="text-blue-500 dark:text-blue-400 hover:underline text-[12.5px] tracking-normal">Exercise 1</button>
        <button onClick={() => handleExerciseButtonClick("exercise_two")} className="text-blue-500 dark:text-blue-400 hover:underline text-[12.5px] tracking-normal">Exercise 2</button>
        <button onClick={() => handleExerciseButtonClick("exercise_three")} className="text-blue-500 dark:text-blue-400 hover:underline text-[12.5px] tracking-normal">Exercise 3</button>
      </div>

      <hr className="mt-2 mb-1"/>

      {/* Console Output Box */}
      <span className="text-gray-500 dark:text-gray-400 text-xs pt-4 pl-1 pb-2 tracking-normal">
        Run your code and the results will be shown in the console below. More language support coming soon!
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
            <span className="text-blue-400">&gt;&gt;</span> console output will appear here...
          </p>
        )}
      </div>

      {/* <span className="text-gray-500 dark:text-gray-400 text-xs pt-4 pl-1 pb-2 tracking-normal">
        <strong>Note:</strong> User Input can not be captured.
      </span> */}

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

        {/* <button
          onClick={handleFeedbackBtn}
          className={`w-[280px] py-2 px-2 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-500 dark:bg-gray-700 hover:bg-black hover:dark:bg-gray-800`}
        >
          <FontAwesomeIcon icon={faHandshake} className="text-white pr-2" />
          Get Feedback from Companion
        </button> */}

      </div>

    </div>
  );
};

export default ConsoleOutput;