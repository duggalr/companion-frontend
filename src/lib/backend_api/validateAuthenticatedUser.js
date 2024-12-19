import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function validateAuthenticatedUser(accessToken, user_profile_information_payload) {

    const endPointUrl = `${API_BACKEND_URL}/validate-authenticated-user`;

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        user_profile_information_payload
    );
    return apiResponse;

}