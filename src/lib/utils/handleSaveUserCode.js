import { getFromLocalStorage } from "./localStorageUtils";
import { saveUserCode } from "@/lib/backend_api/saveUserCode";
import { updateQuestionID } from "@/lib/utils/dispatchUtils";

export const handleSaveUserCode = async (payload, dispatch, is_authenticated, user_access_token, current_playground_state) => {

    // Dispatch: Update Code State
    dispatch({type: "UPDATE_CODE_STATE", code: payload['code']});

    if (!is_authenticated){
        let anon_user_id = getFromLocalStorage("user_id");
        payload['user_id'] = anon_user_id;
    }

    // Save Code in Backend
    const savedCodeResponse = await saveUserCode(
        user_access_token,
        payload
    );

    // If Successful, Update Question ID
    if (savedCodeResponse['success'] === true) {
        const responseData = savedCodeResponse['data'];

        // Update Question ID
        updateQuestionID(
            dispatch,
            responseData,
            is_authenticated,
            current_playground_state
        );

        return {
            'success': true
        }

    } 
    // Return Error Otherwise
    else { 
        
        return {
            'error': 'Failed to save code',
            'response': savedCodeResponse
        };
    }

};