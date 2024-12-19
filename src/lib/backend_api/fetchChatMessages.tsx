import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchChatMessages(accessToken: string, question_id: string) {

    const endPointUrl = `${API_BACKEND_URL}/fetch_playground_question_chat_messages`;

    let payload = {'question_id': question_id};

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        payload,
    );
    return apiResponse;

}