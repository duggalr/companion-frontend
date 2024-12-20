import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function getRandomInitialPlaygroundQuestion(
    current_user_id: string | null,
    token: string | null
) {

    const endPointUrl = API_BACKEND_URL + '/get_random_initial_pg_question';

    let payload = null;
    if (current_user_id){
        payload = {'user_id': current_user_id};
    }

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        token,
        payload
    );
    return apiResponse;

}