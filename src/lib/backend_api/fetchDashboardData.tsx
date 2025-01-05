import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchDashboardData(
    accessToken: string | null,
    current_user_id: string | null
) {

    const endPointUrl = `${API_BACKEND_URL}/fetch_dashboard_data`;

    let payload = null;
    if (current_user_id){
        payload = {'user_id': current_user_id};
    }

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        payload,
    );
    return apiResponse;

}