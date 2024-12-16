import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function getRandomInitialPlaygroundQuestion(current_user_id: string | null) {

    const endPointUrl = API_BACKEND_URL + '/get_random_initial_pg_question';

    const payload = {'user_id': current_user_id}
    console.log('payload:', payload);

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        null,
        payload
    );
    return apiResponse;

}