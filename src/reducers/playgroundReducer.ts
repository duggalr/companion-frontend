// import { saveToLocalStorage } from "../utils/localStorageUtils"; // Assuming this utility handles localStorage
// import { PlaygroundState, QuestionInputOutputPair } from '../context/types';
// import { INITIAL_QUESTION_LIST } from '@/lib/constants/initial_question_list';
import { PlaygroundState, QuestionInputOutputPair } from '@/context/types';
import { saveToLocalStorage } from '@/lib/utils/localStorageUtils';

// TODO: start here by setting the testcase state and proceed from there to implementing the submission functionality
type TestCase = { [key: string]: any };

export type PlaygroundAction =
    | {type: "SET_QUESTION_INPUT_OUTPUT"; question_id: string | null, name: string, question: string, input_output_list: QuestionInputOutputPair[], code: string, lecture_question: boolean | null, test_case_list: TestCase | TestCase[] | [], all_test_cases_passed: boolean | null, program_output_result: [], ai_tutor_feedback: null, user_code_submission_history_objects: []}
    | {type: "UPDATE_CODE_STATE"; code: string}
    | {type: "UPDATE_CONSOLE_OUTPUT"; output: string}
    | {type: "UPDATE_TEST_CASE_LIST"; test_case_list: TestCase | TestCase[] | []}
    | {type: "UPDATE_SUBMISSION_RESULTS"; all_test_cases_passed: boolean, program_output_result: [], ai_tutor_feedback: string, user_code_submission_history_objects: []}

// Reducer logic
export const playgroundReducer = (state: PlaygroundState, action: PlaygroundAction): PlaygroundState => {
    switch (action.type) {

        case "SET_QUESTION_INPUT_OUTPUT": {
            // let d = {
            //     question_id: action.question_id,
            //     name: action.name,
            //     question: action.question,
            //     input_output_list: action.input_output_list,
            //     code: action.code,
            // };
            // saveToLocalStorage('playground_question_dict', JSON.stringify(d));s
            
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

                user_code_submission_history_objects: action.user_code_submission_history_objects
            }
        }


        case "UPDATE_TEST_CASE_LIST": {

            return {...state, test_case_list: action.test_case_list};

        }


        case "UPDATE_SUBMISSION_RESULTS": {

            return {
                ...state,

                all_test_cases_passed: action.all_test_cases_passed,
                program_output_result: action.program_output_result,
                ai_tutor_feedback: action.ai_tutor_feedback,
                user_code_submission_history_objects: action.user_code_submission_history_objects
            }

        }


        // case "SET_RANDOM_INITIAL_QUESTION": {

        //     // const random_question_dict = INITIAL_QUESTION_LIST[Math.floor(Math.random() * INITIAL_QUESTION_LIST.length)];
        //     // console.log('random-question-dict:', random_question_dict);
            
        //     // let d = {
        //     //     name: random_question_dict['name'],
        //     //     question: random_question_dict['question'],
        //     //     input_output_list: random_question_dict['input_output_list'],
        //     //     code: random_question_dict['starter_code'],
        //     //     console_output: state.console_output,
        //     // };
        //     // saveToLocalStorage('playground_question_dict', JSON.stringify(d));
        //     // return d;
        // }

        case "UPDATE_CODE_STATE": {
            // console.log('UPDATE CODE STATE:', action.code);
            const pg_question_dict = {
                question_id: state.question_id,
                name: state.name,
                question: state.question,
                input_output_list: state.input_output_list,
                code: action.code,
                // console_output: state.console_output
            }

            saveToLocalStorage('playground_question_dict', JSON.stringify(pg_question_dict));
            return {...state, code: action.code};
        }

        case "UPDATE_CONSOLE_OUTPUT": {
            // let pg_question_dict = {
            //     name: state.name,
            //     question: state.question,
            //     input_output_list: state.input_output_list,
            //     code: state.code,
            //     console_output: action.output
            // }
            // saveToLocalStorage('playground_question_dict', JSON.stringify(pg_question_dict));
            return {...state, console_output: action.output};
        }

        // case "SET_QUESTION":
        //     return { ...state, question: action.payload };

        // case "ADD_INPUT_OUTPUT":
        //     return { 
        //         ...state, 
        //         input_output_list: [...state.input_output_list, action.payload] 
        //     };

        // case "CLEAR_INPUT_OUTPUT":
        //     return { ...state, input_output_list: action.payload };

        // default:
        //     throw new Error(`Unhandled action type: ${action.type}`);
    }
};