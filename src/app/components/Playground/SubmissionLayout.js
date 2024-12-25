import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";
import useUserContext from "@/lib/hooks/useUserContext";
import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
// import { useSubmissionContext } from "@/lib/hooks/useSubmissionContext";
import { handleSolutionSubmit } from "@/lib/backend_api/handleSolutionSubmit";


// const testCases = [
//     {
//         id: 1,
//         input: "Lorem ipsum input data for test case 1...",
//         expectedOutput: "Lorem ipsum expected output for test case 1...",
//         userOutput: "Lorem ipsum user program output for test case 1...",
//     },
//     {
//         id: 2,
//         input: "Lorem ipsum input data for test case 2...",
//         expectedOutput: "Lorem ipsum expected output for test case 2...",
//         userOutput: "Lorem ipsum user program output for test case 2...",
//     },
//     {
//         id: 3,
//         input: "Lorem ipsum input data for test case 3...",
//         expectedOutput: "Lorem ipsum expected output for test case 3...",
//         userOutput: "Lorem ipsum user program output for test case 3...",
//     },
//     {
//         id: 4,
//         input: "Lorem ipsum input data for test case 4...",
//         expectedOutput: "Lorem ipsum expected output for test case 4...",
//         userOutput: "Lorem ipsum user program output for test case 4...",
//     },
//     {
//         id: 5,
//         input: "Lorem ipsum input data for test case 5...",
//         expectedOutput: "Lorem ipsum expected output for test case 5...",
//         userOutput: "Lorem ipsum user program output for test case 5...",
//     },
// ];

const mockSubmissions = [
    {
      submissionNumber: 1,
      date: "2024-12-21 14:30",
      status: "Pass",
    },
    {
      submissionNumber: 2,
      date: "2024-12-22 10:15",
      status: "Fail",
    },
    {
      submissionNumber: 3,
      date: "2024-12-23 08:45",
      status: "Pass",
    },
];

const SubmissionLayout = ({}) => {

    // TODO:
        // if course question --> show the submission page + handle logic
        // else --> show the coming soon page

    const { isAuthenticated, userAccessToken } = useUserContext();

    const [currentTestCase, setCurrentTestCase] = useState(0);
    // const {playgroundState, playgroundDispatch} = usePlaygroundContext();
    const playgroundContext = usePlaygroundContext();
    let currentProblemState = playgroundContext.state;
    let playgroundDispatch = playgroundContext.dispatch;
    
    console.log('currentProblemState-NEW:', currentProblemState);
    // console.log('tmp-new:', currentProblemState.all_test_cases_passed);
    console.log('tmp-new-two:', currentProblemState.ai_tutor_feedback);
    // console.log('tmp-new-three:', currentProblemState.program_output_result, currentProblemState.program_output_result.length);

    // const [submissionState, submissionDispatch] = useSubmissionContext();
    // console.log('submissionState:', submissionState);

    const testCaseList = currentProblemState['test_case_list'];
    // console.log('pg-state-NEW:', playgroundState);
    // console.log('test-case-list:', testCaseList);

    const handlePrevious = () => {
        if (currentTestCase > 0) {
            setCurrentTestCase((prev) => prev - 1);
        }
    };
    
    const handleNext = () => {
        if (currentTestCase < testCaseList.length - 1) {
            setCurrentTestCase((prev) => prev + 1);
        }
    };

    const _handleSubmitButtonClick = async () => {

        let lecture_qid = currentProblemState.question_id;
        let code = currentProblemState.code;
        console.log("HANDLE SUBMIT BUTTON CLICK:", lecture_qid, code);

        let solutionSubmitRes = await handleSolutionSubmit(
            userAccessToken,
            lecture_qid,
            code
        );
        console.log('solutionSubmitRes:', solutionSubmitRes);

        if (solutionSubmitRes['success'] === true){
            
            let output_solution_data = solutionSubmitRes['data'];
            let all_test_cases_passed = output_solution_data['all_tests_passed'];
            let program_result_list = output_solution_data['result_list'];
            let ai_feedback_response = output_solution_data['ai_response'];

            // TODO: add this to the submission state
            
            playgroundDispatch({
                type: "UPDATE_SUBMISSION_RESULTS",

                all_test_cases_passed: all_test_cases_passed,
                program_output_result: program_result_list,
                ai_tutor_feedback: ai_feedback_response
            });

        }

    }

    useEffect(() => {

        // TODO:
            // we have the quid
                // show testcases
            // define submit test-case function in the context
                // set state to have test-case result loading and navigate to the test-case tab if not already there
            // implement that logic and return the results in dict
                // set state with test-results
                    // set loading to false and show the test-results
        
    }, []);

    return (

        // <div className="p-4 bg-gray-900 min-h-screen text-white">
        <div className="p-4 min-h-screen mb-8">
            
            <div className="flex justify-between items-center mb-6">
                {/* <h1 className="font-semibold text-xl">
                    Submissions
                </h1> */}
                <h1 className="font-semibold text-[17px] mr-2">
                    Submissions
                </h1>
                <Button
                    className="w-[130px] py-4 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-green-400 hover:bg-green-500"
                    onClick={_handleSubmitButtonClick}
                >
                    Submit Solution
                </Button>

                {/* <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow">
                    Submit
                </button> */}
            </div>

            <div className="mb-6">
                <h2 className="text-base font-semibold">
                    AI Tutor Feedback
                </h2>

                {currentProblemState.ai_tutor_feedback !== null ? (

                    <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300">
                        {currentProblemState.ai_tutor_feedback}
                    </p>

                ): (

                    <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300">
                        Submit your solution to get feedback from the AI Tutor.
                    </p>

                )}
                
            </div>


            <h2 className="text-base font-semibold pt-0">
                Test Cases
            </h2>

            {currentProblemState.all_test_cases_passed === true ? (
                <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300">
                    All Test Cases Passed. <FontAwesomeIcon icon={faCheck} className="pr-1 text-green-600 text-[15px] ml-1"/> 
                </p>
            ) : currentProblemState.all_test_cases_passed === false ? (
                <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300">
                    Test Cases Did Not Pass. <FontAwesomeIcon icon={faX} className="pr-1 text-red-600 text-[15px] ml-1"/> 
                </p>
            ) : currentProblemState.all_test_cases_passed === null ?? (
                <div>
                    Submit your solution to determine if test cases have passed.
                </div>
            )}

            {/* <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300">
                All Test Cases Passed. <FontAwesomeIcon icon={faCheck} className="pr-1 text-green-600 text-[15px] ml-1"/> 
            </p> */}

            <div className="bg-gray-800 p-5 pb-10 rounded-lg shadow mb-6 mt-4">

                <div className="flex justify-between items-center mb-4">

                    <button
                        className={`text-gray-400 hover:text-gray-200 text-sm ${
                        currentTestCase === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handlePrevious}
                        disabled={currentTestCase === 0}
                    >
                        ← Previous
                    </button>

                    <span className="text-[15px] text-gray-400 tracking-wide pr-4">
                        Test Case {currentTestCase + 1}/{testCaseList.length}
                    </span>

                    <button
                        className={`text-gray-400 hover:text-gray-200 text-sm ${
                        currentTestCase === testCaseList.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={handleNext}
                        disabled={currentTestCase === testCaseList.length - 1}
                    >
                        Next →
                    </button>

                </div>

                <div className="space-y-6 mt-5">

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">Input</h3>
                        <pre className="bg-gray-700 text-sm p-3 rounded-lg text-gray-200">
                        {testCaseList[currentTestCase].input}
                        {/* TODO: add input */}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">
                        Expected Output
                        </h3>
                        <pre className="bg-gray-700 text-sm p-3 rounded-lg text-gray-200">
                        {testCaseList[currentTestCase].output}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">
                        User Program Output
                        </h3>
                        <pre className="bg-gray-700 text-sm p-3 rounded-lg text-gray-200">

                            {/* {currentProblemState.program_output_result.length > 0 ?? (
                                currentProblemState.program_output_result[currentTestCase]
                            )} */}

                            {currentProblemState.program_output_result.length > 0 
                                ? currentProblemState.program_output_result[currentTestCase].program_output
                                : ""}

                        {/* {testCases[currentTestCase].userOutput} */}
                        {/* TODO: add user output */}
                        </pre>
                    </div>

                </div>

            </div>


            <h2 className="text-base font-semibold pt-0 pb-4">
                Submission History
            </h2>

            {/* Submission History Table */}
            {/* <div className="bg-gray-800 p-4 rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-700 text-gray-300">
                    <th className="p-3">#</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {mockSubmissions.map((submission, index) => (
                    <tr
                        key={index}
                        className={`${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-600"
                        }`}
                    >
                        <td className="p-3">{submission.submissionNumber}</td>
                        <td className="p-3">{submission.date}</td>
                        <td
                        className={`p-3 ${
                            submission.status === "Pass"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                        >
                        {submission.status}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div> */}

            {/* Submission History Table */}
            <div class="relative overflow-x-auto ">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {mockSubmissions.map((submission, index) => (
                            <tr
                                key={index}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <td className="p-3">{submission.submissionNumber}</td>
                                <td className="p-3">{submission.date}</td>
                                <td
                                className={`p-3 ${
                                    submission.status === "Pass"
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                                >
                                {submission.status}
                                </td>
                            </tr>
                        ))}

                        {/* <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                        </tr>
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Microsoft Surface Pro
                            </th>
                            <td class="px-6 py-4">
                                White
                            </td>
                            <td class="px-6 py-4">
                                Laptop PC
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">
                                Black
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                        </tr>
                         */}
                    </tbody>
                </table>
            </div>

        </div>

        // <div className="p-2 pl-4 pt-4">

            // <h1 className="font-semibold text-[17px] mr-2">
            //     Submissions
            // </h1>

            // <p className="pt-4 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
            //     Submissions with dynamically generated tests are coming soon to the playground...
            // </p>

            // <p className="pt-2 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
            //     Currently, this feature is implemented in the <a href="#" className="cursor-pointer text-blue-500 hover:text-blue-400">course (todo)</a>.
            // </p> 

        // </div>
        
    )

}

export default SubmissionLayout;