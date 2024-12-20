import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function saveUserCode(accessToken, payload) {

    const endPointUrl = API_BACKEND_URL + '/save_user_code';

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        payload
    );
    return apiResponse;

}