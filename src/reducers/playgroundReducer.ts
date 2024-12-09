// import { saveToLocalStorage } from "../utils/localStorageUtils"; // Assuming this utility handles localStorage
import {PlaygroundState, QuestionInputOutputPair} from '../context/types';
import {INITIAL_QUESTION_LIST} from '../lib/constants/initial_question_list';
// import { getFromLocalStorage } from '../lib/utils/localStorageUtils';
import { saveToLocalStorage } from '../lib/utils/localStorageUtils';

// export interface PlaygroundState {
//     question: string;
//     input_output_list: Array<string>;
// }

export type PlaygroundAction =
    | {type: "SET_QUESTION_INPUT_OUTPUT"; name: string, question: string, input_output_list: QuestionInputOutputPair[], code: string}
    | {type: "SET_RANDOM_INITIAL_QUESTION";}
    | {type: "UPDATE_CODE_STATE"; code: string}

    // | { type: "SET_QUESTION"; payload: string }
    // | { type: "ADD_INPUT_OUTPUT"; payload: string }
    // | { type: "CLEAR_INPUT_OUTPUT"; payload: [] }; // For clearing the list, if needed


// "{\"name\":\"Run-Length Decoding\",\"question\":\"Create a function to perform a run-length decoding of a string (e.g., \\\"a3b2\\\" -> \\\"aaabb\\\").\",\"input_output_list\":[{\"input\":\"\\\"a3b2c1\\\"\",\"output\":\"\\\"aaabbc\\\"\"},{\"input\":\"\\\"x5y2\\\"\",\"output\":\"\\\"xxxxxyy\\\"\"},{\"input\":\"\\\"z1\\\"\",\"output\":\"\\\"z\\\"\"}],\"code\":\"def run_length_decode(s: str) -> str:\\n    raise NotImplementedError\"}"

// Reducer logic
export const playgroundReducer = (state: PlaygroundState, action: PlaygroundAction): PlaygroundState => {
    switch (action.type) {

        case "SET_QUESTION_INPUT_OUTPUT":
            let d = {
                name: action.name,
                question: action.question,
                input_output_list: action.input_output_list,
                code: action.code
            };
            saveToLocalStorage('playground_question_dict', JSON.stringify(d));
            return {name: action.name, question: action.question, input_output_list: action.input_output_list, code: action.code}

        case "SET_RANDOM_INITIAL_QUESTION": {
            const random_question_dict = INITIAL_QUESTION_LIST[Math.floor(Math.random() * INITIAL_QUESTION_LIST.length)];
            console.log('random-question-dict:', random_question_dict);

            let d = {
                name: random_question_dict['name'],
                question: random_question_dict['question'],
                input_output_list: random_question_dict['input_output_list'],
                code: random_question_dict['starter_code']
            };
            saveToLocalStorage('playground_question_dict', JSON.stringify(d));
            return d;
        }

        case "UPDATE_CODE_STATE":
            // TODO: save to local-storage
            console.log('UPDATE CODE STATE:', action.code);
            let pg_question_dict = {
                name: state.name,
                question: state.question,
                input_output_list: state.input_output_list,
                code: action.code,
            }
            saveToLocalStorage('playground_question_dict', JSON.stringify(pg_question_dict));
            return {...state, code: action.code};

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