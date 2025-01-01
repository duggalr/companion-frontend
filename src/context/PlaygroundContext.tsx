import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import useUserContext from "@/lib/hooks/useUserContext";
import { PlaygroundState } from "./types";
import { playgroundReducer, PlaygroundAction } from "@/reducers/playgroundReducer";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils/localStorageUtils";
import { getRandomInitialPlaygroundQuestion } from '@/lib/backend_api/getRandomInitialPlaygroundQuestion';
import { fetchQuestionData } from '@/lib/backend_api/fetchQuestionData';
import { fetchLessonQuestionData } from '@/lib/backend_api/fetchLessonQuestionData';
// import handleRandomQuestionSet from "@/lib/utils/handleRandomQuestionSet";
// import handleRandomQuestionFetchAndSet from "@/lib/utils/handleRandomQuestionSet";
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
        user_code_submission_history_objects: []
    };

    const [state, dispatch] = useReducer(playgroundReducer, initialState);
    const {isAuthenticated, userAccessToken} = useUserContext();

    const _setRandomQuestion = async () => {
        
        const current_user_id = await getFromLocalStorage('user_id');
        let random_question_set_response = await handleRandomQuestionFetchAndSet(
            current_user_id,
            userAccessToken,
            dispatch,
            isAuthenticated,
            state
        );

        if ('error' in random_question_set_response){
            console.log('Error fetching random question...');
        };
        

        // const random_question_dict_response = await getRandomInitialPlaygroundQuestion(
        //     current_user_id,
        //     userAccessToken
        // );

        // if (random_question_dict_response['success'] === true){

        //     const random_question_data = random_question_dict_response['data'];

        //     const new_state_dict = {
        //         // question info
        //         question_id: null,
        //         name: random_question_data['name'],
        //         question: random_question_data['text'],
        //         input_output_list: random_question_data['example_io_list'],
        //         code: random_question_data['starter_code'],
        //         console_output: state.console_output,
        //         lecture_question: false,
        //         test_case_list: [],

        //         // submission feedback
        //         all_test_cases_passed: null,
        //         program_output_result: [],
        //         ai_tutor_feedback: null,
        //         user_code_submission_history_objects: []
        //     };

        //     updatePlaygroundState(
        //         dispatch, new_state_dict, isAuthenticated
        //     );

        //     // // Dispatch
        //     // dispatch({
        //     //     type: "SET_PLAYGROUND_STATE",

        //     //     // question info
        //     //     question_id: null,
        //     //     name: random_question_data['name'],
        //     //     question: random_question_data['text'],
        //     //     input_output_list: random_question_data['example_io_list'],
        //     //     code: random_question_data['starter_code'],
        //     //     console_output: state.console_output,
        //     //     lecture_question: false,
        //     //     test_case_list: [],

        //     //     // submission feedback
        //     //     all_test_cases_passed: null,
        //     //     program_output_result: [],
        //     //     ai_tutor_feedback: null,
        //     //     user_code_submission_history_objects: []
        //     // });

        //     // if (!isAuthenticated) {
        //     //     // Save in Local Storage
        //     //     saveToLocalStorage("playground_question_dict", JSON.stringify(new_state_dict));
        //     // };

        // }
        // else {

        //     console.log('Error fetching random question...')

        // }

    }

    const _setExistingQuestionData = async (question_object_id: string) => {
        
        // TODO: review as this seems to be pulling the wrong data (start at dash)
        const question_data_response = await fetchQuestionData(
            question_object_id,
            userAccessToken
        );
        
        console.log('question_data_response-->', question_data_response);
 
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

    // TODO:
    const _setLessonQuestionData = async (lesson_qid: string) => {

        let question_data_response = await fetchLessonQuestionData(
            lesson_qid,
            userAccessToken
        );
        console.log('lesson-question-data:', question_data_response);

        // window.history.pushState({}, '', `/playground?qid=${current_qid}`);
        // initial_lesson_qid

        if (question_data_response['success'] === true){
            let qdata = question_data_response['data'];
            console.log('q-data:', qdata);
            
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


            // if (isAuthenticated === true){

            //     let qid = qdata['question_object_id'];

            //     // console.log('user_question_lecture_object:', qid);

            //     console.log("TESTING PG Q-OUTPUT:", qdata);

            //     dispatch({
            //         type: "SET_QUESTION_INPUT_OUTPUT",
            //         question_id: qid,
            //         name: qdata['name'],
            //         question: qdata['exercise'],
            //         input_output_list: qdata['input_output_list'],
            //         code: qdata['user_code'],

            //         lecture_question: true,
            //         test_case_list: qdata['test_case_list'],
            //         all_test_cases_passed: null,
            //         program_output_result: [],
            //         ai_tutor_feedback: null,

            //         user_code_submission_history_objects: qdata['user_code_submission_history_objects']
            //     });

            // } else {

            //     dispatch({
            //         type: "SET_QUESTION_INPUT_OUTPUT",
            //         question_id: "",
            //         name: qdata['name'],
            //         question: qdata['exercise'],
            //         input_output_list: qdata['input_output_list'],
            //         code: qdata['user_code'],
                    
            //         lecture_question: true,
            //         test_case_list: qdata['test_case_list'],
            //         all_test_cases_passed: null,
            //         program_output_result: [],
            //         ai_tutor_feedback: null,

            //         user_code_submission_history_objects: qdata['user_code_submission_history_objects']
            //     });

            // }

        }

    }

    // Load data from localStorage on initial load
    useEffect(() => {

        // let pg_obj_id = searchParams['pid'];
        const url_search_params = new URLSearchParams(window.location.search);
        const lesson_question_object_id = url_search_params.get('lesson_quid');
        const question_object_id = url_search_params.get('qid');
    
        if (lesson_question_object_id){

            // TODO: fetch_lesson_question_data
            _setLessonQuestionData(lesson_question_object_id);

        } else {

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
                
                else {
        
                    _setRandomQuestion();

                    // const url_search_params = new URLSearchParams(window.location.search);
                    // const new_question_value = url_search_params.get('new');

                    // if (new_question_value === 'true'){
                        
                    //     const current_pg_qdict_json = JSON.parse(current_pg_qdict);
                    //     dispatch({
                    //         type: "SET_PLAYGROUND_STATE",
                            
                    //         // question info
                    //         question_id: current_pg_qdict_json['question_id'],
                    //         name: current_pg_qdict_json['name'],
                    //         question: current_pg_qdict_json['question'],
                    //         input_output_list: current_pg_qdict_json['input_output_list'],
                    //         code: current_pg_qdict_json['code'],
                    //         console_output: state.console_output,
                    //         lecture_question: false,
                    //         test_case_list: [],

                    //         // submission feedback
                    //         all_test_cases_passed: null,
                    //         program_output_result: [],
                    //         ai_tutor_feedback: null,
                    //         user_code_submission_history_objects: []
                    //     });
        
                    // } else {

                    //     _setRandomQuestion();

                    // }

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
