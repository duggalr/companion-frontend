import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import useUserContext from "../lib/hooks/useUserContext";
import { PlaygroundState } from "./types";
import { playgroundReducer, PlaygroundAction } from "../reducers/playgroundReducer";
// import { INITIAL_QUESTION_LIST } from "../lib/constants/initial_question_list";


// TODO: update state
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
            
            // // Assume nothing in localstorage
            dispatch({type: "SET_RANDOM_INITIAL_QUESTION"})
            
            // const random_question_dict = INITIAL_QUESTION_LIST[Math.floor(Math.random() * INITIAL_QUESTION_LIST.length)];
            // console.log('random-question-dict:', random_question_dict);
            // dispatch({
            //     type: "SET_QUESTION_INPUT_OUTPUT",
            //     question: random_question_dict['question'],
            //     input_output_list: random_question_dict['input_output_list'],
            //     code: random_question_dict['starter_code']
            // });

        }

    }, [isAuthenticated, userAccessToken]);

    return (
        <PlaygroundContext.Provider value={{ state, dispatch }}>
            {children}
        </PlaygroundContext.Provider>
    );
};