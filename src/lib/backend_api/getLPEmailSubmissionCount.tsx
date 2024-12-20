import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function getLPEmailSubmissionCount() {

    const endPointUrl = API_BACKEND_URL + '/get_number_of_lp_email_submissions';
    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        null,
        null
    );
    return apiResponse;

}