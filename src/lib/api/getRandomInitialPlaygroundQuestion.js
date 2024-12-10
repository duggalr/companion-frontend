const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function getRandomInitialPlaygroundQuestion() {

    let endPointUrl = API_BACKEND_URL + '/get_random_initial_pg_question';

    const apiResponse = await fetch(endPointUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    });
    const data = await apiResponse.json();
    return data;

}