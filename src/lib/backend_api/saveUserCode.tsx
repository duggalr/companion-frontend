const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function saveUserCode(accessToken, payload) {

    let endPointUrl = API_BACKEND_URL + '/save_user_code';

    if (accessToken === null) {

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
    else {

        const apiResponse = await fetch(endPointUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await apiResponse.json();
        return data;

    }

}