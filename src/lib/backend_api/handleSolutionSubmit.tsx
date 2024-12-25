import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function handleSolutionSubmit(accessToken: string, lecture_question_id: string, code: string) {

    const endPointUrl = `${API_BACKEND_URL}/handle_lecture_question_submission`;

    let payload = {
        'lecture_question_id': lecture_question_id,
        'code': code
    };

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        payload,
    );
    return apiResponse;

}