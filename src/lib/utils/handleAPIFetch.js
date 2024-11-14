export default async function handleAPIFetch(endpoint_url, method, access_token, formData) {

    try {
        let apiResponse;
        
        if (formData !== null) {

            apiResponse = await fetch(endpoint_url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

        } else {

            apiResponse = await fetch(endpoint_url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
            });

        }

        if (!apiResponse.ok) {
            console.error(`Error: ${apiResponse.statusText}`);
            return null;
        }

        const response_data = await apiResponse.json();
        return response_data;

    } catch {
        return null;
    }

}