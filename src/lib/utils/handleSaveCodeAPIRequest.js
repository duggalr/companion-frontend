import { saveUserCode } from "../backend_api/saveUserQuestion";

export const handleSaveCodeAPIRequest = async (user_access_token, payload) => {

    const saveCodeRes = await saveUserCode(
        user_access_token,
        payload
    );
    return saveCodeRes;

}