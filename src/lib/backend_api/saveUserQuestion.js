import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function saveUserQuestion(accessToken, payload) {

    const endPointUrl = API_BACKEND_URL + '/save_user_question';

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        payload
    );
    return apiResponse;

}
