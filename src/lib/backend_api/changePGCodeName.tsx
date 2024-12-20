import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function changePGCodeName(accessToken: string, current_conversation_id: string, new_conversation_name: string) {

    const endPointUrl = `${API_BACKEND_URL}/change_pg_code_name`;
    const payload = {
        'current_conversation_id': current_conversation_id,
        'new_conversation_name': new_conversation_name
    };

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        payload, 
    );
    return apiResponse;

}