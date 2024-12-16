import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function validateAnonUser(anon_user_id: string){

    const endPointUrl = `${API_BACKEND_URL}/validate-anon-user`;
    const payload = {
        'user_id': anon_user_id
    };

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        null,
        payload
    );
    return apiResponse;

}