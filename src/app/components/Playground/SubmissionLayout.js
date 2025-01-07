import React, { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import useUserContext from "@/lib/hooks/useUserContext";
import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import handleAndSetSolutionSubmission from "@/lib/utils/handleAndSetSolutionSubmission";
import { format } from 'date-fns';


const SubmissionLayout = () => {

    const { isAuthenticated, userAccessToken } = useUserContext();
    const [currentTestCase, setCurrentTestCase] = useState(0);
    const playgroundContext = usePlaygroundContext();
    let currentProblemState = playgroundContext.state;
    let playgroundDispatch = playgroundContext.dispatch;
    const testCaseList = currentProblemState['test_case_list'];

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


    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const _handleSubmitButtonClick = async () => {

        setIsSubmitLoading(true);
        const lecture_qid = currentProblemState.question_id;
        const code = currentProblemState.code;
        
        const solutionSubmitResponse = await handleAndSetSolutionSubmission(
            lecture_qid,
            code,
            userAccessToken,
            currentProblemState,
            playgroundDispatch
        );

        setIsSubmitLoading(false);

        if (solutionSubmitResponse['success'] != true){
            console.log('Error submitting solution:', solutionSubmitResponse);
        }

    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModalDatatype, setSelectedModalDataType] = useState(null);
    const [selectedModalData, setSelectedModalData] = useState(null);

    const _handleViewModalDataClick = async (object_id, data_type) => {

        let current_sub_hist_objects = currentProblemState.user_code_submission_history_objects;
        let modal_data_string = "";
        for (let i=0; i <= current_sub_hist_objects.length-1; i ++){
            let sub_hist_dict = current_sub_hist_objects[i];
            console.log('SUB HISTORY DICTIONARY:', sub_hist_dict)
            if (sub_hist_dict['lc_submission_history_object_id'] == object_id){

                if (data_type === 'code'){
                    modal_data_string = sub_hist_dict['lc_submission_history_code'];
                }
                else if (data_type === 'ai_feedback'){
                    modal_data_string = sub_hist_dict['ai_tutor_submission_feedback'];
                }

            }
        }

        setSelectedModalDataType(data_type);
        setSelectedModalData(modal_data_string);
        setIsModalOpen(true);

    }

    const closeModal = () => {
        setIsModalOpen(false); // Hide the modal
    };

    if (currentProblemState.lecture_question !== true){
        return (
            <div className="p-2 pl-4 pt-4">

                <h1 className="font-semibold text-[17px] mr-2">
                    Submissions
                </h1>

                <p className="pt-4 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
                    Submissions with dynamically generated tests are coming soon to the playground...
                    This feature is currently only available for the Introduction to Python course we offer!
                </p>

            </div>
        );
    }

    if (testCaseList.length === 0){
        return (
            <div className="p-2 pl-4 pt-4">

                <h1 className="font-semibold text-[17px] mr-2">
                    Submissions
                </h1>

                <p className="pt-4 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
                    No test cases available for this question...
                </p>

            </div>
        );
    }

    return (

        <div className="p-4 min-h-screen mb-8">
            
            <div className="flex justify-between items-center mb-6 border-b-[1px] border-gray-300 pb-2">
                <h1 className="font-semibold text-[17px] mr-2">
                    Submissions
                    <span className="text-gray-500 text-[11px] pl-2 pt-1 font-normal">
                        (submissions will take about 10-15 seconds to run...)
                    </span>
                </h1>

                {
                    currentProblemState.lecture_question && currentProblemState.problem_set_question ? (
                        isAuthenticated ? (
                        <Button
                            disabled={isSubmitLoading}    
                            className="w-[130px] py-4 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-green-400 hover:bg-green-500"
                            onClick={_handleSubmitButtonClick}
                        >
                            {isSubmitLoading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                Running...
                            </>
                            ) : (
                            <>Submit Part</>
                            )}
                        </Button>
                        ) : (
                        <button
                            className="w-[130px] py-2 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed"
                            disabled
                        >
                            Submit Part
                        </button>
                        )
                    ) : currentProblemState.lecture_question ? (
                        isAuthenticated ? (
                        <Button
                            disabled={isSubmitLoading}    
                            className="w-[130px] py-4 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-green-400 hover:bg-green-500"
                            onClick={_handleSubmitButtonClick}
                        >
                            {isSubmitLoading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="text-white pr-2" />
                                Running...
                            </>
                            ) : (
                            <>Submit Solution</>
                            )}
                        </Button>
                        ) : (
                        <button
                            className="w-[130px] py-2 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed"
                            disabled
                        >
                            Submit Solution
                        </button>
                        )
                    ) : (
                        <button
                        className="w-[130px] py-2 mr-2 mt-1 text-[14px] text-white font-medium rounded-xl transition-all bg-gray-400 cursor-not-allowed"
                        disabled
                        >
                        Submit Solution
                        </button>
                    )
                }

            </div>

            <MathJaxContext>

                <div className="mb-6">
                    <h2 className="text-base font-semibold">
                        AI Tutor Feedback
                    </h2>

                    {currentProblemState.ai_tutor_feedback !== null ? (
                        
                        <MathJax>
                            <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300 leading-7">
                                {currentProblemState.ai_tutor_feedback}
                            </p>
                        </MathJax>

                    ): (

                        <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-500 dark:text-gray-600">
                            Submit your solution to get feedback from the AI Tutor.
                        </p>

                    )}
                    
                </div>

            </MathJaxContext>


            <h2 className="text-base font-semibold pt-0">
                Test Cases
            </h2>

            {currentProblemState.all_test_cases_passed === true ? (
                <p className="px-0 pt-4 tracking-6 text-[14px] text-gray-800 dark:text-gray-300 font-semibold">
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

            <div className="bg-gray-700 p-5 pb-10 rounded-lg shadow mb-6 mt-4">

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
                        <pre className="bg-gray-600 text-sm p-3 rounded-lg text-gray-200 text-wrap">
                        {testCaseList[currentTestCase].input}
                        {/* TODO: add input */}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">
                        Expected Output
                        </h3>
                        <pre className="bg-gray-600 text-sm p-3 rounded-lg text-gray-200">
                        {testCaseList[currentTestCase].output}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-sm text-gray-300 mb-1">
                        Your Program Output
                        </h3>
                        <pre className="bg-gray-600 text-sm p-3 rounded-lg text-gray-200">

                            {currentProblemState.program_output_result.length > 0 
                            ? currentProblemState.program_output_result[currentTestCase].program_output
                            : ""}

                        </pre>
                    </div>

                </div>

            </div>

            <h2 className="text-base font-semibold pt-0 pb-4">
                Submission History
            </h2>

            {/* Submission History Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-2 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Passed
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Code
                            </th>
                            <th scope="col" className="px-2 py-3">
                                AI Feedback
                            </th>                            
                        </tr>
                    </thead>
                    <tbody>

                       {currentProblemState.user_code_submission_history_objects.length > 0 ? (
                            currentProblemState.user_code_submission_history_objects.map((submission, index) => (
                                <tr
                                    key={index}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <td className="p-3">{format(new Date(submission.lc_submission_history_object_created), "PPpp")}</td>
                                    
                                    <td
                                        className={`p-3 ${
                                            submission.lc_submission_history_object_boolean_result === true
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {submission.lc_submission_history_object_boolean_result.toString()}
                                    </td>
                                    <td 
                                        className="p-3"
                                    >
                                        <span 
                                            onClick={() => _handleViewModalDataClick(submission.lc_submission_history_object_id, 'code')}
                                            className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                        >
                                            View Code
                                        </span>
                                        {/* View Code */}
                                    </td>

                                    <td 
                                        className="p-3"
                                    >
                                        {/* View Feedback */}
                                        <span 
                                            onClick={() => _handleViewModalDataClick(submission.lc_submission_history_object_id, 'ai_feedback')}
                                            className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                        >
                                            View Feedback
                                        </span>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-3">
                                    No submissions have been made.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>


                {/* Modal - for viewing code and submission feedback */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 h-1/2">
                            <h2 className="text-lg font-semibold mb-4">
                                {selectedModalDatatype === 'code' ? (
                                    "Code"
                                ) : (
                                    "Feedback"
                                )}</h2>
                            <pre className="text-sm text-gray-600 bg-gray-100 p-4 rounded overflow-x-auto h-2/3 text-wrap">
                                {selectedModalData}
                            </pre>
                            <Button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-blue-600"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}

            </div>

        </div>
        
    );

}

export default SubmissionLayout;