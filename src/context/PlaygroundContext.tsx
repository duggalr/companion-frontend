import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import useUserContext from "@/lib/hooks/useUserContext";
import { PlaygroundState } from "./types";
import { playgroundReducer, PlaygroundAction } from "@/reducers/playgroundReducer";
import { getFromLocalStorage } from "@/lib/utils/localStorageUtils";
import { fetchQuestionData } from '@/lib/backend_api/fetchQuestionData';
import { fetchLessonQuestionData } from '@/lib/backend_api/fetchLessonQuestionData';
import { fetchProblemSetData } from '@/lib/backend_api/fetchProblemSetData';
import handleRandomQuestionFetchAndSet from "@/lib/utils/handleRandomQuestionFetchAndSet";
import { updatePlaygroundState } from "@/lib/utils/dispatchUtils";


interface PlaygroundContextType {
    state: PlaygroundState;
    dispatch: React.Dispatch<PlaygroundAction>;
}

export const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const PlaygroundProvider = ({ children }: { children: ReactNode }) => {

    const initialState: PlaygroundState = {
        // question information
        question_id: "",
        name: "",
        question: "",
        input_output_list: [],
        code: "",
        console_output: null,
        lecture_question: null,
        test_case_list: [],

        // submission feedback
        all_test_cases_passed: null,
        program_output_result: [],
        ai_tutor_feedback: null,
        user_code_submission_history_objects: [],

        next_lecture_number: null,
        next_question_object_id: null,
        next_question_object_type: null,

        // problem set
        problem_set_object_id: null,
        problem_set_question: null,
        problem_set_current_part: null,
        problem_set_next_part: null,
        problem_set_question_list: {}
    };

    const [state, dispatch] = useReducer(playgroundReducer, initialState);
    const {isAuthenticated, userAccessToken} = useUserContext();

    const _setRandomQuestion = async () => {
        
        const current_user_id = await getFromLocalStorage('user_id');
        const random_question_set_response = await handleRandomQuestionFetchAndSet(
            current_user_id,
            userAccessToken,
            dispatch,
            isAuthenticated,
            state
        );

        if ('error' in random_question_set_response){
            console.log('Error fetching random question...');
        };

    }

    const _setExistingQuestionData = async (question_object_id: string) => {
        
        // TODO: review as this seems to be pulling the wrong data (start at dash)
        const question_data_response = await fetchQuestionData(
            question_object_id,
            userAccessToken
        );
        
        if (question_data_response['success'] === true){
            const qdata = question_data_response['data'];

            const new_state_dict = {
                // question info
                question_id: qdata['question_object_id'],
                name: qdata['name'],
                question: qdata['text'],
                input_output_list: qdata['example_io_list'],
                code: qdata['current_code'],
                console_output: state.console_output,
                lecture_question: false,
                test_case_list: [],

                // submission feedback
                all_test_cases_passed: null,
                program_output_result: [],
                ai_tutor_feedback: null,
                user_code_submission_history_objects: []
            };

            updatePlaygroundState(
                dispatch, new_state_dict, isAuthenticated
            );

        } else {
            
            // 404
            window.location.href = '/404';

        }

    }

    const _setLessonQuestionData = async (lesson_qid: string) => {

        const question_data_response = await fetchLessonQuestionData(
            lesson_qid,
            userAccessToken
        );

        if (question_data_response['success'] === true){
            const qdata = question_data_response['data'];

            let qid;
            if (isAuthenticated === true){
                qid = qdata['question_object_id'];
            } else {
                qid = "";
            }

            dispatch({
                type: "SET_PLAYGROUND_STATE",

                question_id: qid,
                name: qdata['name'],
                question: qdata['exercise'],
                input_output_list: qdata['input_output_list'],
                code: qdata['user_code'],

                console_output: state.console_output,

                lecture_question: true,
                test_case_list: qdata['test_case_list'],
                all_test_cases_passed: null,
                program_output_result: [],
                ai_tutor_feedback: null,

                user_code_submission_history_objects: qdata['user_code_submission_history_objects']
            });

            dispatch({
                type: "UPDATE_NEXT_LECTURE_NUMBER_AND_QUESTION",
                next_lecture_number: qdata['next_lecture_number'],
                next_question_object_id: qdata['next_question_object_id'],
                next_question_object_type: qdata['next_question_object_type']
            });

        }

    }

    const _setProblemSetQuestionData = async (problem_set_object_id: string) => {

        // TODO: 
        const ps_data_response = await fetchProblemSetData(
            problem_set_object_id,
            userAccessToken
        );

        if (ps_data_response['success'] === true){

            const current_problem_set_data = ps_data_response['current_question_state'];

            dispatch({
                type: "SET_PROBLEM_SET_PLAYGROUND_STATE",

                question_id: current_problem_set_data['question_id'],
                name: current_problem_set_data['name'],
                question: current_problem_set_data['question'],
                input_output_list: current_problem_set_data['input_output_list'],

                code: current_problem_set_data['code'],
                
                lecture_question: current_problem_set_data['lecture_question'],
                test_case_list: current_problem_set_data['test_case_list'],
                
                // submission history
                all_test_cases_passed: null,
                program_output_result: [],
                ai_tutor_feedback: null,
                user_code_submission_history_objects: current_problem_set_data['user_code_submission_history_objects'],

                next_lecture_number: current_problem_set_data['next_lecture_number'],
                next_question_object_id: current_problem_set_data['next_question_object_id'],
                next_question_object_type: current_problem_set_data['next_question_object_type'],
            
                problem_set_object_id: problem_set_object_id,
                problem_set_question: true,
                problem_set_current_part: current_problem_set_data['problem_set_current_part'],
                problem_set_next_part: current_problem_set_data['problem_set_next_part'],
                problem_set_question_list: ps_data_response['data']
            });

        }

    }

    // Load data from localStorage on initial load
    useEffect(() => {

        // let pg_obj_id = searchParams['pid'];
        const url_search_params = new URLSearchParams(window.location.search);
    
        const problem_set_object_id = url_search_params.get('psid');
        const lesson_question_object_id = url_search_params.get('lesson_quid');
        const question_object_id = url_search_params.get('qid');

        if (problem_set_object_id){

            _setProblemSetQuestionData(
                problem_set_object_id
            );

        } else if (lesson_question_object_id){

            // TODO: fetch_lesson_question_data
            _setLessonQuestionData(lesson_question_object_id);

        }
        else {

            if (isAuthenticated) {
                
                if (question_object_id) {

                    // fetch_question_data
                    _setExistingQuestionData(question_object_id);

                } else {

                    const url_search_params = new URLSearchParams(window.location.search);
                    const new_question_value = url_search_params.get('new');
                    if (new_question_value === 'true'){

                        dispatch({
                            type: "SET_PLAYGROUND_STATE",

                            // question info
                            question_id: null,
                            name: "Enter Question Name...",
                            question: "Enter your question text here (by pressing 'edit question')...",
                            input_output_list: [],
                            code: `def main():\n    raise notImplementedError`,
                            console_output: state.console_output,
                            lecture_question: false,
                            test_case_list: [],

                            // submission feedback
                            all_test_cases_passed: null,
                            program_output_result: [],
                            ai_tutor_feedback: null,
                            user_code_submission_history_objects: []
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

                    if (!('question' in current_pg_qdict_json)){  // invalid playground dict in localstorage so set random question

                        _setRandomQuestion();

                    } else {

                        dispatch({
                            type: "SET_PLAYGROUND_STATE",
    
                            // question info
                            question_id: current_pg_qdict_json['question_id'],
                            name: current_pg_qdict_json['name'],
                            question: current_pg_qdict_json['question'],
                            input_output_list: current_pg_qdict_json['input_output_list'],
                            code: current_pg_qdict_json['code'],
                            console_output: state.console_output,
                            lecture_question: false,
                            test_case_list: [],
    
                            // submission feedback
                            all_test_cases_passed: null,
                            program_output_result: [],
                            ai_tutor_feedback: null,
                            user_code_submission_history_objects: []
                        });

                    }

                }
                
                else {
        
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