import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import useUserContext from "../lib/hooks/useUserContext";
import { PlaygroundState } from "./types";
import { playgroundReducer, PlaygroundAction } from "../reducers/playgroundReducer";
// import { INITIAL_QUESTION_LIST } from "../lib/constants/initial_question_list";
import { getFromLocalStorage } from '../lib/utils/localStorageUtils';


interface PlaygroundContextType {
    state: PlaygroundState;
    dispatch: React.Dispatch<PlaygroundAction>;
}

export const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {
    const initialState: PlaygroundState = {
        name: "",
        question: "",
        input_output_list: [],
        code: ""
    };

    const [state, dispatch] = useReducer(playgroundReducer, initialState);

    const {isAuthenticated, userAccessToken} = useUserContext();
    
    // Load data from localStorage on initial load
    useEffect(() => {

        if (!isAuthenticated){

            let current_pg_qdict = getFromLocalStorage('playground_question_dict');
            if (current_pg_qdict){

                let current_pg_qdict_json = JSON.parse(current_pg_qdict);
                // set current localstorage dict to state
                dispatch({
                    type: "SET_QUESTION_INPUT_OUTPUT",
                    name: current_pg_qdict_json['name'],
                    question: current_pg_qdict_json['question'],
                    input_output_list: current_pg_qdict_json['input_output_list'],
                    code: current_pg_qdict_json['code']
                });

            } else {

                dispatch({type: "SET_RANDOM_INITIAL_QUESTION"});

            }

        }

    }, [isAuthenticated, userAccessToken]);

    return (
        <PlaygroundContext.Provider value={{ state, dispatch }}>
            {children}
        </PlaygroundContext.Provider>
    );
};