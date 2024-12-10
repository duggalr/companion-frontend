
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function submitUserCode(payload) {

    let endPointUrl = API_BACKEND_URL + '/submit_user_code';

    const apiResponse = await fetch(endPointUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await apiResponse.json();
    return data;

}