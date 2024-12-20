import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchQuestionData(
    question_object_id: string | null,
    token: string | null
) {

    const endPointUrl = API_BACKEND_URL + '/fetch_question_data';
    const payload = {
        'question_id': question_object_id
    }

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        token,
        payload
    );
    return apiResponse;

}