import handleAPIFetch from "../utils/handleAPIFetch";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchDashboardCourseHomeData(user_id: string, accessToken: string) {

    const endPointUrl = `${API_BACKEND_URL}/fetch_course_dashboard_home_data`;

    const data = {
        'user_id': user_id
    };
    
    const apiResponse = await handleAPIFetch(
        endPointUrl,
        "POST",
        accessToken,
        data, 
    );
    return apiResponse;

}