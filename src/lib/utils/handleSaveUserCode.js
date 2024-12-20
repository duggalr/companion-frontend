import { usePlaygroundContext } from "@/lib/hooks/usePlaygroundContext";
import { saveUserCode } from "@/lib/backend_api/saveUserCode";
// import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils/localStorageUtils";

export const _handleUserSaveCode = async (user_access_token, payload) => {

    // const { state, dispatch } = usePlaygroundContext();

    let saveCodeRes = await saveUserCode(
        user_access_token,
        payload
    );
    console.log('SAVED-CODE-RES:', saveCodeRes);

    if (saveCodeRes['success'] === true){

        let response_data = saveCodeRes['data'];
        return response_data;

    }

    // let question_object_id = saveCodeRes['data']['question_object_id'];

    // let tmp_d = {
    //     question_id: question_object_id,
    //     name: state.name,
    //     question: state.question,
    //     input_output_list: state.input_output_list,
    //     code: codeRef.current
    // };
    // return tmp_d;

};