import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function updateUserQuestion(anon_user_id: string, qid: string , qname: string, qtext: string) {

    const endPointUrl = `${API_BACKEND_URL}/update_user_question`;

    const payload = {
        'user_id': anon_user_id,
        'question_id': qid,
        'question_name': qname,
        'question_text': qtext
    };

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        null,
        payload
    );
    return apiResponse;

}