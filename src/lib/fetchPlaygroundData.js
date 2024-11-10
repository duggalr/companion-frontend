
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchPlaygroundData(accessToken, pid) {

    let endPointUrl = API_BACKEND_URL + '/fetch-playground-data';
    let d = {'pid': pid};

    const apiResponse = await fetch(endPointUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        data: JSON.stringify(d)
    });
    const data = await apiResponse.json();
    return data;

}