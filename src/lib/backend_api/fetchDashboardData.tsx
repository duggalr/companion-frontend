import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchDashboardData(accessToken: string) {

    const endPointUrl = `${API_BACKEND_URL}/fetch_dashboard_data`;

    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        null, 
    );
    return apiResponse;

}