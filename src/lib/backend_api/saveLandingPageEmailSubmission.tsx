import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function saveLandingPageEmailSubmission(email: string){

    const endPointUrl = `${API_BACKEND_URL}/save_landing_page_email`;
    const payload = {
        'email': email
    };

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        null,
        payload
    );
    return apiResponse;

}