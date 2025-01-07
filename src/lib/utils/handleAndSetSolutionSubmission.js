import { handleSolutionSubmit } from "@/lib/backend_api/handleSolutionSubmit";

export default async function handleAndSetSolutionSubmission(lecture_qid, code, user_access_token, playground_state, dispatch) {

    let solutionSubmitRes = await handleSolutionSubmit(
        user_access_token,
        lecture_qid,
        code
    );

    if (solutionSubmitRes['success'] === true){

        let output_solution_data = solutionSubmitRes['data'];
        let all_test_cases_passed = output_solution_data['all_tests_passed'];
        let program_result_list = output_solution_data['result_list'];
        let ai_feedback_response = output_solution_data['ai_response'];

        // let user_code_submission_history_objects = output_solution_data['']
        let old_user_code_submission_list = playground_state.user_code_submission_history_objects;
        old_user_code_submission_list.unshift({
            'lc_submission_history_object_id': output_solution_data['lc_submission_history_object_id'],
            'lc_submission_history_object_created': output_solution_data['lc_submission_history_object_created'],
            'lc_submission_history_object_boolean_result': output_solution_data['lc_submission_history_object_boolean_result'],
            'lc_submission_history_code': output_solution_data['lc_submission_history_code'],

            'ai_tutor_submission_feedback': ai_feedback_response
        });

        dispatch({
            type: "UPDATE_SUBMISSION_RESULTS",

            all_test_cases_passed: all_test_cases_passed,
            program_output_result: program_result_list,
            ai_tutor_feedback: ai_feedback_response,
            user_code_submission_history_objects: old_user_code_submission_list
        });

        return {'success': true};

    } else {

        return {
            'success': false,
            'message': solutionSubmitRes
        }
        
    }

};