import { saveUserCode } from "@/lib/backend_api/saveUserCode";

export const _handleUserSaveCode = async (user_access_token, payload) => {

    let saveCodeRes = await saveUserCode(
        user_access_token,
        payload
    );

    if (saveCodeRes['success'] === true){

        let response_data = saveCodeRes['data'];
        return response_data;

    }

};