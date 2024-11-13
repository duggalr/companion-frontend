
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function validAuthenticatedUser(accessToken) {

    let endPointUrl = API_BACKEND_URL + '/validate-authenticated-user';

    const apiResponse = await fetch(endPointUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
    });
    const data = await apiResponse.json();
    return data;

}