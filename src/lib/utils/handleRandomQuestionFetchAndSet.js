import { getRandomInitialPlaygroundQuestion } from '../backend_api/getRandomInitialPlaygroundQuestion';
// import { saveToLocalStorage } from './localStorageUtils';
import { updatePlaygroundState } from './dispatchUtils';


export default async function handleRandomQuestionFetchAndSet(anon_user_id, user_access_token, dispatch, is_authenticated, current_playground_state) {

    const random_question_dict_response = await getRandomInitialPlaygroundQuestion(
        anon_user_id,
        user_access_token
    );
    console.log('current-pg-state-new:', current_playground_state);

    if (random_question_dict_response['success'] === true){

        const random_question_data = random_question_dict_response['data'];
        const new_state_dict = {
            // question info
            question_id: null,
            name: random_question_data['name'],
            question: random_question_data['text'],
            input_output_list: random_question_data['example_io_list'],
            code: random_question_data['starter_code'],
            console_output: current_playground_state.console_output,
            lecture_question: false,
            test_case_list: [],

            // submission feedback
            all_test_cases_passed: null,
            program_output_result: [],
            ai_tutor_feedback: null,
            user_code_submission_history_objects: []
        };

        updatePlaygroundState(
            dispatch, new_state_dict, is_authenticated
        );
        
        return {'success': true};

    } else {
        return {'error': true};
    }

};