const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function getRandomInitialPlaygroundQuestion(access_token, current_user_id) {

    let endPointUrl = API_BACKEND_URL + '/get_random_initial_pg_question';

    let payload = {'user_id': current_user_id}

    if (access_token !== null){

        const apiResponse = await fetch(endPointUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await apiResponse.json();
        return data;

    } else {

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

}