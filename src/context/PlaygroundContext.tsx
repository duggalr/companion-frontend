import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import useUserContext from "../lib/hooks/useUserContext";
import { PlaygroundState } from "./types";
import { playgroundReducer, PlaygroundAction } from "../reducers/playgroundReducer";
// import { INITIAL_QUESTION_LIST } from "../lib/constants/initial_question_list";
import { getFromLocalStorage } from '../lib/utils/localStorageUtils';
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

    const _setRandomQuestion = async () => {
        
        // TODO: 
        let current_user_id = await getFromLocalStorage('user_id');
        console.log('Current User ID:', current_user_id);

        let rnd_question_dict = await getRandomInitialPlaygroundQuestion(current_user_id);
        console.log('Random Question Dict:', rnd_question_dict);

        if (rnd_question_dict['success'] === true){

            let rnd_q_data = rnd_question_dict['data'];
            console.log('data:', rnd_q_data);
            dispatch({
                type: "SET_QUESTION_INPUT_OUTPUT",
                question_id: rnd_q_data['question_id'],
                name: rnd_q_data['name'],
                question: rnd_q_data['text'],
                input_output_list: rnd_q_data['example_io_list'],
                code: rnd_q_data['starter_code'],
            });
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
        }
        else {

            let current_pg_qdict = getFromLocalStorage('playground_question_dict');
            if (current_pg_qdict){

                let current_pg_qdict_json = JSON.parse(current_pg_qdict);
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