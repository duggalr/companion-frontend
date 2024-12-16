import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function updateUserQuestion(anon_user_id: string, qid: string , qname: string, qtext: string) {

    let endPointUrl = `${API_BACKEND_URL}/update_user_question`;

    let payload = {
        'user_id': anon_user_id,
        'question_id': qid,
        'question_name': qname,
        'question_text': qtext
    };

    let apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        null,
        payload
    );
    return apiResponse;

}