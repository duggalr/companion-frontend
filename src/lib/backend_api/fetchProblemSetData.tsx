import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchProblemSetData(
    problem_set_object_id: string | null,
    token: string | null
) {

    const endPointUrl = API_BACKEND_URL + '/fetch_problem_set_question_data';
    const payload = {'problem_set_object_id': problem_set_object_id};

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        token,
        payload
    );
    return apiResponse;

}