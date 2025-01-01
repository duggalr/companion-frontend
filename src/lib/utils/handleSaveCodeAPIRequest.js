// import { _handleUserSaveCode } from "./handleSaveUserCode";
import { saveUserCode } from "../backend_api/saveUserQuestion";

// "@/lib/backend_api/saveUserCode";

export const handleSaveCodeAPIRequest = async (user_access_token, payload) => {

    const saveCodeRes = await saveUserCode(
        user_access_token,
        payload
    );
    return saveCodeRes;

    // let user_save_code_response_dict = await _handleUserSaveCode(
    //     userAccessToken,
    //     payload
    // );

    // if (saveCodeRes['success'] === true){

    //     let response_data = saveCodeRes['data'];
    //     return response_data;

    // } else {

    //     console.log('Could not save user code...')
        
    // }


    // // Update Question ID with dispatch
    // dispatch({
    //     type: "UPDATE_QUESTION_ID",
    //     question_id: user_save_code_response_dict['question_id']
    // });

    // if (isAuthenticated){
    //     // Add Question ID to url if not already there
    //     if (state.lecture_question != true){
    //         addQIDParam(user_save_code_response_dict['question_id']);
    //     }
    // } else {
    //     // Update state dict in localstorage
    //     const new_state_dict = {
    //         question_id: user_save_code_response_dict['question_id'],
    //         ...state,
    //     }
    //     saveToLocalStorage('playground_question_dict', JSON.stringify(new_state_dict));
    // }

}