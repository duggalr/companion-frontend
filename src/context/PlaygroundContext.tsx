import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { useRouter } from 'next/navigation';
import useUserContext from "@/lib/hooks/useUserContext";
import { PlaygroundState } from "./types";
import { playgroundReducer, PlaygroundAction } from "@/reducers/playgroundReducer";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils/localStorageUtils";
import { getRandomInitialPlaygroundQuestion } from '@/lib/backend_api/getRandomInitialPlaygroundQuestion';
import { fetchQuestionData } from '@/lib/backend_api/fetchQuestionData';
import addQIDParam from '@/lib/utils/addQidParam';
import handleRandomQuestionSet from "@/lib/utils/handleRandomQuestionSet";

// import useUserContext from "../lib/hooks/useUserContext";
// import { PlaygroundState } from "./types";
// import { playgroundReducer, PlaygroundAction } from "../reducers/playgroundReducer";
// // import { INITIAL_QUESTION_LIST } from "../lib/constants/initial_question_list";
// import { getFromLocalStorage, saveToLocalStorage } from '../lib/utils/localStorageUtils';
// import { getRandomInitialPlaygroundQuestion } from '../lib/api/getRandomInitialPlaygroundQuestion';


interface PlaygroundContextType {
    state: PlaygroundState;
    dispatch: React.Dispatch<PlaygroundAction>;
}

export const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
    
    const router = useRouter();

    const initialState: PlaygroundState = {
        question_id: "",
        name: "",
        question: "",
        input_output_list: [],
        code: "",
        console_output: null,
        // pg_object_id: null
    };

    const [state, dispatch] = useReducer(playgroundReducer, initialState);

    const {isAuthenticated, userAccessToken} = useUserContext();

    // const addQIDParam = (current_qid: string) => {
    //     window.history.pushState({}, '', `/playground?qid=${current_qid}`);
    // };

    const _setRandomQuestion = async () => {
        
        if (isAuthenticated){

            const rnd_question_dict_response = await getRandomInitialPlaygroundQuestion(
                null,
                userAccessToken
            )
            if (rnd_question_dict_response['success'] === true){

                const rnd_q_data = rnd_question_dict_response['data'];
                
                // // Update URL Param
                // addQIDParam(rnd_q_data['question_id']);
                
                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: null,
                    name: rnd_q_data['name'],
                    question: rnd_q_data['text'],
                    input_output_list: rnd_q_data['example_io_list'],
                    code: rnd_q_data['starter_code'],
                });
            }

        } 
        else {

            const current_user_id = await getFromLocalStorage('user_id');

            let rnd_question_set_response = await handleRandomQuestionSet(current_user_id);
            console.log('rnd_question_set_response', rnd_question_set_response);

            if (rnd_question_set_response){

                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: null,
                    name: rnd_question_set_response['name'],
                    question: rnd_question_set_response['question'],
                    input_output_list: rnd_question_set_response['input_output_list'],
                    code: rnd_question_set_response['code'],
                });

            }

        }

    }

    const _setExistingQuestionData = async (question_object_id: string) => {
        
        // TODO: review as this seems to be pulling the wrong data (start at dash)
        let question_data_response = await fetchQuestionData(
            question_object_id,
            userAccessToken
        );
 
        if (question_data_response['success'] === true){
            let qdata = question_data_response['data'];

            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: qdata['question_object_id'],
                name: qdata['name'],
                question: qdata['text'],
                input_output_list: qdata['example_io_list'],
                code: qdata['current_code'],
            });

        } else {

            // // TODO: return 404?
            // router.push("/404");

        }

    }

    // Load data from localStorage on initial load
    useEffect(() => {

        if (isAuthenticated) {
            
            // // Steps --> check if qid in URL; if so, fetch that question + user-access-token; else, show random question in authenticated way

            // let pg_obj_id = searchParams['pid'];
            const url_search_params = new URLSearchParams(window.location.search);
            const question_object_id = url_search_params.get('qid');
        
            // if (question_object_id !== undefined && question_object_id !== null){
            if (question_object_id){

                // fetch_question_data
                _setExistingQuestionData(question_object_id);

            } else {

                // _setRandomQuestion();
                const url_search_params = new URLSearchParams(window.location.search);
                const new_question_value = url_search_params.get('new');
                if (new_question_value === 'true'){

                    dispatch({
                        type: "SET_QUESTION_INPUT_OUTPUT",
                        question_id: null,
                        name: "Enter Question Name...",
                        question: "Enter your question text here (by pressing 'edit question')...",
                        input_output_list: [],
                        code: `def main():
    raise notImplementedError
`,
                    });

                } else {

                    _setRandomQuestion();

                }


            }

        }

        else {

            const current_pg_qdict = getFromLocalStorage('playground_question_dict');
            if (current_pg_qdict){
                const current_pg_qdict_json = JSON.parse(current_pg_qdict);

                console.log('current_pg_qdict_json;', current_pg_qdict_json);

                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: current_pg_qdict_json['question_id'],
                    name: current_pg_qdict_json['name'],
                    question: current_pg_qdict_json['question'],
                    input_output_list: current_pg_qdict_json['input_output_list'],
                    code: current_pg_qdict_json['code'],
                });
            }
            else {

                // TODO:
                    // on click of new --> delete playground question dict

                const url_search_params = new URLSearchParams(window.location.search);
                const new_question_value = url_search_params.get('new');
                if (new_question_value === 'true'){
                    
                    const current_pg_qdict_json = JSON.parse(current_pg_qdict);
                    dispatch({
                        type: "SET_QUESTION_INPUT_OUTPUT",
                        question_id: current_pg_qdict_json['question_id'],
                        name: current_pg_qdict_json['name'],
                        question: current_pg_qdict_json['question'],
                        input_output_list: current_pg_qdict_json['input_output_list'],
                        code: current_pg_qdict_json['code'],
                    });

                } else {

                    _setRandomQuestion();

                }

            }

        }

    }, [isAuthenticated, userAccessToken]);

    return (
        <PlaygroundContext.Provider value={{ state, dispatch }}>
            {children}
        </PlaygroundContext.Provider>
    );
};