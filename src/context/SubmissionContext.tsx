import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { SubmissionState } from "./types";
// import { playgroundReducer, PlaygroundAction } from "@/reducers/playgroundReducer";
import { submissionReducer, SubmissionAction } from "@/reducers/submissionReducer";
import { handleSolutionSubmit } from "@/lib/backend_api/handleSolutionSubmit";
import useUserContext from "@/lib/hooks/useUserContext";


interface SubmissionContextType {
    state: SubmissionState;
    dispatch: React.Dispatch<SubmissionAction>;
}

export const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export const SubmissionProvider = ({ children }: { children: ReactNode }) => {
    
    const initialState: SubmissionState = {
        result: null,
        ai_tutor_feedback: '',
        output_list: null
    };

    const [state, dispatch] = useReducer(submissionReducer, initialState);
    const {isAuthenticated, userAccessToken} = useUserContext();

    // const _handleSubmissionRun = async (lecture_qid: string, code: string) => {

    //     if (userAccessToken){

    //         let solutionSubmitRes = await handleSolutionSubmit(
    //             userAccessToken,
    //             lecture_qid,
    //             code
    //         );
    //         console.log('solutionSubmitRes:', solutionSubmitRes);

    //     }

    // }

    return (
        <SubmissionContext.Provider value={{ state, dispatch }}>
            {children}
        </SubmissionContext.Provider>
    )

};