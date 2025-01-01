import addQIDParam from '@/lib/utils/addQidParam';
import { saveToLocalStorage } from "@/lib/utils/localStorageUtils";

export const updateQuestionID = (dispatch, response_data, isAuthenticated, state) => {
    dispatch({
        type: "UPDATE_QUESTION_ID",
        question_id: response_data['question_id'],
    });

    if (isAuthenticated) {
        // Add Question ID to the URL if not already there
        if (state.lecture_question !== true) {
            addQIDParam(response_data['question_id']);
        }
    } else {
        // Update state dict in localStorage
        const new_state_dict = {
            ...state,
            question_id: response_data['question_id'],
        };
        saveToLocalStorage('playground_question_dict', JSON.stringify(new_state_dict));
    }
};

export const updatePlaygroundState = (dispatch, payload, isAuthenticated) => {

    // Dispatch
    dispatch({
        type: "SET_PLAYGROUND_STATE",
        ...payload
    });

    if (!isAuthenticated) {
        // Save in Local Storage
        saveToLocalStorage("playground_question_dict", JSON.stringify(payload));
    };

}
