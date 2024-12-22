import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchLessonQuestionData(
    lesson_question_object_id: string | null,
    token: string | null
) {

    const endPointUrl = API_BACKEND_URL + '/fetch_lesson_question_data';
    const payload = {
        'lesson_question_id': lesson_question_object_id
    }

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        token,
        payload
    );
    return apiResponse;

}