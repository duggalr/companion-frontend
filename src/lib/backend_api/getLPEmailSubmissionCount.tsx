import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function getLPEmailSubmissionCount() {

    let endPointUrl = API_BACKEND_URL + '/get_number_of_lp_email_submissions';
    let apiResponse = await handleAPIFetch(
        endPointUrl,
        "GET",
        null,
        null
    );
    return apiResponse;

}