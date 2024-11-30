
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function createGeneralTutorParentObject(anon_user_id , accessToken) {

    let endPointUrl = API_BACKEND_URL + '/create-general-tutor-parent-object';

    console.log('tmp-new:', accessToken, accessToken === null)

    if (accessToken === null) {

        let payload = {
            "anon_user_id": anon_user_id
        };
        console.log('payload:', payload);

        const apiResponse = await fetch(endPointUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        const data = await apiResponse.json();
        return data;


    } else {

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

}