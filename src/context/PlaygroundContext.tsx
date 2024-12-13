import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import useUserContext from "../lib/hooks/useUserContext";
import { PlaygroundState } from "./types";
import { playgroundReducer, PlaygroundAction } from "../reducers/playgroundReducer";
// import { INITIAL_QUESTION_LIST } from "../lib/constants/initial_question_list";
import { getFromLocalStorage, saveToLocalStorage } from '../lib/utils/localStorageUtils';
import { getRandomInitialPlaygroundQuestion } from '../lib/api/getRandomInitialPlaygroundQuestion';


interface PlaygroundContextType {
    state: PlaygroundState;
    dispatch: React.Dispatch<PlaygroundAction>;
}

export const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
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

    
    const addQIDParam = (current_qid: string) => {
        window.history.pushState({}, '', `/playground?pid=${current_qid}`);
    };

    const _setRandomQuestion = async () => {
        
        if (isAuthenticated){

            // TODO: test
            let rnd_question_dict_response = await getRandomInitialPlaygroundQuestion(
                userAccessToken,
                null
            )
            if (rnd_question_dict_response['success'] === true){

                let rnd_q_data = rnd_question_dict_response['data'];
                console.log('data:', rnd_q_data);
                
                // Update URL Param
                addQIDParam(rnd_q_data['question_id']);
                
                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: rnd_q_data['question_id'],
                    name: rnd_q_data['name'],
                    question: rnd_q_data['text'],
                    input_output_list: rnd_q_data['example_io_list'],
                    code: rnd_q_data['starter_code'],
                });
            }

        } else {

            let current_user_id = await getFromLocalStorage('user_id');
            console.log('Current User ID:', current_user_id);

            let rnd_question_dict = await getRandomInitialPlaygroundQuestion(current_user_id);
            console.log('Random Question Dict:', rnd_question_dict);

            if (rnd_question_dict['success'] === true){

                let rnd_q_data = rnd_question_dict['data'];
                console.log('data:', rnd_q_data);          
                
                let d = {
                    question_id: rnd_q_data['question_id'],
                    name: rnd_q_data['name'],
                    question: rnd_q_data['text'],
                    input_output_list: rnd_q_data['example_io_list'],
                    code: rnd_q_data['starter_code'],
                };
                saveToLocalStorage('playground_question_dict', JSON.stringify(d));
                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: rnd_q_data['question_id'],
                    name: rnd_q_data['name'],
                    question: rnd_q_data['text'],
                    input_output_list: rnd_q_data['example_io_list'],
                    code: rnd_q_data['starter_code'],
                });

            }

        }
       
        // dispatch({
        //     type: "SET_QUESTION_INPUT_OUTPUT",
        //     question_id: rnd_question_dict['question_id'],
        //     name: rnd_question_dict['name'],
        //     question: rnd_question_dict['text'],
        //     input_output_list: rnd_question_dict['example_io_list'],
        //     code: rnd_question_dict['starter_code'],
        // });

    }

    // Load data from localStorage on initial load
    useEffect(() => {

        if (isAuthenticated) {
            // TODO: 
                // Steps --> check if qid in URL; if so, fetch that question + user-access-token; else, show random question in authenticated way

              // let pg_obj_id = searchParams['pid'];
              const url_search_params = new URLSearchParams(window.location.search);
              const question_object_id = url_search_params.get('qid');
              console.log('Question Object ID Param:', question_object_id);
            
              if (question_object_id !== undefined && question_object_id !== null){
                
                // TODO:

              } else {

                _setRandomQuestion();

              }

        }
        else {

            let current_pg_qdict = getFromLocalStorage('playground_question_dict');
            if (current_pg_qdict){

                let current_pg_qdict_json = JSON.parse(current_pg_qdict);
                console.log('initial PG-DICT-JSON:', current_pg_qdict_json);

                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    question_id: current_pg_qdict_json['question_id'],
                    name: current_pg_qdict_json['name'],
                    question: current_pg_qdict_json['question'],
                    input_output_list: current_pg_qdict_json['input_output_list'],
                    code: current_pg_qdict_json['code'],
                    // pg_object_id: current_pg_qdict_json['pg_object_id']
                });

            } else {

                _setRandomQuestion();

            }

        }

    }, [isAuthenticated, userAccessToken]);

    return (
        <PlaygroundContext.Provider value={{ state, dispatch }}>
            {children}
        </PlaygroundContext.Provider>
    );
};