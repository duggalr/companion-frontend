const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function getRandomInitialPlaygroundQuestion(current_user_id) {

    let endPointUrl = API_BACKEND_URL + '/get_random_initial_pg_question';

    let payload = {'user_id': current_user_id}

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