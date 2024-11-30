// TODO: 

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function createAnonUser(anon_user_id) {

    let endPointUrl = `${API_BACKEND_URL}/create-anon-user`;
    let payload = {
        'anon_user_id': anon_user_id
    };

    try {
        const apiResponse = await fetch(endPointUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            console.error(`Error: ${apiResponse.statusText}`);
            return null;
        }

        const data = await apiResponse.json();
        return data;

    } catch (error) {

        console.error("Fetch error:", error);
        return null;

    }

}