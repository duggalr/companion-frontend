// type DataDict = {
//     [key: string]: string;
// }

// export default async function handleAPIFetch(
//     endpoint_url: string,
//     method: 'GET' | 'POST' | 'PUT' | 'DELETE',
//     access_token: string | null,
//     data: DataDict | null
// ): Promise<any | null> {

export default async function handleAPIFetch(endpoint_url, method, access_token, data) {

    try {

        let apiResponse;

        if (data !== null){

            if (access_token !== null){

                apiResponse = await fetch(endpoint_url, {
                    method: method,
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

            } else {

                apiResponse = await fetch(endpoint_url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                    
            }

        } else {

            if (access_token !== null){

                apiResponse = await fetch(endpoint_url, {
                    method: method,
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json"
                    }
                });

            } else {

                apiResponse = await fetch(endpoint_url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

            }

        }
        
        if (!apiResponse.ok) {
            // console.error(`Error: ${apiResponse.statusText}`);
            // return null;
            return {
                'success': false,
                'error_message': apiResponse.statusText
            };
        }

        const response_data = await apiResponse.json();
        return response_data;

    } catch {
        return null;
    }

}