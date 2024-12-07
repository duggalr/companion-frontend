
const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export async function fetchDashboardData(accessToken) {

    let endPointUrl = `${API_BACKEND_URL}/fetch-dashboard-data`;

    try {
        const apiResponse = await fetch(endPointUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
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