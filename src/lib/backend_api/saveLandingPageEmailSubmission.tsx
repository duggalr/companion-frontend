import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function saveLandingPageEmailSubmission(email: string): Promise<any | null>{

    let endPointUrl = `${API_BACKEND_URL}/save_landing_page_email`;
    let payload = {
        'email': email
    };

    let apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        null,
        payload
    );
    return apiResponse;

}