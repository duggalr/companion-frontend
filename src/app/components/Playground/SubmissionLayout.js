import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";
import useUserContext from "@/lib/hooks/useUserContext";
import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import { handleSolutionSubmit } from "@/lib/backend_api/handleSolutionSubmit";


const SubmissionLayout = ({}) => {

    const { isAuthenticated, userAccessToken } = useUserContext();
    const [currentTestCase, setCurrentTestCase] = useState(0);
    const playgroundContext = usePlaygroundContext();
    let currentProblemState = playgroundContext.state;
    let playgroundDispatch = playgroundContext.dispatch;
    const testCaseList = currentProblemState['test_case_list'];
    console.log('currentProblemState-NEW:', currentProblemState);
    console.log('tmp-new-two:', currentProblemState.ai_tutor_feedback);

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


            // let user_code_submission_history_objects = output_solution_data['']
            let old_user_code_submission_list = currentProblemState.user_code_submission_history_objects;
            old_user_code_submission_list.push({
                'lc_submission_history_object_id': output_solution_data['lc_submission_history_object_id'],
                'lc_submission_history_object_created': output_solution_data['lc_submission_history_object_created'],
                'lc_submission_history_object_boolean_result': output_solution_data['lc_submission_history_object_boolean_result'],
                'lc_submission_history_code': output_solution_data['lc_submission_history_code'],
            });

            console.log('old_user_code_submission_list-NEW:', old_user_code_submission_list);

            // TODO: add this to the submission state

            playgroundDispatch({
                type: "UPDATE_SUBMISSION_RESULTS",

                all_test_cases_passed: all_test_cases_passed,
                program_output_result: program_result_list,
                ai_tutor_feedback: ai_feedback_response,
                user_code_submission_history_objects: old_user_code_submission_list
            });

        }

    }


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedViewCode, setSelectedViewCode] = useState(null);

    const _handleViewCodeClick = async (object_id) => {

        console.log('OBJECT ID:', object_id);
        
        let current_sub_hist_objects = currentProblemState.user_code_submission_history_objects;
        let current_selected_code = "";
        for (let i=0; i <= current_sub_hist_objects.length-1; i ++){
            let sub_hist_dict = current_sub_hist_objects[i];
            // console.log(sub_hist_dict)
            if (sub_hist_dict['lc_submission_history_object_id'] == object_id){
                console.log('sub-hist-dict:', sub_hist_dict);
                current_selected_code = sub_hist_dict['lc_submission_history_code'];
            }
        }

        setSelectedViewCode(current_selected_code);
        setIsModalOpen(true);

    }

    const closeModal = () => {
        setIsModalOpen(false); // Hide the modal
    };

    useEffect(() => {

    }, []);


    if (currentProblemState.lecture_question === false){
        return (
            <div className="p-2 pl-4 pt-4">

                <h1 className="font-semibold text-[17px] mr-2">
                    Submissions
                </h1>

                <p className="pt-4 leading-7 text-[14px] text-gray-600 dark:text-gray-300">
                    Submissions with dynamically generated tests are coming soon to the playground...
                </p>

            </div>
        )
    }

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

            {/* TODO: add submission history and render and add submission history functionaltiy */}

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
            <div class="relative overflow-x-auto ">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {/* <th scope="col" class="px-6 py-3">
                                #
                            </th> */}
                            <th scope="col" class="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Code
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
                                    {/* <td className="p-3">{submission.lc_submission_history_object_id}</td> */}
                                    <td className="p-3">{submission.lc_submission_history_object_created}</td>
                                    <td
                                        className={`p-3 ${
                                            submission.lc_submission_history_object_boolean_result === true
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {submission.lc_submission_history_object_boolean_result.toString()}
                                    </td>
                                    <td className="p-3" onClick={() => _handleViewCodeClick(submission.lc_submission_history_object_id)}>
                                        View Code
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center p-3">
                                    No submissions have been submitted.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>


                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                            <h2 className="text-lg font-semibold mb-4">View Code</h2>
                            {/* <p className="text-sm text-gray-600">
                                {selectedViewCode}
                            </p> */}
                            <pre className="text-sm text-gray-600 bg-gray-100 p-4 rounded overflow-x-auto">
                                {selectedViewCode}
                            </pre>
                            <button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

            </div>

        </div>
        
    );

}

export default SubmissionLayout;