
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchAllGeneralTutorUserConversations(accessToken) {

    let endPointUrl = API_BACKEND_URL + '/fetch_all_user_gt_conversations';

    const apiResponse = await fetch(endPointUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
    const data = await apiResponse.json();
    return data;

}