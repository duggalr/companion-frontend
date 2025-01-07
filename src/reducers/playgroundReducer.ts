import { PlaygroundState, QuestionInputOutputPair } from '@/context/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/utils/localStorageUtils';

type TestCase = { [key: string]: unknown };

export type PlaygroundAction =
    | {type: "SET_PLAYGROUND_STATE"; question_id: string | null, name: string, question: string, input_output_list: QuestionInputOutputPair[], code: string, console_output: string | null, lecture_question: boolean | null, test_case_list: TestCase | TestCase[] | [], all_test_cases_passed: boolean | null, program_output_result: [], ai_tutor_feedback: null, user_code_submission_history_objects: []}
    | {type: "UPDATE_CODE_STATE"; code: string}
    | {type: "UPDATE_CONSOLE_OUTPUT"; output: string}
    | {type: "UPDATE_TEST_CASE_LIST"; test_case_list: TestCase | TestCase[] | []}
    | {type: "UPDATE_SUBMISSION_RESULTS"; all_test_cases_passed: boolean, program_output_result: [], ai_tutor_feedback: string, user_code_submission_history_objects: []}
    | {type: "UPDATE_QUESTION_ID"; question_id: string}
    | {type: "UPDATE_NEXT_LECTURE_NUMBER_AND_QUESTION"; next_lecture_number: number | null, next_question_object_id: string | null, next_question_object_type: string | null}
    | {type: "SET_PROBLEM_SET_PLAYGROUND_STATE"; question_id: string | null, name: string, question: string, input_output_list: QuestionInputOutputPair[], code: string, lecture_question: boolean | null, test_case_list: TestCase | TestCase[] | [], all_test_cases_passed: boolean | null, program_output_result: [], ai_tutor_feedback: null, user_code_submission_history_objects: [], next_lecture_number: number | null, next_question_object_id: string | null, next_question_object_type: string | null, problem_set_object_id: string | null, problem_set_question: boolean | null, problem_set_current_part: number | null, problem_set_next_part: number | null, problem_set_question_list: { [key: string]: unknown } | null}

// Reducer logic
export const playgroundReducer = (state: PlaygroundState, action: PlaygroundAction): PlaygroundState => {
    switch (action.type) {

        case "SET_PLAYGROUND_STATE": {
            return {
                question_id: action.question_id,
                name: action.name,
                question: action.question,
                input_output_list: action.input_output_list,
                code: action.code,
                console_output: action.console_output,

                lecture_question: action.lecture_question,
                test_case_list: action.test_case_list,
                all_test_cases_passed: action.all_test_cases_passed,
                program_output_result: action.program_output_result,
                ai_tutor_feedback: action.ai_tutor_feedback,

                user_code_submission_history_objects: action.user_code_submission_history_objects,

                next_lecture_number: state.next_lecture_number,
                next_question_object_id: state.next_question_object_id,
                next_question_object_type: state.next_question_object_type,
                
                problem_set_object_id: state.problem_set_object_id,
                problem_set_question: state.problem_set_question,
                problem_set_current_part: state.problem_set_current_part,
                problem_set_next_part: state.problem_set_next_part,
                problem_set_question_list: state.problem_set_question_list
            }
        }

        case "UPDATE_CODE_STATE": {
            const updated_state = { ...state, code: action.code };
            const current_pg_dict = JSON.parse(getFromLocalStorage('playground_question_dict'));
            const updated_pg_dict = {
                ...current_pg_dict,
                code: updated_state.code
            }
            saveToLocalStorage('playground_question_dict', JSON.stringify(updated_pg_dict));

            return updated_state;
        }

        // TODO: 

        case "UPDATE_TEST_CASE_LIST": {
            // TODO: local storage bug?
            return {...state, test_case_list: action.test_case_list};
        }

        case "UPDATE_SUBMISSION_RESULTS": {

            return {
                ...state,
                all_test_cases_passed: action.all_test_cases_passed,
                program_output_result: action.program_output_result,
                ai_tutor_feedback: action.ai_tutor_feedback,
                user_code_submission_history_objects: action.user_code_submission_history_objects
            };

        }

        case "UPDATE_CONSOLE_OUTPUT": {
            return {...state, console_output: action.output};
        }

        case "UPDATE_QUESTION_ID": {
            return {
                ...state,
                question_id: action.question_id
            }
        }

        case "UPDATE_NEXT_LECTURE_NUMBER_AND_QUESTION": {
            return {
                ...state,
                next_lecture_number: action.next_lecture_number,
                next_question_object_id: action.next_question_object_id,
                next_question_object_type: action.next_question_object_type
            }
        }

        case "SET_PROBLEM_SET_PLAYGROUND_STATE": {
            return {

                question_id: action.question_id,
                name: action.name,
                question: action.question,
                input_output_list: action.input_output_list,
                code: action.code,
                console_output: state.console_output,

                lecture_question: action.lecture_question,

                test_case_list: action.test_case_list,
                all_test_cases_passed: action.all_test_cases_passed,
                program_output_result: action.program_output_result,
                ai_tutor_feedback: action.ai_tutor_feedback,

                user_code_submission_history_objects: action.user_code_submission_history_objects,

                next_lecture_number: action.next_lecture_number,
                next_question_object_id: action.next_question_object_id,
                next_question_object_type: action.next_question_object_type,

                problem_set_object_id: action.problem_set_object_id,
                problem_set_question: action.problem_set_question,
                problem_set_current_part: action.problem_set_current_part,
                problem_set_next_part: action.problem_set_next_part,
                problem_set_question_list: action.problem_set_question_list

            }

        }

    }
};