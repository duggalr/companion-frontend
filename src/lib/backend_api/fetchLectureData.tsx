import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchLectureData(
    lecture_number: string,
    token: string | null
) {
    
    const endPointUrl = API_BACKEND_URL + '/fetch_lecture_data';
    const payload = {
        'lecture_number': lecture_number
    }

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        token,
        payload
    );
    return apiResponse;

}