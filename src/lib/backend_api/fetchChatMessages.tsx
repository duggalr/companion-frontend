import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchChatMessages(
    accessToken: string,
    question_id: string,
    lecture_question: boolean | null,
    problem_set_question: boolean | null
) {

    const endPointUrl = `${API_BACKEND_URL}/fetch_playground_question_chat_messages`;

    const payload = {
        'question_id': question_id,
        'lecture_question': lecture_question,
        'problem_set_question': problem_set_question
    };

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        payload,
    );
    return apiResponse;

}