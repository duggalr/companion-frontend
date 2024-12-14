
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchGeneralTutorConversation(accessToken, cv_obj_id) {

    let endPointUrl = API_BACKEND_URL + '/fetch-general-tutor-conversation';
    let d = {'gt_object_id': cv_obj_id};

    const apiResponse = await fetch(endPointUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(d)
    });
    const data = await apiResponse.json();
    return data;

}